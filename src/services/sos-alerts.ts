import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { logger } from "@/lib/logger";
import { SOSAlert, SOSAlertFormatted, AlertStatus } from "@/types";

/**
 * Fetches all SOS alerts from the database with user information
 * Joins sos_alerts table with users table to get complete user data
 * Uses profile_id from sos_alerts to fetch user info from users table
 */
export async function fetchSOSAlerts(): Promise<SOSAlertFormatted[]> {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("sos_alerts")
    .select(
      `
      id,
      profile_id,
      status,
      lat,
      lng,
      created_at,
      closed_at,
      users!profile_id (
        name,
        last_name,
        photo_url
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("Error fetching SOS alerts", error);
    throw error;
  }

  // Transform the data to match the expected format
  return (data || []).map((alert: any) => {
    // Handle case where users might be an array
    const userData = Array.isArray(alert.users) ? alert.users[0] : alert.users;
    
    return {
      id: alert.id,
      status: alert.status,
      name: userData ? `${userData.name} ${userData.last_name}`.trim() : "Unknown User",
      profile_picture: userData?.photo_url || null,
      lat: alert.lat,
      lng: alert.lng,
      created_at: alert.created_at,
      closed_at: alert.closed_at,
    };
  });
}

/**
 * Fetches a single SOS alert by ID with user information
 * Uses profile_id from sos_alerts to fetch user info from users table
 */
export async function fetchSOSAlertById(alertId: string): Promise<SOSAlertFormatted | null> {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("sos_alerts")
    .select(
      `
      id,
      profile_id,
      status,
      lat,
      lng,
      created_at,
      closed_at,
      users!profile_id (
        name,
        last_name,
        photo_url
      )
    `
    )
    .eq("id", alertId)
    .single();

  if (error) {
    logger.error("Error fetching SOS alert", error, { alertId });
    return null;
  }

  if (!data) return null;

  // Handle case where users might be an array
  const userData = Array.isArray(data.users) ? data.users[0] : data.users;

  return {
    id: data.id,
    status: data.status,
    name: userData ? `${userData.name} ${userData.last_name}`.trim() : "Unknown User",
    profile_picture: userData?.photo_url || null,
    lat: data.lat,
    lng: data.lng,
    created_at: data.created_at,
    closed_at: data.closed_at,
  };
}

/**
 * Updates the status of an SOS alert
 */
export async function updateSOSAlertStatus(
  alertId: string,
  status: AlertStatus
): Promise<boolean> {
  const supabase = await createClient(cookies());

  const updateData: any = { status };

  // If closing the alert, set the closed_at timestamp
  if (status === "closed" || status === "cancelled" || status === "false_alarm") {
    updateData.closed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("sos_alerts")
    .update(updateData)
    .eq("id", alertId);

  if (error) {
    logger.error("Error updating SOS alert", error, { alertId, status });
    return false;
  }

  return true;
}
