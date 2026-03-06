import { NextResponse } from "next/navigation"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, category, price, operatingHours } = body

    if (!title || !description || !category) {
      return new NextResponse("Title, description, and category are required", { status: 400 })
    }

    const service = await prisma.service.create({
      data: {
        title,
        description,
        category,
        price,
        operatingHours,
        status: "Available",
        providerId: "user_1", // Hardcoded for evaluation
      },
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error("[SERVICES_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
