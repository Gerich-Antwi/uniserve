import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const announcement = await prisma.announcement.create({
      data: {
        title: body.title,
        content: body.content,
        summary: body.summary || null,
        category: body.category,
        imageUrl: body.imageUrl || null,
        externalLink: body.externalLink || null,
        contactInfo: body.contactInfo || null,
        isVerified: body.isVerified || true,
        isActive: body.isActive || true,
      },
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      where: {
        isActive: true,
        isVerified: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}