import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const studentId =
      body.studentId ?? body.userId ?? body.student_id ?? body.user_id;
    const providerId = body.providerId ?? body.provider_id;
    const serviceId = body.serviceId ?? body.service_id;

    if (!studentId || !providerId || !serviceId) {
      return NextResponse.json(
        {
          error: "studentId (or userId), providerId, and serviceId are required",
        },
        { status: 400 },
      );
    }

    // Create Booking and its associated Conversation in a single nested operation
    const booking = await prisma.booking.create({
      data: {
        studentId,
        providerId,
        serviceId,
        conversation: {
          create: {}, // Prisma will automatically create the Conversation and set its `bookingId`
        },
      },
      include: {
        conversation: true,
      },
    });

    return NextResponse.json(
      {
        booking,
        conversationId: booking.conversation?.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}

