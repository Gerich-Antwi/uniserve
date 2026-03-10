import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, providerId, studentId } = body;

    // Validate required fields
    if (!serviceId || !providerId || !studentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create booking with PENDING status
    const booking = await prisma.booking.create({
      data: {
        serviceId,
        providerId,
        studentId,
        status: "PENDING",
      },
      include: {
        service: true,
        provider: true,
        student: true,
      },
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}