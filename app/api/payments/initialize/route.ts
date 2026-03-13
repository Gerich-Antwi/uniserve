import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, studentId } = body;

    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: true,
        student: true,
        provider: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Get service price (remove currency symbol and parse)
    const servicePrice = parseFloat(booking.service.price?.replace(/[^\d.]/g, '') || "0");
    
    if (servicePrice <= 0) {
      return NextResponse.json({ error: "Invalid service price" }, { status: 400 });
    }

    // Calculate amounts (GHS)
    const totalAmount = servicePrice;
    const platformCommission = totalAmount * 0.15; // 15%
    const providerEarnings = totalAmount - platformCommission;

    // Convert to pesewas (Paystack uses smallest currency unit)
    const amountInPesewas = Math.round(totalAmount * 100);

    // Initialize payment with Paystack
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: booking.student.email,
        amount: amountInPesewas,
        reference: `uniserve_${bookingId}_${Date.now()}`,
        metadata: {
          bookingId,
          studentId,
          providerId: booking.providerId,
          serviceId: booking.serviceId,
          totalAmount,
          platformCommission,
          providerEarnings,
        },
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback`,
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      console.error("Paystack error:", paystackData);
      return NextResponse.json(
        { error: "Failed to initialize payment", details: paystackData },
        { status: 500 }
      );
    }

    // Create pending transaction record
    await prisma.transaction.create({
      data: {
        bookingId,
        studentId,
        providerId: booking.providerId,
        paystackReference: paystackData.data.reference,
        totalAmount,
        platformCommission,
        providerEarnings,
        commissionRate: 0.15,
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      authorizationUrl: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 }
    );
  }
}