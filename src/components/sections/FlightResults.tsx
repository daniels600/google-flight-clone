import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlightCard } from './FlightCard';
import { FilterSidebar } from './FilterSidebar';
import type { Flight, FlightSearchResponse } from '@/types/flight';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface FlightResultsProps {
  results: FlightSearchResponse;
  onFlightSelect: (flight: Flight) => void;
  loading: boolean;
}

export function FlightResults({ results, onFlightSelect, loading }: FlightResultsProps) {
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredFlights, setFilteredFlights] = useState(results.flights);

  const sortFlights = (flights: Flight[], sortBy: string) => {
    return [...flights].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price.amount - b.price.amount;
        case 'duration': {
          const aDuration = parseInt(a.totalDuration.replace(/\D/g, ''));
          const bDuration = parseInt(b.totalDuration.replace(/\D/g, ''));
          return aDuration - bDuration;
        }
        case 'departure':
          return a.departure.time.localeCompare(b.departure.time);
        default:
          return 0;
      }
    });
  };

  const sortedFlights = sortFlights(filteredFlights, sortBy);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Searching for the best flights...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <FilterSidebar
            filters={results.filters}
            onFiltersChange={setFilteredFlights}
            flights={results.flights}
          />
        </div>

        {/* Results */}
        <div className="flex-1 space-y-4">
          {/* Results Header */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl text-gray-900">
                    {sortedFlights.length} flights found
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Prices include taxes and fees
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>

                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-gray-500" />
                    <Select value={sortBy} onValueChange={(value: 'price' | 'duration' | 'departure') => setSortBy(value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">Price (low to high)</SelectItem>
                        <SelectItem value="duration">Duration (shortest)</SelectItem>
                        <SelectItem value="departure">Departure time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Flight Cards */}
          <div className="space-y-4">
            {sortedFlights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                onSelect={onFlightSelect}
              />
            ))}
          </div>

          {sortedFlights.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-lg text-gray-600 mb-2">No flights found</p>
                <p className="text-gray-500">Try adjusting your search criteria or filters</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}