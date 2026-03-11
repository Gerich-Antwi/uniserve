import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(request: NextRequest) {
  try {
    // Read the body once
    const bodyText = await request.text();
    const body = JSON.parse(bodyText);

    // Verify Paystack signature
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(bodyText)
      .digest("hex");

    const paystackSignature = request.headers.get("x-paystack-signature");

    if (hash !== paystackSignature) {
      console.log("Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = body.event;
    const data = body.data;

    console.log("Webhook received:", event, "Reference:", data.reference);

    // Only process successful payments
    if (event === "charge.success") {
      const reference = data.reference;

      // Find the transaction
      const transaction = await prisma.transaction.findUnique({
        where: { paystackReference: reference },
        include: { booking: true },
      });

      if (!transaction) {
        console.error("Transaction not found:", reference);
        return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
      }

      // Update transaction to success
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "success",
          paidAt: new Date(),
          paymentMethod: data.channel,
        },
      });

      // Update booking status to ATTENDED
      await prisma.booking.update({
        where: { id: transaction.bookingId },
        data: {
          status: "ATTENDED",
        },
      });

      // Create or update provider wallet
      await prisma.providerWallet.upsert({
        where: { providerId: transaction.providerId },
        create: {
          providerId: transaction.providerId,
          availableBalance: transaction.providerEarnings,
          totalEarnings: transaction.providerEarnings,
        },
        update: {
          availableBalance: { increment: transaction.providerEarnings },
          totalEarnings: { increment: transaction.providerEarnings },
        },
      });

      console.log("Payment processed successfully:", {
        reference,
        amount: transaction.totalAmount,
        providerEarnings: transaction.providerEarnings,
        platformCommission: transaction.platformCommission,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}