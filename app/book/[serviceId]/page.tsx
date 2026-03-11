"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  provider: {
    id: string;
    name: string;
    email: string;
  };
}

export default function BookServicePage({ params }: { params: Promise<{ serviceId: string }> }) {
  const router = useRouter();
  const [serviceId, setServiceId] = useState<string>("");
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    params.then((p) => {
      setServiceId(p.serviceId);
      fetchService(p.serviceId);
    });
    fetchCurrentUser();
  }, []);

  async function fetchCurrentUser() {
    try {
      const response = await fetch("/api/auth/get-session");
      const data = await response.json();
      setCurrentUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      router.push("/sign-in");
    }
  }

  async function fetchService(id: string) {
    try {
      const response = await fetch(`/api/services/${id}`);
      const data = await response.json();
      setService(data);
    } catch (error) {
      console.error("Error fetching service:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleBooking() {
    if (!currentUser || !service) return;

    setIsBooking(true);

    try {
      // Create booking
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          providerId: service.provider.id,
          studentId: currentUser.id,
        }),
      });

      const bookingText = await bookingResponse.text();
      console.log("Booking response:", bookingText);

      if (!bookingResponse.ok) {
        alert("Failed to create booking");
        setIsBooking(false);
        return;
      }

      const bookingData = JSON.parse(bookingText);

      // Initialize payment
      const paymentResponse = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingData.booking.id,
          studentId: currentUser.id,
        }),
      });

      const paymentText = await paymentResponse.text();
      console.log("Payment response status:", paymentResponse.status);
      console.log("Payment response text:", paymentText);

      if (!paymentResponse.ok) {
        alert(`Payment initialization failed: ${paymentText}`);
        setIsBooking(false);
        return;
      }

      const paymentData = JSON.parse(paymentText);

      if (paymentData.success) {
        // Redirect to Paystack
        window.location.href = paymentData.authorizationUrl;
      } else {
        alert("Failed to initialize payment");
        setIsBooking(false);
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to create booking: " + error);
      setIsBooking(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold">Service not found</p>
      </div>
    );
  }

  // Remove currency symbol and parse
  const price = service.price 
    ? parseFloat(service.price.replace(/[^\d.]/g, '')) 
    : 0;

  if (isNaN(price) || price <= 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-100 p-4">
        <Card className="border-8 border-black p-8">
          <p className="text-xl font-black">Invalid service price. Please contact support.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-100 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="bg-yellow-300 border-b-4 border-black">
            <CardTitle className="text-3xl font-black">BOOK SERVICE</CardTitle>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            {/* Service Details */}
            <div>
              <h2 className="text-2xl font-black mb-2">{service.title}</h2>
              <p className="text-sm font-bold text-muted-foreground mb-4">{service.category}</p>
              <p className="text-base font-medium">{service.description}</p>
            </div>

            {/* Provider Info */}
            {service.provider && (
              <div className="bg-cyan-100 border-4 border-black p-4">
                <p className="font-black text-sm mb-1">SERVICE PROVIDER</p>
                <p className="font-bold">{service.provider.name}</p>
                <p className="text-sm text-muted-foreground">{service.provider.email}</p>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="bg-white border-4 border-black p-6">
              <h3 className="text-xl font-black mb-4">PAYMENT BREAKDOWN</h3>
              <div className="space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Service Cost:</span>
                  <span>GH₵ {price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Platform Fee (15%):</span>
                  <span>GH₵ {(price * 0.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Provider Receives:</span>
                  <span>GH₵ {(price * 0.85).toFixed(2)}</span>
                </div>
                <div className="border-t-4 border-black pt-2 mt-2 flex justify-between text-xl font-black">
                  <span>TOTAL:</span>
                  <span>GH₵ {price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Book Button */}
            <button
              onClick={handleBooking}
              disabled={isBooking}
              className="w-full bg-black text-white px-10 py-6 font-black text-2xl border-6 border-black hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isBooking ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  PROCESSING...
                </>
              ) : (
                "BOOK & PAY NOW"
              )}
            </button>

            <p className="text-xs text-center text-muted-foreground">
              You will be redirected to Paystack to complete payment securely
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}