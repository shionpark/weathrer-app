export interface Favorite {
  id: string; // 고유 ID (lat_lon 조합 또는 UUID)
  name: string; // 장소명 (fullAddress)
  alias: string; // 사용자 지정 별칭
  lat: number;
  lon: number;
}
