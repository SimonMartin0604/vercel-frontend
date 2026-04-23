export interface AirQualityData {
  pm10: number; // PM10 koncentráció (µg/m³)
  pm4: number; // PM4 koncentráció (µg/m³)
  pm2_5: number; // PM2.5 koncentráció (µg/m³)
  pm1: number; // PM1 koncentráció (µg/m³)
  composition: string; // Részecskeösszetétel leírása (pl. "Főként kipufogógáz és fékpor eredetű részecskék.")
}

export interface WeatherData {
  temp: number; // Hőmérséklet (°C)
  humidity: number; // Páratartalom (%)
  windSpeed: number; // Szélsebesség (km/h)
  windDir: string; // Szélirány (pl. "ÉNY", "D", "NY")
  dewpoint: number; // Harmatpont (°C)
  rain: number; // Csapadék mennyisége (mm)
}

export interface AuthFormValues {
    email: string; // Email cím
    username?: string; // Felhasználónév (regisztráció esetén kötelező)
    password: string; // Jelszó
    confirmPassword?: string; // Jelszó megerősítése (regisztráció esetén kötelező)
    terms?: boolean; // Feltételek elfogadása (regisztráció esetén kötelező)
}

export interface LocationData {
  id: string; // Egyedi azonosító (pl. "belvaros", "szentendre")
  name: string; // Hely neve (pl. "Budapest - Belváros")
  lat?: number; // Szélességi fok (térképes megjelenítéshez)
  lon?: number; // Hosszúsági fok (térképes megjelenítéshez)
  airQuality: AirQualityData; // Levegőminőségi adatok
  weather: WeatherData; // Időjárási adatok
  devices?: Device[]; // Helyszínhez tartozó eszközök
}

export interface Device {
  id: string; // Egyedi azonosító
  name: string; // Eszköz neve (pl. "Belvárosi mérőállomás")
  location: string; // Eszköz helye (pl. "Budapest - Belváros")
  status: 'active' | 'inactive' | 'maintenance'; // Eszköz státusza
  lastSeen: string; // Utolsó észlelés ideje (pl. "2 perce", "5 perce", "2 órája")
  measurements?: Measurement[]; // Eszközhöz tartozó mérések
}

export interface Measurement {
  id: number;
  device_id: number;
  timestamp: string;
  pm10: number;
  pm4: number;
  pm2_5: number;
  pm1: number;
  composition?: string;
  temp: number;
  humidity: number;
  wind_speed: number;
  wind_dir?: string;
  dewpoint: number;
  rain: number;
}