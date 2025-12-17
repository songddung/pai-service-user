export interface GeocodingService {
  getLatLng(address: string): Promise<{
    latitude: number;
    longitude: number;
  }>;
}
