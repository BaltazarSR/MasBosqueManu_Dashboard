"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { 
  Area, AreaChart, CartesianGrid, XAxis 
} from "recharts"
import { 
  z 
} from "zod"
import { 
  useIsMobile 
} from "@/hooks/use-mobile"
import { toast } from "sonner"
import { 
  Badge 
} from "@/components/ui/badge"
import { 
  Button 
} from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { 
  Checkbox 
} from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Input 
} from "@/components/ui/input"
import { 
  Label 
} from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Separator 
} from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const AlertMap = dynamic(
  () => import('@/components/alert-map').then(mod => ({ default: mod.AlertMap })),
  { ssr: false }
)

const AlertsMap = dynamic(
  () => import('@/components/alerts-map').then(mod => ({ default: mod.AlertsMap })),
  { ssr: false }
)

export const schema = z.object({
  id: z.string(),
  status: z.string(),
  name: z.string(),
  profile_picture: z.string().nullable(),
  lat: z.number(),
  lng: z.number(),
  created_at: z.string(),
  closed_at: z.string().nullable(),
})

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    accessorKey: "estatus",
    header: "Estatus",
    cell: ({ row }) => (
      <Badge 
        variant="outline" 
        className="px-1.5"
        style={{
          backgroundColor: row.original.status === 'open' ? 'var(--badge-open)' : 'var(--badge-closed)',
          color: row.original.status === 'open' ? 'var(--badge-open-foreground)' : 'var(--badge-closed-foreground)',
          borderColor: row.original.status === 'open' ? 'var(--badge-open-foreground)' : 'var(--badge-closed-foreground)'
        }}
      >
        {row.original.status === 'open' ? "activa" : "resuelta" }
      </Badge>
    ),
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.name}
      </div>
    ),
  },
  {
    accessorKey: "lat",
    header: "Latitud",
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.lat.toFixed(4)}
      </div>
    ),
  },
  {
    accessorKey: "lon",
    header: "Longitud",
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.lng.toFixed(4)}
      </div>
    ),
  },
  {
    accessorKey: "enviada",
    header: "Enviada a las",
    accessorFn: (row) => new Date(row.created_at).getTime(),
    cell: ({ row }) => {
      const date = new Date(row.original.created_at)
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear().toString().slice(-2)
      return (
        <div className="text-sm">
          {hours}:{minutes}, {day}/{month}/{year}
        </div>
      )
    },
  },
  {
    accessorKey: "cerrada",
    header: "Resuelta a las",
    cell: ({ row }) => {
      if (!row.original.closed_at) {
        return <span className="text-muted-foreground text-sm">—</span>
      }
      const date = new Date(row.original.closed_at)
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear().toString().slice(-2)
      return (
        <div className="text-sm">
          {hours}:{minutes}, {day}/{month}/{year}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const handleMarkAsResolved = async () => {
        const alert = row.original
        if (alert.status === 'closed') {
          toast.error('Esta alerta ya está resuelta')
          return
        }

        try {
          const response = await fetch('/dashboard/api/update-alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              alertId: alert.id, 
              status: 'closed' 
            }),
          })

          if (!response.ok) throw new Error('Failed to update alert')

          // Update the row data in the table
          const meta = table.options.meta as any
          if (meta?.updateData) {
            meta.updateData(alert.id, { 
              status: 'closed', 
              closed_at: new Date().toISOString() 
            })
          }

          toast.success('Alerta marcada como resuelta')
        } catch (error) {
          console.error('Error updating alert:', error)
          toast.error('Error al actualizar la alerta')
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Abrir Menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-50">
            <DropdownMenuItem 
              onClick={handleMarkAsResolved}
              disabled={row.original.status === 'closed'}
            >
              Marcar como resuelta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {
  const [data, setData] = React.useState(() => initialData)

  // Sync internal state when prop changes
  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  const openAlerts = React.useMemo(() => data.filter(item => item.status === 'open'), [data])
  const closedAlerts = React.useMemo(() => data.filter(item => item.status === 'closed'), [data])

  return (
    <Tabs
      defaultValue="all-alerts"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="all-alerts">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-alerts">Todas las alertas</SelectItem>
            <SelectItem value="open-alerts">Alertas activas</SelectItem>
            <SelectItem value="closed-alerts">Alertas cerradas</SelectItem>
            <SelectItem value="map-view">Mapa</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="all-alerts">
            Todas las alertas
          </TabsTrigger>
          <TabsTrigger value="open-alerts">
            Alertas activas <Badge variant="open">{openAlerts.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="closed-alerts">
            Alertas resueltas <Badge variant="closed">{closedAlerts.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="map-view">
            Mapa
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent
        value="all-alerts"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <AlertsTable data={data} columns={columns} onUpdateData={setData} />
      </TabsContent>
      <TabsContent
        value="open-alerts"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <AlertsTable data={openAlerts} columns={columns} onUpdateData={setData} />
      </TabsContent>
      <TabsContent value="closed-alerts" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <AlertsTable data={closedAlerts} columns={columns} onUpdateData={setData} />
      </TabsContent>
      <TabsContent
        value="map-view"
        className="flex flex-col px-4 lg:px-6"
      >
        <AlertsMap alerts={data} />
      </TabsContent>
    </Tabs>
  )
}

function AlertsTable({ 
  data, 
  columns, 
  onUpdateData 
}: { 
  data: z.infer<typeof schema>[], 
  columns: ColumnDef<z.infer<typeof schema>>[], 
  onUpdateData: React.Dispatch<React.SetStateAction<z.infer<typeof schema>[]>> 
}) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: 'enviada',
      desc: true,
    }
  ])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    meta: {
      updateData: (rowId: string, updates: Partial<z.infer<typeof schema>>) => {
        onUpdateData((old) => 
          old.map((row) => 
            row.id === rowId ? { ...row, ...updates } : row
          )
        )
      },
    },
  })

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead 
                      key={header.id} 
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() !== 150 ? `${header.getSize()}px` : 'auto' }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-1">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <DrawerRow key={row.id} row={row} item={row.original} />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-4">
        <div className="flex w-full items-center justify-between gap-8 lg:flex">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Alertas por página
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ir a la primera página</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ir a la página anterior</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ir a la siguiente página</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ir a la última página</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig


function DrawerRow({ row, item }: { row: Row<z.infer<typeof schema>>, item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <TableRow data-state={row.getIsSelected() && "selected"} className="cursor-pointer">
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Detalles de Alerta SOS</DrawerTitle>
          <DrawerDescription>
            Enviada a las {(() => {
              const date = new Date(item.created_at)
              const hours = date.getHours().toString().padStart(2, '0')
              const minutes = date.getMinutes().toString().padStart(2, '0')
              const day = date.getDate()
              const month = date.toLocaleString('es-ES', { month: 'long' })
              const year = date.getFullYear()
              return `${hours}:${minutes}, ${day} ${month} ${year}`
            })()}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-6 overflow-y-auto px-4 pb-4">
          <div className="flex flex-col items-center gap-4 pt-4">
            <Avatar className="size-24 border-background shadow-lg">
              <AvatarImage src={item.profile_picture || undefined} alt={item.name} />
              <AvatarFallback className="text-2xl font-semibold">
                {item.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <Badge 
                variant={item.status === 'open' ? 'open' : 'closed'}
                className="mt-2"
                style={{
                  backgroundColor: item.status === 'open' ? 'var(--badge-open)' : 'var(--badge-closed)',
                  color: item.status === 'open' ? 'var(--badge-open-foreground)' : 'var(--badge-closed-foreground)',
                  borderColor: item.status === 'open' ? 'var(--badge-open-foreground)' : 'var(--badge-closed-foreground)'
                }}
              >
                {item.status === 'open' ? 'Activa' : 'Resuelta'}
              </Badge>
            </div>
          </div>
          
          <Separator />
          
          <div className="px-4">
            <AlertMap lat={item.lat} lng={item.lng} name={item.name} />
          </div>
          
          <Separator />
          
          <div className="grid gap-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Ubicación</Label>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Latitud</div>
                  <div className="text-lg font-semibold">{item.lat.toFixed(6)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Longitud</div>
                  <div className="text-lg font-semibold">{item.lng.toFixed(6)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter className="border-t">
          <DrawerClose asChild>
            <Button variant="outline" size="lg">Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
