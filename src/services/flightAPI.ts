/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import type { SearchParams, FlightSearchResponse, Flight } from '@/types/flight';

// Mock data
const mockFlights: Flight[] = [
  {
    id: '1',
    price: { amount: 299, currency: 'USD' },
    segments: [{
      departure: { airport: 'JFK', time: '08:00', date: '2024-03-15' },
      arrival: { airport: 'LAX', time: '11:30', date: '2024-03-15' },
      airline: { code: 'AA', name: 'American Airlines' },
      aircraft: 'Boeing 737',
      duration: '5h 30m',
      flightNumber: 'AA1234'
    }],
    totalDuration: '5h 30m',
    stops: 0,
    airlines: ['American Airlines'],
    departure: { time: '08:00', airport: 'JFK' },
    arrival: { time: '11:30', airport: 'LAX' },
    baggage: { carry: true, checked: 1 }
  },
  {
    id: '2',
    price: { amount: 249, currency: 'USD' },
    segments: [{
      departure: { airport: 'JFK', time: '10:15', date: '2024-03-15' },
      arrival: { airport: 'LAX', time: '15:45', date: '2024-03-15' },
      airline: { code: 'DL', name: 'Delta Air Lines' },
      aircraft: 'Airbus A320',
      duration: '7h 30m',
      flightNumber: 'DL5678'
    }],
    totalDuration: '7h 30m',
    stops: 1,
    airlines: ['Delta Air Lines'],
    departure: { time: '10:15', airport: 'JFK' },
    arrival: { time: '15:45', airport: 'LAX' },
    baggage: { carry: true, checked: 1 }
  },
  {
    id: '3',
    price: { amount: 189, currency: 'USD' },
    segments: [{
      departure: { airport: 'JFK', time: '14:20', date: '2024-03-15' },
      arrival: { airport: 'LAX', time: '19:50', date: '2024-03-15' },
      airline: { code: 'UA', name: 'United Airlines' },
      aircraft: 'Boeing 777',
      duration: '8h 30m',
      flightNumber: 'UA9876'
    }],
    totalDuration: '8h 30m',
    stops: 2,
    airlines: ['United Airlines'],
    departure: { time: '14:20', airport: 'JFK' },
    arrival: { time: '19:50', airport: 'LAX' },
    baggage: { carry: true, checked: 0 }
  },
  {
    id: '4',
    price: { amount: 329, currency: 'USD' },
    segments: [{
      departure: { airport: 'JFK', time: '18:00', date: '2024-03-15' },
      arrival: { airport: 'LAX', time: '21:15', date: '2024-03-15' },
      airline: { code: 'B6', name: 'JetBlue Airways' },
      aircraft: 'Airbus A321',
      duration: '5h 15m',
      flightNumber: 'B61111'
    }],
    totalDuration: '5h 15m',
    stops: 0,
    airlines: ['JetBlue Airways'],
    departure: { time: '18:00', airport: 'JFK' },
    arrival: { time: '21:15', airport: 'LAX' },
    baggage: { carry: true, checked: 1 }
  },
  {
    id: '5',
    price: { amount: 279, currency: 'USD' },
    segments: [{
      departure: { airport: 'JFK', time: '06:30', date: '2024-03-15' },
      arrival: { airport: 'LAX', time: '12:45', date: '2024-03-15' },
      airline: { code: 'AS', name: 'Alaska Airlines' },
      aircraft: 'Boeing 737 MAX',
      duration: '6h 15m',
      flightNumber: 'AS2222'
    }],
    totalDuration: '6h 15m',
    stops: 1,
    airlines: ['Alaska Airlines'],
    departure: { time: '06:30', airport: 'JFK' },
    arrival: { time: '12:45', airport: 'LAX' },
    baggage: { carry: true, checked: 1 }
  }
];

interface AirportSearchResult {
  skyId: string;
  entityId: string;
  presentation: {
    title: string;
    suggestionTitle: string;
    subtitle: string;
  };
  navigation: {
    entityId: string;
    entityType: string;
    localizedName: string;
    relevantFlightParams: {
      skyId: string;
      entityId: string;
      flightPlaceType: string;
      localizedName: string;
    };
  };
}

// Function to search for airport details
async function searchAirport(query: string): Promise<AirportSearchResult | null> {
  const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  
  if (!rapidApiKey) {
    throw new Error('RAPIDAPI_KEY not found');
  }

  const options = {
    method: 'GET',
    url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport',
    params: {
      query: query,
      locale: 'en-US'
    },
    headers: {
      'x-rapidapi-key': rapidApiKey,
      'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    console.log('Airport search response:', response.data);
    
    if (response.data.status && response.data.data && response.data.data.length > 0) {
      return response.data.data[0]; // Return first result
    }
    
    return null;
  } catch (error) {
    console.error('Error searching airport:', error);
    throw error;
  }
}

export async function searchFlights(params: SearchParams): Promise<FlightSearchResponse> {
  // Try to use the real API first
  const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  
  if (rapidApiKey) {
    try {
      return await searchFlightsWithSkyScrapperAPI(params);
    } catch (error) {
      console.warn('Sky Scrapper API failed, falling back to mock data:', error);
    }
  }

  // Fallback to mock data
  console.log('Using mock data - add VITE_RAPIDAPI_KEY to .env for real data');
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate unique airlines from mock data
  const airlines = Array.from(new Set(mockFlights.map(f => f.airlines[0])))
    .map(name => ({
      code: name.split(' ')[0].substring(0, 2).toUpperCase(),
      name,
      count: mockFlights.filter(f => f.airlines.includes(name)).length
    }));

  // Generate unique airports
  const airports = [
    { code: 'JFK', name: 'John F. Kennedy International Airport', count: mockFlights.length },
    { code: 'LAX', name: 'Los Angeles International Airport', count: mockFlights.length }
  ];

  // Calculate price range
  const prices = mockFlights.map(f => f.price.amount);
  const priceRange = {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };

  // Calculate duration range (in minutes for easier comparison)
  const durations = mockFlights.map(f => {
    const match = f.totalDuration.match(/(\d+)h\s*(\d+)m/);
    return match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0;
  });
  const durationRange = {
    min: Math.min(...durations),
    max: Math.max(...durations)
  };

  return {
    flights: mockFlights,
    totalResults: mockFlights.length,
    filters: {
      airlines,
      airports,
      priceRange,
      duration: durationRange
    }
  };
}

// Sky Scrapper API integration with airport search
export async function searchFlightsWithSkyScrapperAPI(params: SearchParams): Promise<FlightSearchResponse> {
  const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  
  if (!rapidApiKey) {
    throw new Error('RAPIDAPI_KEY not found');
  }

  try {
    // First, search for origin airport details
    const originAirport = await searchAirport(params.origin);
    if (!originAirport) {
      throw new Error(`Origin airport not found: ${params.origin}`);
    }

    // Then, search for destination airport details
    const destinationAirport = await searchAirport(params.destination);
    if (!destinationAirport) {
      throw new Error(`Destination airport not found: ${params.destination}`);
    }

    console.log('Origin airport:', originAirport);
    console.log('Destination airport:', destinationAirport);

    // Use the airport details to build flight search parameters
    const apiParams = {
      originSkyId: originAirport.skyId,
      destinationSkyId: destinationAirport.skyId,
      originEntityId: originAirport.entityId,
      destinationEntityId: destinationAirport.entityId,
      date: params.departDate,
      cabinClass: 'economy',
      adults: params.adults?.toString() || '1',
      sortBy: 'best',
      currency: 'USD',
      market: 'en-US',
      countryCode: 'US'
    };

    // Add return date for round-trip flights
    if (params.tripType === 'round-trip' && params.returnDate) {
      (apiParams as any).returnDate = params.returnDate;
    }

    const url = new URL('https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights');
    Object.entries(apiParams).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Flight search response:', JSON.stringify(data, null, 2));
    
    // Transform Sky Scrapper API response to our Flight interface
    return transformSkyScrapperResponse(data);

  } catch (error) {
    console.error('Error fetching from Sky Scrapper API:', error);
    throw error;
  }
}

function transformSkyScrapperResponse(apiResponse: any): FlightSearchResponse {
  try {
    // Transform the Sky Scrapper API response to our format
    // This is a basic transformation - you may need to adjust based on actual API response structure
    
    const flights: Flight[] = [];
    
    if (apiResponse.data && apiResponse.data.itineraries) {
      apiResponse.data.itineraries.forEach((itinerary: any, index: number) => {
        const segments = itinerary.legs?.map((leg: any) => ({
          departure: {
            airport: leg.origin?.displayCode || leg.origin?.id || '',
            time: leg.departure ? new Date(leg.departure).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit', 
              hour12: false 
            }) : '',
            date: leg.departure ? new Date(leg.departure).toISOString().split('T')[0] : ''
          },
          arrival: {
            airport: leg.destination?.displayCode || leg.destination?.id || '',
            time: leg.arrival ? new Date(leg.arrival).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit', 
              hour12: false 
            }) : '',
            date: leg.arrival ? new Date(leg.arrival).toISOString().split('T')[0] : ''
          },
          airline: {
            code: leg.carriers?.marketing?.[0]?.id || '',
            name: leg.carriers?.marketing?.[0]?.name || 'Unknown Airline'
          },
          aircraft: leg.segments?.[0]?.flightNumber || '',
          duration: formatDuration(leg.durationInMinutes || 0),
          flightNumber: leg.segments?.[0]?.flightNumber || ''
        })) || [];

        const firstLeg = itinerary.legs?.[0];
        const lastLeg = itinerary.legs?.[itinerary.legs.length - 1];
        
        flights.push({
          id: `flight-${index}`,
          price: {
            amount: Math.round(itinerary.price?.raw || 0),
            currency: itinerary.price?.currency || 'USD'
          },
          segments,
          totalDuration: formatDuration(itinerary.durationInMinutes || 0),
          stops: Math.max(0, (itinerary.legs?.length || 1) - 1),
          airlines: segments.map((s: { airline: { name: any; }; }) => s.airline.name).filter((name: any, i: any, arr: string | any[]) => arr.indexOf(name) === i),
          departure: {
            time: firstLeg?.departure ? new Date(firstLeg.departure).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit', 
              hour12: false 
            }) : '',
            airport: firstLeg?.origin?.displayCode || ''
          },
          arrival: {
            time: lastLeg?.arrival ? new Date(lastLeg.arrival).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit', 
              hour12: false 
            }) : '',
            airport: lastLeg?.destination?.displayCode || ''
          },
          baggage: {
            carry: true,
            checked: 1
          }
        });
      });
    }

    // Generate filters from the flight data
    const airlines = Array.from(new Set(flights.flatMap(f => f.airlines)))
      .map(name => ({
        code: name.substring(0, 2).toUpperCase(),
        name,
        count: flights.filter(f => f.airlines.includes(name)).length
      }));

    const airports = Array.from(new Set([
      ...flights.map(f => f.departure.airport),
      ...flights.map(f => f.arrival.airport)
    ])).map(code => ({
      code,
      name: `${code} Airport`,
      count: flights.filter(f => f.departure.airport === code || f.arrival.airport === code).length
    }));

    const prices = flights.map(f => f.price.amount);
    const priceRange = prices.length > 0 ? {
      min: Math.min(...prices),
      max: Math.max(...prices)
    } : { min: 0, max: 1000 };

    const durations = flights.map(f => {
      const match = f.totalDuration.match(/(\d+)h\s*(\d+)m/);
      return match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0;
    });
    const durationRange = durations.length > 0 ? {
      min: Math.min(...durations),
      max: Math.max(...durations)
    } : { min: 0, max: 1440 };

    return {
      flights,
      totalResults: flights.length,
      filters: {
        airlines,
        airports,
        priceRange,
        duration: durationRange
      }
    };

  } catch (error) {
    console.error('Error transforming Sky Scrapper response:', error);
    throw new Error('Failed to process flight data');
  }
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}