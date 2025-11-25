"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/utils/supabase/client"
import { DataTable } from "./data-table"
import { SOSAlertFormatted } from "@/types"
import { toast } from "sonner"

interface RealtimeDataTableProps {
  initialData: SOSAlertFormatted[]
}

export function RealtimeDataTable({ initialData }: RealtimeDataTableProps) {
  const [data, setData] = useState<SOSAlertFormatted[]>(initialData)
  const supabase = createClient()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio on mount
  useEffect(() => {
    audioRef.current = new Audio('/alarm.mp3')
    audioRef.current.volume = 1.0
    audioRef.current.preload = 'auto'
    audioRef.current.load()
    
    // Enable audio on first user interaction to bypass autoplay policy
    const enableAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play()
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        } catch (err) {
          // Silently fail - audio will be enabled on next interaction
        }
      }
    }
    
    document.addEventListener('click', enableAudio, { once: true })
    document.addEventListener('keydown', enableAudio, { once: true })
    
    return () => {
      document.removeEventListener('click', enableAudio)
      document.removeEventListener('keydown', enableAudio)
    }
  }, [])

  useEffect(() => {
    // Subscribe to changes in the sos_alerts table
    const channel = supabase
      .channel('sos_alerts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sos_alerts'
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            // Fetch the new alert with user information
            const { data: newAlert, error } = await supabase
              .from('sos_alerts')
              .select(`
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
              `)
              .eq('id', payload.new.id)
              .single()

            if (error) {
              console.error('Error fetching new alert:', error)
              return
            }

            // Transform the data to match the expected format
            const userData = Array.isArray(newAlert.users) ? newAlert.users[0] : newAlert.users
            const formattedAlert: SOSAlertFormatted = {
              id: newAlert.id,
              status: newAlert.status,
              name: userData ? `${userData.name} ${userData.last_name}`.trim() : "Unknown User",
              profile_picture: userData?.photo_url || null,
              lat: newAlert.lat,
              lng: newAlert.lng,
              created_at: newAlert.created_at,
              closed_at: newAlert.closed_at,
            }

            // Add to the beginning of the array (most recent first)
            setData((current) => [formattedAlert, ...current])
            
            // Play alarm sound on loop
            if (audioRef.current) {
              audioRef.current.currentTime = 0
              audioRef.current.loop = true
              audioRef.current.play().catch(() => {
                // Audio play failed - user needs to interact with page first
              })
            }
            
            toast.success('Nueva alerta SOS recibida', {
              description: `De ${formattedAlert.name}`,
              duration: Infinity,
              className: 'border-2 border-red-500 bg-red-50 dark:bg-red-950',
              onDismiss: () => {
                if (audioRef.current) {
                  audioRef.current.pause()
                  audioRef.current.currentTime = 0
                  audioRef.current.loop = false
                }
              },
            })
          } else if (payload.eventType === 'UPDATE') {
            // Update existing alert
            setData((current) =>
              current.map((alert) =>
                alert.id === payload.new.id
                  ? { ...alert, status: payload.new.status, closed_at: payload.new.closed_at }
                  : alert
              )
            )

            if (payload.old.status === 'open' && payload.new.status !== 'open') {
              toast.info('Alerta actualizada', {
                description: `Estado: ${payload.new.status === 'closed' ? 'Resuelta' : payload.new.status}`,
                duration: 5000,
                className: 'border-2 border-green-500 bg-green-50 dark:bg-green-950',
              })
            }
          } else if (payload.eventType === 'DELETE') {
            setData((current) => current.filter((alert) => alert.id !== payload.old.id))
            toast.info('Alerta eliminada', {
              duration: 4000
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return <DataTable data={data} />
}
