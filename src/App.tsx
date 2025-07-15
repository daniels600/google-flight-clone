/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { SearchForm } from '@/components/sections/SearchForm';
import { FlightResults } from '@/components/sections/FlightResults';
import { BookingFlow } from '@/components/sections/BookingFlow';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { SearchParams, FlightSearchResponse, Flight } from '@/types/flight';
import { Plane, MapPin, Calendar, Users, CheckCircle, Globe, Shield, Clock } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { searchFlights } from './services/flightAPI';

type AppState = 'search' | 'results' | 'booking' | 'confirmation';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('search');
  const [searchResults, setSearchResults] = useState<FlightSearchResponse | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    try {
      const results = await searchFlights(params);
      setSearchResults(results);
      setCurrentState('results');
      toast.success("Search completed",{
        description: `Found ${results.totalResults} flights for your trip.`,
      });
    } catch (error) {
      toast.error("Search failed", {
        description: "Unable to search for flights. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
    setCurrentState('booking');
  };

  const handleBookingComplete = () => {
    setCurrentState('confirmation');
    toast.message("Booking completed", {
      description: "Your flight has been successfully booked. Check your email for confirmation.",
    });
  };

  const handleBackToSearch = () => {
    setCurrentState('search');
    setSearchResults(null);
    setSelectedFlight(null);
  };

  const handleBackToResults = () => {
    setCurrentState('results');
    setSelectedFlight(null);
  };

  const features = [
    {
      icon: Globe,
      title: "Worldwide Coverage",
      description: "Search flights to over 5,000 destinations worldwide"
    },
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Your personal and payment information is always protected"
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Get the latest flight information and pricing"
    }
  ];

  if (currentState === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Your flight has been successfully booked. You'll receive a confirmation email shortly with your booking details and e-tickets.
            </p>
            <div className="space-y-4">
              <Button
                onClick={handleBackToSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                Book Another Flight
              </Button>
            </div>
          </div>
        </div>
         <Toaster richColors position='top-center'/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Flightly</span>
            </div>
            {currentState !== 'search' && (
              <Button
                variant="ghost"
                onClick={handleBackToSearch}
                className="text-blue-600 hover:text-blue-800"
              >
                New Search
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentState === 'search' && (
          <div className="space-y-16">
            {/* Hero Section */}
            <div className="text-center space-y-6 py-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Find Your Perfect
                <span className="text-blue-600 block">Flight</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Search and compare flights from hundreds of airlines to get the best deals for your next adventure.
              </p>
            </div>

            {/* Search Form */}
            <div className="relative px-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-3xl blur-3xl"></div>
              <div className="relative">
                <SearchForm onSearch={handleSearch} loading={loading} />
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
              {features.map((feature, index) => (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-white">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                      <feature.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Popular Destinations */}
            <div className="text-center space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">Popular Destinations</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
                {[
                  { city: 'New York', code: 'NYC', image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=400' },
                  { city: 'London', code: 'LON', image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=400' },
                  { city: 'Tokyo', code: 'TYO', image: 'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=400' },
                  { city: 'Paris', code: 'PAR', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
                ].map((destination) => (
                  <div key={destination.code} className="relative rounded-xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300">
                    <img
                      src={destination.image}
                      alt={destination.city}
                      className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <h3 className="text-white font-semibold">{destination.city}</h3>
                      <p className="text-white/80 text-sm">{destination.code}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentState === 'results' && searchResults && (
          <FlightResults
            results={searchResults}
            onFlightSelect={handleFlightSelect}
            loading={loading}
          />
        )}

        {currentState === 'booking' && selectedFlight && (
          <BookingFlow
            flight={selectedFlight}
            onBack={handleBackToResults}
            onComplete={handleBookingComplete}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Plane className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">SkySearch</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner for finding the best flight deals worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">More</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gift Cards</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SkySearch. All rights reserved.</p>
          </div>
        </div>
      </footer>
       <Toaster richColors position='top-center'/>
    </div>
  );
}

export default App;