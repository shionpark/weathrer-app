export interface LocationInfo {
  fullAddress: string;
  sido: string;
  sigungu?: string;
  dong?: string;
}

export interface GeocodingResult {
  lat: number;
  lon: number;
  name: string;
}
