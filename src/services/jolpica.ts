// Jolpica API Service - Historical F1 data (Ergast compatible)
import axios from 'axios';

const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

export interface JolpicaDriver {
    driverId: string;
    permanentNumber: string;
    code: string;
    givenName: string;
    familyName: string;
    dateOfBirth: string;
    nationality: string;
    url: string;
}

export interface JolpicaConstructor {
    constructorId: string;
    name: string;
    nationality: string;
    url: string;
}

export interface DriverStandingJolpica {
    position: string;
    positionText: string;
    points: string;
    wins: string;
    Driver: JolpicaDriver;
    Constructors: JolpicaConstructor[];
}

export interface ConstructorStanding {
    position: string;
    positionText: string;
    points: string;
    wins: string;
    Constructor: JolpicaConstructor;
}

export interface RaceResult {
    number: string;
    position: string;
    positionText: string;
    points: string;
    grid: string;
    laps: string;
    status: string;
    Driver: JolpicaDriver;
    Constructor: JolpicaConstructor;
    Time?: {
        millis: string;
        time: string;
    };
    FastestLap?: {
        rank: string;
        lap: string;
        Time: { time: string };
        AverageSpeed: { units: string; speed: string };
    };
}

export interface Race {
    season: string;
    round: string;
    url: string;
    raceName: string;
    Circuit: {
        circuitId: string;
        url: string;
        circuitName: string;
        Location: {
            lat: string;
            long: string;
            locality: string;
            country: string;
        };
    };
    date: string;
    time?: string;
    Results?: RaceResult[];
}

// Get current driver standings
export const getDriverStandings = async (): Promise<DriverStandingJolpica[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/current/driverStandings.json`);
        return response.data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
    } catch (error) {
        console.error('Error fetching driver standings:', error);
        return [];
    }
};

// Get current constructor standings
export const getConstructorStandings = async (): Promise<ConstructorStanding[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/current/constructorStandings.json`);
        return response.data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
    } catch (error) {
        console.error('Error fetching constructor standings:', error);
        return [];
    }
};

// Get race results for a specific year
export const getRaceResults = async (year: string = 'current', round?: string): Promise<Race[]> => {
    try {
        let url = `${BASE_URL}/${year}/results.json`;
        if (round) {
            url = `${BASE_URL}/${year}/${round}/results.json`;
        }
        const response = await axios.get(url);
        return response.data.MRData.RaceTable.Races || [];
    } catch (error) {
        console.error('Error fetching race results:', error);
        return [];
    }
};

// Get latest race result
export const getLatestRaceResult = async (): Promise<Race | null> => {
    try {
        const response = await axios.get(`${BASE_URL}/current/last/results.json`);
        return response.data.MRData.RaceTable.Races[0] || null;
    } catch (error) {
        console.error('Error fetching latest race:', error);
        return null;
    }
};

// Get race schedule
export const getRaceSchedule = async (year: string = 'current'): Promise<Race[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/${year}.json`);
        return response.data.MRData.RaceTable.Races || [];
    } catch (error) {
        console.error('Error fetching schedule:', error);
        return [];
    }
};
