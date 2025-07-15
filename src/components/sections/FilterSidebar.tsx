import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Flight } from '@/types/flight';

interface FilterSidebarProps {
  filters: {
    airlines: Array<{ code: string; name: string; count: number }>;
    airports: Array<{ code: string; name: string; count: number }>;
    priceRange: { min: number; max: number };
    duration: { min: number; max: number };
  };
  flights: Flight[];
  onFiltersChange: (filteredFlights: Flight[]) => void;
}

export function FilterSidebar({ filters, flights, onFiltersChange }: FilterSidebarProps) {
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState([filters.priceRange.min, filters.priceRange.max]);
  const [departureTime, setDepartureTime] = useState<string[]>([]);

  const departureTimeRanges = [
    { label: 'Early morning (5:00 AM - 8:59 AM)', value: 'early', start: 5, end: 9 },
    { label: 'Morning (9:00 AM - 11:59 AM)', value: 'morning', start: 9, end: 12 },
    { label: 'Afternoon (12:00 PM - 5:59 PM)', value: 'afternoon', start: 12, end: 18 },
    { label: 'Evening (6:00 PM - 11:59 PM)', value: 'evening', start: 18, end: 24 },
  ];

  const stopsOptions = [
    { label: 'Nonstop', value: 0, count: flights.filter(f => f.stops === 0).length },
    { label: '1 stop', value: 1, count: flights.filter(f => f.stops === 1).length },
    { label: '2+ stops', value: 2, count: flights.filter(f => f.stops >= 2).length },
  ];

  useEffect(() => {
    applyFilters();
  }, [selectedAirlines, selectedStops, priceRange, departureTime]);

  const applyFilters = () => {
    let filtered = flights;

    // Filter by airlines
    if (selectedAirlines.length > 0) {
      filtered = filtered.filter(flight =>
        flight.airlines.some(airline => selectedAirlines.includes(airline))
      );
    }

    // Filter by stops
    if (selectedStops.length > 0) {
      filtered = filtered.filter(flight => {
        if (selectedStops.includes(2) && flight.stops >= 2) return true;
        return selectedStops.includes(flight.stops);
      });
    }

    // Filter by price range
    filtered = filtered.filter(flight =>
      flight.price.amount >= priceRange[0] && flight.price.amount <= priceRange[1]
    );

    // Filter by departure time
    if (departureTime.length > 0) {
      filtered = filtered.filter(flight => {
        const hour = parseInt(flight.departure.time.split(':')[0]);
        return departureTime.some(timeRange => {
          const range = departureTimeRanges.find(r => r.value === timeRange);
          if (!range) return false;
          return hour >= range.start && hour < range.end;
        });
      });
    }

    onFiltersChange(filtered);
  };

  const clearAllFilters = () => {
    setSelectedAirlines([]);
    setSelectedStops([]);
    setPriceRange([filters.priceRange.min, filters.priceRange.max]);
    setDepartureTime([]);
  };

  const handleAirlineChange = (airline: string, checked: boolean) => {
    if (checked) {
      setSelectedAirlines([...selectedAirlines, airline]);
    } else {
      setSelectedAirlines(selectedAirlines.filter(a => a !== airline));
    }
  };

  const handleStopsChange = (stops: number, checked: boolean) => {
    if (checked) {
      setSelectedStops([...selectedStops, stops]);
    } else {
      setSelectedStops(selectedStops.filter(s => s !== stops));
    }
  };

  const handleDepartureTimeChange = (time: string, checked: boolean) => {
    if (checked) {
      setDepartureTime([...departureTime, time]);
    } else {
      setDepartureTime(departureTime.filter(t => t !== time));
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-blue-600 hover:text-blue-800"
          >
            Clear all
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Price</h3>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={filters.priceRange.min}
              max={filters.priceRange.max}
              step={25}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Stops */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Stops</h3>
          <div className="space-y-2">
            {stopsOptions.map((option) => (
              <div key={option.value} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`stops-${option.value}`}
                    checked={selectedStops.includes(option.value)}
                    onCheckedChange={(checked) =>
                      handleStopsChange(option.value, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`stops-${option.value}`}
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
                <span className="text-sm text-gray-500">({option.count})</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Departure Time */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Departure time</h3>
          <div className="space-y-2">
            {departureTimeRanges.map((range) => (
              <div key={range.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`time-${range.value}`}
                  checked={departureTime.includes(range.value)}
                  onCheckedChange={(checked) =>
                    handleDepartureTimeChange(range.value, checked as boolean)
                  }
                />
                <label
                  htmlFor={`time-${range.value}`}
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  {range.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Airlines */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Airlines</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filters.airlines.slice(0, 8).map((airline) => (
              <div key={airline.code} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`airline-${airline.code}`}
                    checked={selectedAirlines.includes(airline.name)}
                    onCheckedChange={(checked) =>
                      handleAirlineChange(airline.name, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`airline-${airline.code}`}
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    {airline.name}
                  </label>
                </div>
                <span className="text-sm text-gray-500">({airline.count})</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}