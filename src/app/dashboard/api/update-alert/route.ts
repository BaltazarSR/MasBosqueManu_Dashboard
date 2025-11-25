import { NextRequest, NextResponse } from "next/server"
import { updateSOSAlertStatus } from "@/services/sos-alerts"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { alertId, status } = body

    if (!alertId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const success = await updateSOSAlertStatus(alertId, status)

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update alert" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Error in update-alert API route", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
