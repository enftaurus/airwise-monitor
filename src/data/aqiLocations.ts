// AQI data points for major Indian cities
// In a real app, this would come from an API

export interface AQILocation {
  city: string;
  state: string;
  lat: number;
  lng: number;
  aqi: number;
  lastUpdated: string;
}

export const indianCities: AQILocation[] = [
  // Delhi NCR
  { city: "New Delhi", state: "Delhi", lat: 28.6139, lng: 77.2090, aqi: 187, lastUpdated: "5 mins ago" },
  { city: "Gurugram", state: "Haryana", lat: 28.4595, lng: 77.0266, aqi: 234, lastUpdated: "3 mins ago" },
  { city: "Noida", state: "Uttar Pradesh", lat: 28.5355, lng: 77.3910, aqi: 265, lastUpdated: "4 mins ago" },
  { city: "Ghaziabad", state: "Uttar Pradesh", lat: 28.6692, lng: 77.4538, aqi: 287, lastUpdated: "6 mins ago" },
  { city: "Faridabad", state: "Haryana", lat: 28.4089, lng: 77.3178, aqi: 221, lastUpdated: "5 mins ago" },
  
  // Major metros
  { city: "Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.8777, aqi: 89, lastUpdated: "2 mins ago" },
  { city: "Bangalore", state: "Karnataka", lat: 12.9716, lng: 77.5946, aqi: 72, lastUpdated: "4 mins ago" },
  { city: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707, aqi: 65, lastUpdated: "3 mins ago" },
  { city: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639, aqi: 156, lastUpdated: "5 mins ago" },
  { city: "Hyderabad", state: "Telangana", lat: 17.3850, lng: 78.4867, aqi: 98, lastUpdated: "4 mins ago" },
  
  // Other major cities
  { city: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, aqi: 198, lastUpdated: "6 mins ago" },
  { city: "Kanpur", state: "Uttar Pradesh", lat: 26.4499, lng: 80.3319, aqi: 212, lastUpdated: "7 mins ago" },
  { city: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873, aqi: 145, lastUpdated: "5 mins ago" },
  { city: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714, aqi: 112, lastUpdated: "4 mins ago" },
  { city: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567, aqi: 78, lastUpdated: "3 mins ago" },
  { city: "Patna", state: "Bihar", lat: 25.5941, lng: 85.1376, aqi: 189, lastUpdated: "8 mins ago" },
  { city: "Chandigarh", state: "Punjab", lat: 30.7333, lng: 76.7794, aqi: 134, lastUpdated: "5 mins ago" },
  { city: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126, aqi: 125, lastUpdated: "6 mins ago" },
  { city: "Nagpur", state: "Maharashtra", lat: 21.1458, lng: 79.0882, aqi: 95, lastUpdated: "4 mins ago" },
  { city: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lng: 83.2185, aqi: 58, lastUpdated: "5 mins ago" },
];

// City coordinates lookup
export const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  "New Delhi, India": { lat: 28.6139, lng: 77.2090 },
  "Mumbai, India": { lat: 19.0760, lng: 72.8777 },
  "Bangalore, India": { lat: 12.9716, lng: 77.5946 },
  "Chennai, India": { lat: 13.0827, lng: 80.2707 },
  "Kolkata, India": { lat: 22.5726, lng: 88.3639 },
  "Hyderabad, India": { lat: 17.3850, lng: 78.4867 },
};

export function getCityData(cityName: string): AQILocation | undefined {
  const searchName = cityName.split(",")[0].trim();
  return indianCities.find(c => c.city.toLowerCase() === searchName.toLowerCase());
}

export function getAQICategory(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 200) return "Poor";
  if (aqi <= 300) return "Severe";
  return "Hazardous";
}
