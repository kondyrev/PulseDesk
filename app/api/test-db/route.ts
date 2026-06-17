import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.widgetSetting.findMany();

    return NextResponse.json({
      success: true,
      count: settings.length,
      data: settings,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Database error",
      },
      {
        status: 500,
      }
    );
  }
}