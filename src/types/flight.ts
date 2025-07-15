export interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
}

export interface FlightSegment {
  departure: {
    airport: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    time: string;
    date: string;
  };
  airline: {
    code: string;
    name: string;
    logo?: string;
  };
  aircraft: string;
  duration: string;
  flightNumber: string;
}

export interface Flight {
  id: string;
  price: {
    amount: number;
    currency: string;
  };
  segments: FlightSegment[];
  totalDuration: string;
  stops: number;
  airlines: string[];
  departure: {
    time: string;
    airport: string;
  };
  arrival: {
    time: string;
    airport: string;
  };
  baggage?: {
    carry: boolean;
    checked: number;
  };
}

export interface SearchParams {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  tripType: 'round-trip' | 'one-way' | 'multi-city';
  class: 'economy' | 'premium-economy' | 'business' | 'first';
}

export interface FlightSearchResponse {
  flights: Flight[];
  totalResults: number;
  filters: {
    airlines: Array<{ code: string; name: string; count: number }>;
    airports: Array<{ code: string; name: string; count: number }>;
    priceRange: { min: number; max: number };
    duration: { min: number; max: number };
  };
}