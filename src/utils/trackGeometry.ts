export interface TrackPoint {
  lat: number;
  lng: number;
  ele: number;
  distKm: number;
}

export interface DecodedCoordinate {
  lat: number;
  lng: number;
}

export interface CompactTrackSummary {
  pathPolyline: string;
  elevationSamples: number[];
  totalDistanceKm: number;
  totalElevationGain: number;
  minAltitude: number;
  maxAltitude: number;
  startLat: number;
  startLng: number;
}

const EARTH_RADIUS_KM = 6371;
const DEG_TO_RAD = Math.PI / 180;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = (lat2 - lat1) * DEG_TO_RAD;
  const dLng = (lng2 - lng1) * DEG_TO_RAD;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * DEG_TO_RAD) * Math.cos(lat2 * DEG_TO_RAD) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Parses `<trkpt>` (with `<rtept>` fallback) coordinates and `<ele>` values from GPX XML.
 */
export function parseGpxTrackPoints(gpxXml: string): TrackPoint[] {
  if (!gpxXml || typeof gpxXml !== 'string') {
    return [];
  }

  const rawPoints: Array<{ lat: number; lng: number; ele: number }> = [];

  if (typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(gpxXml, 'application/xml');
      const parserErrors = doc.getElementsByTagName('parsererror');
      if (parserErrors.length === 0) {
        let nodes = doc.getElementsByTagName('trkpt');
        if (nodes.length === 0) {
          nodes = doc.getElementsByTagName('rtept');
        }
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const lat = Number.parseFloat(node.getAttribute('lat') ?? '');
          const lng = Number.parseFloat(node.getAttribute('lon') ?? '');
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

          const eleNode = node.getElementsByTagName('ele')[0];
          const parsedEle = eleNode ? Number.parseFloat(eleNode.textContent ?? '') : 0;
          const ele = Number.isFinite(parsedEle) ? parsedEle : 0;
          rawPoints.push({ lat, lng, ele });
        }
      }
    } catch {
      // Fallback to regex parser below
    }
  }

  if (rawPoints.length === 0) {
    const ptRegex = /<(?:trkpt|rtept)\b([^>]*)>([\s\S]*?)<\/(?:trkpt|rtept)>/gi;
    const latRegex = /\blat=["']([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)["']/i;
    const lonRegex = /\blon=["']([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)["']/i;
    const eleRegex = /<ele>([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)<\/ele>/i;

    let match: RegExpExecArray | null;
    while ((match = ptRegex.exec(gpxXml)) !== null) {
      const attrs = match[1];
      const body = match[2];
      const latMatch = latRegex.exec(attrs);
      const lonMatch = lonRegex.exec(attrs);
      if (!latMatch || !lonMatch) continue;
      const lat = Number.parseFloat(latMatch[1]);
      const lng = Number.parseFloat(lonMatch[1]);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

      const eleMatch = eleRegex.exec(body);
      const parsedEle = eleMatch ? Number.parseFloat(eleMatch[1]) : 0;
      rawPoints.push({
        lat,
        lng,
        ele: Number.isFinite(parsedEle) ? parsedEle : 0,
      });
    }
  }

  if (rawPoints.length === 0) {
    return [];
  }

  const points: TrackPoint[] = [];
  let cumulativeKm = 0;
  for (let i = 0; i < rawPoints.length; i++) {
    const pt = rawPoints[i];
    if (i > 0) {
      cumulativeKm += haversineKm(rawPoints[i - 1].lat, rawPoints[i - 1].lng, pt.lat, pt.lng);
    }
    points.push({
      lat: pt.lat,
      lng: pt.lng,
      ele: pt.ele,
      distKm: cumulativeKm,
    });
  }

  return points;
}

function perpendicularDistance(
  point: TrackPoint,
  lineStart: TrackPoint,
  lineEnd: TrackPoint,
  cosLat: number
): number {
  const x = point.lng * cosLat;
  const y = point.lat;
  const x1 = lineStart.lng * cosLat;
  const y1 = lineStart.lat;
  const x2 = lineEnd.lng * cosLat;
  const y2 = lineEnd.lat;

  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) {
    return Math.hypot(x - x1, y - y1);
  }
  const num = Math.abs(dy * x - dx * y + x2 * y1 - y2 * x1);
  const den = Math.hypot(dx, dy);
  return num / den;
}

function runDouglasPeucker(
  points: TrackPoint[],
  epsilon: number,
  cosLat: number
): TrackPoint[] {
  const n = points.length;
  if (n <= 2) return points;

  const keep = new Uint8Array(n);
  keep[0] = 1;
  keep[n - 1] = 1;

  const stack: Array<[number, number]> = [[0, n - 1]];
  while (stack.length > 0) {
    const [start, end] = stack.pop()!;
    let maxDist = 0;
    let maxIdx = -1;

    for (let i = start + 1; i < end; i++) {
      const dist = perpendicularDistance(points[i], points[start], points[end], cosLat);
      if (dist > maxDist) {
        maxDist = dist;
        maxIdx = i;
      }
    }

    if (maxIdx !== -1 && maxDist > epsilon) {
      keep[maxIdx] = 1;
      if (maxIdx - start > 1) stack.push([start, maxIdx]);
      if (end - maxIdx > 1) stack.push([maxIdx, end]);
    }
  }

  const out: TrackPoint[] = [];
  for (let i = 0; i < n; i++) {
    if (keep[i]) out.push(points[i]);
  }
  return out;
}

/**
 * Simplifies track geometry to <= maxPoints using adaptive Douglas-Peucker,
 * preserving sharp alpine bends while preventing full-resolution GPX redistribution.
 */
export function simplifyTrackGeometry(points: TrackPoint[], maxPoints = 420): TrackPoint[] {
  if (points.length <= maxPoints) {
    return points;
  }

  const midLat = points[Math.floor(points.length / 2)].lat;
  const cosLat = Math.max(0.15, Math.cos(midLat * DEG_TO_RAD));

  let low = 0.00001; // ~1m
  let high = 0.05; // ~5.5km
  let best = points;

  for (let iter = 0; iter < 16; iter++) {
    const mid = (low + high) / 2;
    const candidate = runDouglasPeucker(points, mid, cosLat);
    if (candidate.length <= maxPoints) {
      best = candidate;
      high = mid;
    } else {
      low = mid;
    }
  }

  if (best.length <= maxPoints) {
    return best;
  }

  // Uniform fallback cap preserving exact endpoints
  const step = (best.length - 1) / (maxPoints - 1);
  const capped: TrackPoint[] = [];
  for (let i = 0; i < maxPoints - 1; i++) {
    capped.push(best[Math.round(i * step)]);
  }
  capped.push(best[best.length - 1]);
  return capped;
}

function encodeSignedNumber(num: number): string {
  let sgnNum = num < 0 ? ~(num << 1) : num << 1;
  let encoded = '';
  while (sgnNum >= 0x20) {
    encoded += String.fromCharCode((0x20 | (sgnNum & 0x1f)) + 63);
    sgnNum >>= 5;
  }
  encoded += String.fromCharCode(sgnNum + 63);
  return encoded;
}

export function encodePolyline(points: Array<{ lat: number; lng: number }>): string {
  let lastLat = 0;
  let lastLng = 0;
  let result = '';

  for (const pt of points) {
    const lat = Math.round(pt.lat * 1e5);
    const lng = Math.round(pt.lng * 1e5);
    result += encodeSignedNumber(lat - lastLat);
    result += encodeSignedNumber(lng - lastLng);
    lastLat = lat;
    lastLng = lng;
  }

  return result;
}

export function decodePolyline(encoded: string): DecodedCoordinate[] {
  const coordinates: DecodedCoordinate[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20 && index < encoded.length);
    const dLat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dLat;

    shift = 0;
    result = 0;
    do {
      if (index >= encoded.length) break;
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20 && index < encoded.length);
    const dLng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dLng;

    coordinates.push({
      lat: lat / 1e5,
      lng: lng / 1e5,
    });
  }

  return coordinates;
}

/**
 * Downsamples elevation curve using Largest-Triangle-Three-Buckets (LTTB)
 * to preserve mountain cols, summits, and sharp dips cleanly, stored flat [d0, e0, ...].
 */
export function downsampleElevationFlat(points: TrackPoint[], threshold = 280): number[] {
  const n = points.length;
  if (n === 0) return [];

  const pack = (subset: TrackPoint[]): number[] => {
    const flat: number[] = [];
    for (const pt of subset) {
      flat.push(Math.round(pt.distKm * 100) / 100, Math.round(pt.ele));
    }
    return flat;
  };

  if (n <= threshold || threshold < 3) {
    return pack(points);
  }

  const sampled: TrackPoint[] = [points[0]];
  const bucketSize = (n - 2) / (threshold - 2);
  let a = 0;

  for (let i = 0; i < threshold - 2; i++) {
    const avgRangeStart = Math.floor((i + 1) * bucketSize) + 1;
    const avgRangeEnd = Math.min(Math.floor((i + 2) * bucketSize) + 1, n);
    let avgDist = 0;
    let avgEle = 0;
    const avgCount = Math.max(1, avgRangeEnd - avgRangeStart);

    for (let j = avgRangeStart; j < avgRangeEnd; j++) {
      avgDist += points[j].distKm;
      avgEle += points[j].ele;
    }
    avgDist /= avgCount;
    avgEle /= avgCount;

    const rangeOffs = Math.floor(i * bucketSize) + 1;
    const rangeTo = Math.min(Math.floor((i + 1) * bucketSize) + 1, n - 1);

    const pointADist = points[a].distKm;
    const pointAEle = points[a].ele;

    let maxArea = -1;
    let nextA = rangeOffs;

    for (let j = rangeOffs; j < rangeTo; j++) {
      const area = Math.abs(
        (pointADist - avgDist) * (points[j].ele - pointAEle) -
          (pointADist - points[j].distKm) * (avgEle - pointAEle)
      );
      if (area > maxArea) {
        maxArea = area;
        nextA = j;
      }
    }

    sampled.push(points[nextA]);
    a = nextA;
  }

  sampled.push(points[n - 1]);
  return pack(sampled);
}

export function unpackElevationSamples(flat: number[]): Array<{ d: number; e: number }> {
  const out: Array<{ d: number; e: number }> = [];
  for (let i = 0; i + 1 < flat.length; i += 2) {
    out.push({ d: flat[i], e: flat[i + 1] });
  }
  return out;
}

/**
 * Builds a sanitized geometry & elevation preview from raw GPX XML.
 */
export function buildCompactTrackSummary(
  gpxXml: string,
  fallbackDistanceKm?: number,
  fallbackElevationGain?: number
): CompactTrackSummary | null {
  const points = parseGpxTrackPoints(gpxXml);
  if (points.length < 2) {
    return null;
  }

  let minAltitude = Infinity;
  let maxAltitude = -Infinity;
  let calculatedGain = 0;
  let lastAcceptedEle = points[0].ele;
  const HYSTERESIS_METERS = 3;

  for (let i = 0; i < points.length; i++) {
    const ele = points[i].ele;
    if (ele < minAltitude) minAltitude = ele;
    if (ele > maxAltitude) maxAltitude = ele;

    const diff = ele - lastAcceptedEle;
    if (diff >= HYSTERESIS_METERS) {
      calculatedGain += diff;
      lastAcceptedEle = ele;
    } else if (diff <= -HYSTERESIS_METERS) {
      lastAcceptedEle = ele;
    }
  }

  const simplified = simplifyTrackGeometry(points, 420);
  const pathPolyline = encodePolyline(simplified);
  if (!pathPolyline) {
    return null;
  }

  const elevationSamples = downsampleElevationFlat(points, 280);
  const rawDist = points[points.length - 1].distKm;
  const totalDistanceKm =
    typeof fallbackDistanceKm === 'number' && Number.isFinite(fallbackDistanceKm) && fallbackDistanceKm > 0
      ? Math.round(fallbackDistanceKm * 10) / 10
      : Math.round(rawDist * 10) / 10;

  const totalElevationGain =
    typeof fallbackElevationGain === 'number' && Number.isFinite(fallbackElevationGain) && fallbackElevationGain >= 0
      ? Math.round(fallbackElevationGain)
      : Math.round(calculatedGain);

  const clampAlt = (v: number) => Math.max(-500, Math.min(9000, Math.round(v)));

  return {
    pathPolyline,
    elevationSamples,
    totalDistanceKm: Math.max(0, Math.min(10000, totalDistanceKm)),
    totalElevationGain: Math.max(0, Math.min(50000, totalElevationGain)),
    minAltitude: clampAlt(Number.isFinite(minAltitude) ? minAltitude : 0),
    maxAltitude: clampAlt(Number.isFinite(maxAltitude) ? maxAltitude : 0),
    startLat: Math.max(-90, Math.min(90, Math.round(points[0].lat * 1e5) / 1e5)),
    startLng: Math.max(-180, Math.min(180, Math.round(points[0].lng * 1e5) / 1e5)),
  };
}

/**
 * Interpolates a [lat, lng] position along a decoded polyline matching a distance along the route.
 */
export function interpolateCoordinateAtDistance(
  coords: DecodedCoordinate[],
  targetKm: number,
  totalKm: number
): DecodedCoordinate | null {
  if (coords.length === 0) return null;
  if (coords.length === 1 || totalKm <= 0) return coords[0];

  const ratio = Math.max(0, Math.min(1, targetKm / totalKm));
  const cumulative: number[] = [0];
  let polyLen = 0;

  for (let i = 1; i < coords.length; i++) {
    polyLen += haversineKm(coords[i - 1].lat, coords[i - 1].lng, coords[i].lat, coords[i].lng);
    cumulative.push(polyLen);
  }

  if (polyLen <= 0) return coords[0];
  const targetPolyKm = ratio * polyLen;

  for (let i = 1; i < coords.length; i++) {
    if (cumulative[i] >= targetPolyKm) {
      const segStart = cumulative[i - 1];
      const segEnd = cumulative[i];
      const segRatio = segEnd > segStart ? (targetPolyKm - segStart) / (segEnd - segStart) : 0;
      return {
        lat: coords[i - 1].lat + (coords[i].lat - coords[i - 1].lat) * segRatio,
        lng: coords[i - 1].lng + (coords[i].lng - coords[i - 1].lng) * segRatio,
      };
    }
  }

  return coords[coords.length - 1];
}
