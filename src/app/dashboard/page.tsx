import { RealtimeDataTable } from "@/components/realtime-data-table"
import { NavUser } from "@/components/nav-user"
import { fetchSOSAlerts } from "@/services/sos-alerts"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logout } from "./actions"
import { getCurrentUserWithProfile } from "@/lib/auth"

export default async function Page() {
  const { user, profile } = await getCurrentUserWithProfile()
  
  if (!user) {
    redirect("/login")
  }

  // Check if user is admin
  if (!profile || profile.role !== 'admin') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You need admin privileges to access the dashboard.
          </p>
          <p className="text-sm text-muted-foreground">
            Current role: {profile?.role || 'unknown'}
          </p>
          <form action={logout}>
            <Button type="submit" variant="outline" className="mt-4">
              Logout
            </Button>
          </form>
        </div>
      </div>
    )
  }

  // Fetch SOS alerts from the database
  const sosAlerts = await fetchSOSAlerts()

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap- py-2">
          <NavUser user={{ 
            name: profile ? `${profile.name} ${profile.last_name}` : user?.email?.split('@')[0] || "User", 
            email: user?.email || "", 
            avatar: profile?.photo_url || "/avatar.png" 
          }} />
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <RealtimeDataTable initialData={sosAlerts} />
          </div>
        </div>
      </div>
    </>
  )
}
