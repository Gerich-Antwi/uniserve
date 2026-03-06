import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;
    const folder = formData.get("folder") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to ImageKit
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("fileName", fileName);
    uploadFormData.append("folder", folder);

    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY!;

    const authString = Buffer.from(`${privateKey}:`).toString("base64");

    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("ImageKit upload error:", error);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      url: data.url,
      fileId: data.fileId,
      name: data.name,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}