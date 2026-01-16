// OpenF1 API Service - Real-time and historical F1 data
import axios from 'axios';
import { mockDrivers2026 } from './mockData';

const BASE_URL = 'https://api.openf1.org/v1';

export interface Driver {
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  first_name: string;
  last_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  country_code: string;
  headshot_url: string;
  session_key: number;
  meeting_key: number;
}


// Helper to get high-res driver image
export const getDriverImage = (driver: Driver): string => {
  // Use F1 media CDN for high res images
  const normalizedLastName = driver.last_name.toUpperCase();
  const baseYear = 2024; // 2025/2026 images don't exist yet, 2024 is stable

  // New Drivers / Rookies who definitely don't have 2024 F1 media images
  // We use a high-quality placeholder for them
  const rookieAcronyms = ['ANT', 'DOO', 'BOR', 'HAD', 'BEA', 'HER', 'AND', 'LAW'];

  if (rookieAcronyms.includes(driver.name_acronym)) {
    // Generate a clean placeholder
    return `https://placehold.co/600x600/e10600/ffffff.png?text=${driver.name_acronym}`;
  }

  // Andretti drivers or anyone else from that team
  if (driver.team_name === 'Andretti Cadillac') {
    return `https://placehold.co/600x600/D12A38/ffffff.png?text=${driver.name_acronym}`;
  }

  return `https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/${baseYear}/Drivers/${normalizedLastName}.png`;
};

export interface Meeting {
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  location: string;
  country_name: string;
  country_code: string;
  country_flag?: string;
  circuit_key: number;
  circuit_short_name: string;
  circuit_image?: string;
  circuit_type?: string;
  date_start: string;
  date_end: string;
  gmt_offset: string;
  year: number;
}

export interface Session {
  session_key: number;
  session_name: string;
  session_type: string;
  meeting_key: number;
  location: string;
  country_name: string;
  circuit_short_name: string;
  date_start: string;
  date_end: string;
  year: number;
}

export interface DriverStanding {
  driver_number: number;
  position_current: number;
  points_current: number;
  session_key: number;
  meeting_key: number;
}

export interface TeamStanding {
  team_name: string;
  position_current: number;
  points_current: number;
  session_key: number;
  meeting_key: number;
}

// Get all meetings (races) for a given year
export const getMeetings = async (year: number = 2025): Promise<Meeting[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/meetings?year=${year}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return [];
  }
};

// Get sessions for a meeting
export const getSessions = async (meetingKey?: number, year?: number): Promise<Session[]> => {
  try {
    let url = `${BASE_URL}/sessions`;
    const params: string[] = [];
    if (meetingKey) params.push(`meeting_key=${meetingKey}`);
    if (year) params.push(`year=${year}`);
    if (params.length) url += '?' + params.join('&');

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
};

// Get drivers for a session
export const getDrivers = async (): Promise<Driver[]> => {
  try {
    // Return mock data for 2026 season request
    // In a real app we might check if (year === 2026) but here we want to force it
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockDrivers2026);
      }, 500); // Simulate network delay
    });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return [];
  }
};

// Get driver championship standings
export const getDriverStandings = async (sessionKey?: number): Promise<DriverStanding[]> => {
  try {
    let url = `${BASE_URL}/championship_drivers`;
    if (sessionKey) {
      url += `?session_key=${sessionKey}`;
    } else {
      url += '?session_key=latest';
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching driver standings:', error);
    return [];
  }
};

// Get constructor/team championship standings
export const getTeamStandings = async (sessionKey?: number): Promise<TeamStanding[]> => {
  try {
    let url = `${BASE_URL}/championship_teams`;
    if (sessionKey) {
      url += `?session_key=${sessionKey}`;
    } else {
      url += '?session_key=latest';
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching team standings:', error);
    return [];
  }
};

// Get the latest/upcoming meeting
export const getLatestMeeting = async (): Promise<Meeting | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/meetings?meeting_key=latest`);
    return response.data[0] || null;
  } catch (error) {
    console.error('Error fetching latest meeting:', error);
    return null;
  }
};
