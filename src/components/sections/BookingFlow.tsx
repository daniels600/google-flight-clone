import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { Flight } from '@/types/flight';
import { ArrowLeft, CreditCard, Shield, Users } from 'lucide-react';

interface BookingFlowProps {
  flight: Flight;
  onBack: () => void;
  onComplete: () => void;
}

interface PassengerInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
}

export function BookingFlow({ flight, onBack, onComplete }: BookingFlowProps) {
  const [step, setStep] = useState(1);
  const [passengers, setPassengers] = useState<PassengerInfo[]>([
    {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      phone: ''
    }
  ]);

  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handlePassengerChange = (index: number, field: keyof PassengerInfo, value: string) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Flight Summary Sidebar */}
        <div className="lg:w-80">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                Flight Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Route</span>
                  <span className="font-medium">{flight.departure.airport} → {flight.arrival.airport}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Departure</span>
                  <span className="font-medium">{formatTime(flight.departure.time)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Arrival</span>
                  <span className="font-medium">{formatTime(flight.arrival.time)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="font-medium">{flight.totalDuration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Airline</span>
                  <span className="font-medium">{flight.airlines[0]}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Flight</span>
                  <span className="font-medium">${flight.price.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Taxes & Fees</span>
                  <span className="font-medium">$89</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>${flight.price.amount + 89}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Your booking is protected</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Steps */}
        <div className="flex-1">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`w-12 h-px mx-2 ${
                        step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {step === 1 && <Users className="h-5 w-5" />}
                {step === 2 && <CreditCard className="h-5 w-5" />}
                {step === 3 && <Shield className="h-5 w-5" />}
                {step === 1 && 'Passenger Information'}
                {step === 2 && 'Payment Details'}
                {step === 3 && 'Review & Confirm'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <div className="space-y-6">
                  {passengers.map((passenger, index) => (
                    <div key={index} className="space-y-4 p-4 border rounded-lg">
                      <h3 className="font-medium text-gray-900">
                        Passenger {index + 1}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`firstName-${index}`}>First Name</Label>
                          <Input
                            id={`firstName-${index}`}
                            value={passenger.firstName}
                            onChange={(e) =>
                              handlePassengerChange(index, 'firstName', e.target.value)
                            }
                            placeholder="Enter first name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`lastName-${index}`}>Last Name</Label>
                          <Input
                            id={`lastName-${index}`}
                            value={passenger.lastName}
                            onChange={(e) =>
                              handlePassengerChange(index, 'lastName', e.target.value)
                            }
                            placeholder="Enter last name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`dob-${index}`}>Date of Birth</Label>
                          <Input
                            id={`dob-${index}`}
                            type="date"
                            value={passenger.dateOfBirth}
                            onChange={(e) =>
                              handlePassengerChange(index, 'dateOfBirth', e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`gender-${index}`}>Gender</Label>
                          <Select
                            value={passenger.gender}
                            onValueChange={(value) =>
                              handlePassengerChange(index, 'gender', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`email-${index}`}>Email</Label>
                          <Input
                            id={`email-${index}`}
                            type="email"
                            value={passenger.email}
                            onChange={(e) =>
                              handlePassengerChange(index, 'email', e.target.value)
                            }
                            placeholder="Enter email address"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`phone-${index}`}>Phone Number</Label>
                          <Input
                            id={`phone-${index}`}
                            type="tel"
                            value={passenger.phone}
                            onChange={(e) =>
                              handlePassengerChange(index, 'phone', e.target.value)
                            }
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardHolder">Cardholder Name</Label>
                      <Input
                        id="cardHolder"
                        placeholder="Enter cardholder name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Billing Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                          id="address"
                          placeholder="Enter street address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="Enter city"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="Enter state"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input
                          id="zip"
                          placeholder="Enter ZIP code"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">
                      Please review your booking details
                    </h3>
                    <p className="text-sm text-blue-800">
                      Make sure all information is correct before confirming your booking.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Flight Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span>Route:</span>
                        <span className="font-medium">{flight.departure.airport} → {flight.arrival.airport}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date & Time:</span>
                        <span className="font-medium">{formatTime(flight.departure.time)} - {formatTime(flight.arrival.time)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Passengers:</span>
                        <span className="font-medium">{passengers.length} Adult(s)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Passenger Information</h3>
                    {passengers.map((passenger, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium">{passenger.firstName} {passenger.lastName}</p>
                        <p className="text-sm text-gray-600">{passenger.email}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={step === 1 ? onBack : prevStep}
                >
                  {step === 1 ? 'Back to Results' : 'Previous'}
                </Button>
                <Button
                  onClick={step === 3 ? onComplete : nextStep}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {step === 3 ? 'Confirm Booking' : 'Continue'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}