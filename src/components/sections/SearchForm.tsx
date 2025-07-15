/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker, DateRangePicker } from '@/components/ui/date-picker';
import { ArrowLeftRight, Calendar, MapPin, Users } from 'lucide-react';
import type { SearchParams } from '@/types/flight';
import type { DateRange } from 'react-day-picker';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
}

export function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [tripType, setTripType] = useState<'round-trip' | 'one-way' | 'multi-city'>('round-trip');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [adults, setAdults] = useState('1');
  const [children, setChildren] = useState('0');
  const [infants, setInfants] = useState('0');
  const [travelClass, setTravelClass] = useState<'economy' | 'premium-economy' | 'business' | 'first'>('economy');

  const handleSearch = () => {
    if (!origin || !destination || (!departDate && !dateRange?.from)) {
      return;
    }

    const searchParams: SearchParams = {
      origin,
      destination,
      departDate: tripType === 'round-trip' && dateRange?.from 
        ? dateRange.from.toISOString().split('T')[0]
        : departDate?.toISOString().split('T')[0] || '',
      returnDate: tripType === 'round-trip' && dateRange?.to 
        ? dateRange.to.toISOString().split('T')[0]
        : returnDate?.toISOString().split('T')[0],
      adults: parseInt(adults),
      children: parseInt(children),
      infants: parseInt(infants),
      tripType,
      class: travelClass
    };

    onSearch(searchParams);
  };

  const swapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <Card className="w-full max-w-7xl mx-auto shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <CardContent className="p-8">
        {/* Trip Type Selection */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(['round-trip', 'one-way', 'multi-city'] as const).map((type) => (
            <Button
              key={type}
              variant={tripType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTripType(type)}
              className="capitalize"
            >
              {type.replace('-', ' ')}
            </Button>
          ))}
        </div>

        {/* Main Search Form */}
        <div className="space-y-6">
          {/* Origin & Destination Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative">
              <Label htmlFor="origin" className="text-sm font-medium text-gray-700 mb-2 block">From</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Input
                  id="origin"
                  placeholder="Origin airport (e.g., JFK, New York)"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="pl-10 h-14 text-base bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
            
            <div className="relative">
              <Label htmlFor="destination" className="text-sm font-medium text-gray-700 mb-2 block">To</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Input
                  id="destination"
                  placeholder="Destination airport (e.g., LAX, Los Angeles)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-10 h-14 text-base bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
            
            {/* Swap Button */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={swapAirports}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 hidden lg:flex"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Dates, Passengers & Class Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Dates */}
            <div className="lg:col-span-1">
              {tripType === 'round-trip' ? (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Departure - Return</Label>
                  <DateRangePicker
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                    className="h-14"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Departure</Label>
                  <DatePicker
                    date={departDate}
                    onDateChange={setDepartDate}
                    placeholder="Select departure date"
                    className="h-14"
                  />
                </div>
              )}
            </div>

            {/* Passengers */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Passengers</Label>
              <Select value={`${adults}-${children}-${infants}`} onValueChange={(value) => {
                const [a, c, i] = value.split('-');
                setAdults(a);
                setChildren(c);
                setInfants(i);
              }}>
                <SelectTrigger className="h-14 bg-white border-gray-200 focus:border-blue-500">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-0-0">1 Adult</SelectItem>
                  <SelectItem value="2-0-0">2 Adults</SelectItem>
                  <SelectItem value="3-0-0">3 Adults</SelectItem>
                  <SelectItem value="4-0-0">4 Adults</SelectItem>
                  <SelectItem value="2-1-0">2 Adults, 1 Child</SelectItem>
                  <SelectItem value="2-2-0">2 Adults, 2 Children</SelectItem>
                  <SelectItem value="1-0-1">1 Adult, 1 Infant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Class */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Class</Label>
              <Select value={travelClass} onValueChange={(value: 'economy' | 'premium-economy' | 'business' | 'first') => setTravelClass(value)}>
                <SelectTrigger className="h-14 bg-white border-gray-200 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium-economy">Premium Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSearch}
              disabled={loading || !origin || !destination || (!departDate && !dateRange?.from)}
              className="w-full sm:w-auto h-14 bg-blue-600 hover:bg-blue-700 text-white font-medium px-12 text-base"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Searching...
                </div>
              ) : (
                'Search Flights'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}