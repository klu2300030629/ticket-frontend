import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Seat, Event } from '../types';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import OrderSummary from '../components/checkout/OrderSummary';
import PaymentForm from '../components/checkout/PaymentForm';
import { ArrowLeft, CheckCircle, XCircle, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingId, setBookingId] = useState<string>('');

  useEffect(() => {
    // Load data from session storage
    const seatsData = sessionStorage.getItem('selectedSeats');
    const eventData = sessionStorage.getItem('selectedEvent');

    if (!seatsData || !eventData) {
      navigate('/');
      return;
    }

    try {
      const seatIds = JSON.parse(seatsData);
      const event = JSON.parse(eventData);

      // Convert seat IDs to Seat objects
      const seats: Seat[] = seatIds.map((seatId: string) => {
        const [row, number] = seatId.match(/([A-Z])(\d+)/)?.slice(1) || ['A', '1'];
        let type: 'regular' | 'vip' | 'premium' = 'regular';
        
        // Determine seat type based on row
        if (['A', 'B'].includes(row)) {
          type = 'vip';
        } else if (['I', 'J'].includes(row)) {
          type = 'premium';
        }

        return {
          id: seatId,
          row,
          number: parseInt(number),
          type,
          status: 'available',
          price: event.price[type]
        };
      });

      setSelectedSeats(seats);
      setSelectedEvent(event);
    } catch (error) {
      console.error('Error loading checkout data:', error);
      navigate('/');
    }
  }, [navigate]);

  const handleRemoveSeat = (seatId: string) => {
    setSelectedSeats(prev => prev.filter(seat => seat.id !== seatId));
    
    // Update session storage
    const updatedSeatIds = selectedSeats.filter(seat => seat.id !== seatId).map(seat => seat.id);
    if (updatedSeatIds.length === 0) {
      sessionStorage.removeItem('selectedSeats');
      navigate('/');
    } else {
      sessionStorage.setItem('selectedSeats', JSON.stringify(updatedSeatIds));
    }
  };

  const handlePaymentSubmit = async (paymentData: any) => {
    if (!token) {
      setShowError(true);
      setErrorMessage('You must be logged in to complete this booking');
      return;
    }

    setIsProcessing(true);
    setShowError(false);

    try {
      // Create booking data
      const bookingData = {
        eventId: selectedEvent?.id,
        userId: user?.id,
        seats: selectedSeats.map(seat => seat.id),
        totalAmount: selectedSeats.reduce((sum, seat) => sum + seat.price, 0),
        paymentMethod: paymentData.paymentMethod,
        paymentDetails: {
          cardNumber: paymentData.cardNumber ? paymentData.cardNumber.slice(-4) : null,
          cardHolder: paymentData.cardHolder || null
        }
      };

      // Send booking request to backend
      const response = await fetch('http://localhost:8080/api/user/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const result = await response.json();
        const confirmedBookingId = result.bookingId || 'BK' + Date.now().toString().slice(-8);
        setBookingId(confirmedBookingId);
        
        // Store booking confirmation data
        const confirmationData = {
          bookingId: confirmedBookingId,
          event: selectedEvent,
          seats: selectedSeats,
          paymentData,
          timestamp: new Date().toISOString()
        };
        
        sessionStorage.setItem('bookingConfirmation', JSON.stringify(confirmationData));
        
        // Clear selection data
        sessionStorage.removeItem('selectedSeats');
        sessionStorage.removeItem('selectedEvent');

        setShowSuccess(true);
        
        // Redirect to confirmation page after 3 seconds
        setTimeout(() => {
          navigate('/booking-confirmation');
        }, 3000);
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setShowError(true);
      setErrorMessage('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedEvent || selectedSeats.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading checkout...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Seat Selection</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Checkout</h1>
          <p className="text-gray-600 dark:text-gray-400">Complete your booking securely</p>
        </div>

        {/* Success/Error Messages */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100">Payment Successful!</h3>
                <p className="text-green-800 dark:text-green-200 text-sm">Redirecting to confirmation page...</p>
              </div>
            </div>
          </div>
        )}

        {showError && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <XCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100">Payment Failed</h3>
                <p className="text-red-800 dark:text-red-200 text-sm">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <PaymentForm
              onPaymentSubmit={handlePaymentSubmit}
              isProcessing={isProcessing}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              event={selectedEvent}
              selectedSeats={selectedSeats}
              onRemoveSeat={handleRemoveSeat}
            />
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Secure Payment</h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                Your payment information is encrypted and processed securely. We use industry-standard security measures to protect your data.
              </p>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            By completing this purchase, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">
              Privacy Policy
            </a>
          </p>
          <p className="mt-2">
            Tickets are non-refundable. Please review your selection before completing the purchase.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;