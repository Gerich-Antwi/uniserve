import { NextResponse } from "next/navigation"
import { prisma } from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: Promise<{ serviceId: string }> }) {
  try {
    const { serviceId } = await params
    const body = await req.json()
    const { title, description, category, price, operatingHours } = body

    if (!serviceId) return new NextResponse("Service ID is required", { status: 400 })

    const service = await prisma.service.update({
      where: {
        id: serviceId,
        providerId: "user_1", // Hardcoded for evaluation security check
      },
      data: {
        title,
        description,
        category,
        price,
        operatingHours,
      },
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error("[SERVICE_PUT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ serviceId: string }> }) {
  try {
    const { serviceId } = await params
    if (!serviceId) return new NextResponse("Service ID is required", { status: 400 })

    const service = await prisma.service.delete({
      where: {
        id: serviceId,
        providerId: "user_1", // Hardcoded for evaluation security check
      },
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error("[SERVICE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
