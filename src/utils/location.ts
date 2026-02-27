import * as Location from 'expo-location';

export type LocationData = {
  latitude: number;
  longitude: number;
  address: string | null;
};

export async function getCurrentLocation(): Promise<LocationData | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;

  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = location.coords;

    // Best-effort — if geocoding fails we still return coords
    let address: string | null = null;
    try {
      const [result] = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (result) {
        const parts = [result.street, result.city, result.region].filter(Boolean);
        address = parts.join(', ');
      }
    } catch {
      // geocoding is non-critical, swallow the error
    }

    return { latitude, longitude, address };
  } catch {
    return null;
  }
}
