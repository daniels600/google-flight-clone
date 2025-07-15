import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Plane, ArrowRight } from 'lucide-react';
import type { Flight } from '@/types/flight';

interface FlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
}

export function FlightCard({ flight, onSelect }: FlightCardProps) {
  const formatTime = (timeString: string) => {
    // Handle both HH:MM and HH:MM:SS formats
    const time = timeString.includes(':') ? timeString : '00:00';
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStopsText = (stops: number) => {
    if (stops === 0) return 'Nonstop';
    if (stops === 1) return '1 stop';
    return `${stops} stops`;
  };

  return (
    <Card className="w-full hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 group bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          {/* Flight Info */}
          <div className="flex-1 space-y-6">
            {/* Airline and Flight Number */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Plane className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{flight.airlines[0]}</p>
                <p className="text-sm text-gray-500">{flight.segments[0].flightNumber}</p>
              </div>
            </div>

            {/* Route Info */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {formatTime(flight.departure.time)}
                </p>
                <p className="text-sm lg:text-base text-gray-500 font-medium">
                  {flight.departure.airport}
                </p>
              </div>

              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 text-sm lg:text-base text-gray-500">
                  <Clock className="h-4 w-4" />
                  {flight.totalDuration}
                </div>
                <div className="w-full h-px bg-gray-300 relative min-w-[100px]">
                  <ArrowRight className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 bg-white px-1" />
                </div>
                <Badge variant="secondary" className="text-xs lg:text-sm">
                  {getStopsText(flight.stops)}
                </Badge>
              </div>

              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {formatTime(flight.arrival.time)}
                </p>
                <p className="text-sm lg:text-base text-gray-500 font-medium">
                  {flight.arrival.airport}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            {flight.baggage && (
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>✓ Carry-on included</span>
                {flight.baggage.checked > 0 && (
                  <span>✓ {flight.baggage.checked} checked bag</span>
                )}
              </div>
            )}
          </div>

          {/* Price and Action */}
          <div className="flex flex-row xl:flex-col items-center justify-between xl:justify-center gap-4 xl:gap-3 xl:w-52 pt-4 xl:pt-0 border-t xl:border-t-0 xl:border-l xl:pl-6">
            <div className="text-left xl:text-center">
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                ${flight.price.amount}
              </p>
              <p className="text-sm lg:text-base text-gray-500">per person</p>
            </div>
            <Button
              onClick={() => onSelect(flight)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-medium group-hover:shadow-lg transition-all duration-300 whitespace-nowrap"
            >
              Select
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}