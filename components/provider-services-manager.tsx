"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Plus, Pencil, Trash2, Clock, DollarSign, Tag } from "lucide-react"
import type { Prisma } from "@/lib/generated/prisma/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Service = Prisma.ServiceGetPayload<{}>

interface ProviderServicesManagerProps {
  initialServices: Service[]
}

export function ProviderServicesManager({ initialServices }: ProviderServicesManagerProps) {
  const [services, setServices] = useState(initialServices)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [currentService, setCurrentService] = useState<Service | null>(null)
  
  // Form State
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [operatingHours, setOperatingHours] = useState("")

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setCategory("")
    setPrice("")
    setOperatingHours("")
    setCurrentService(null)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/provider/services", {
        method: "POST",
        body: JSON.stringify({ title, description, category, price, operatingHours }),
        headers: { "Content-Type": "application/json" }
      })
      
      if (!res.ok) throw new Error("Failed to create service")
      const newService = await res.json()
      setServices([newService, ...services])
      setIsAddOpen(false)
      resetForm()
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentService) return
    
    try {
      const res = await fetch(`/api/provider/services/${currentService.id}`, {
        method: "PUT",
        body: JSON.stringify({ title, description, category, price, operatingHours }),
        headers: { "Content-Type": "application/json" }
      })
      
      if (!res.ok) throw new Error("Failed to update service")
      const updatedService = await res.json()
      setServices(services.map(s => s.id === updatedService.id ? updatedService : s))
      setIsEditOpen(false)
      resetForm()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return
    
    try {
      const res = await fetch(`/api/provider/services/${id}`, {
        method: "DELETE",
      })
      
      if (!res.ok) throw new Error("Failed to delete service")
      setServices(services.filter(s => s.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  const openEdit = (service: Service) => {
    setCurrentService(service)
    setTitle(service.title)
    setDescription(service.description)
    setCategory(service.category)
    setPrice(service.price || "")
    setOperatingHours(service.operatingHours || "")
    setIsEditOpen(true)
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold uppercase tracking-tight">
          Your Services
        </h2>
        
        <Dialog open={isAddOpen} onOpenChange={(open) => {
          setIsAddOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="font-bold border-2 border-black bg-lime-300 text-black hover:bg-lime-400 shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="border-4 border-black shadow-[8px_8px_0_0_#000] sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tight">Create New Service</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="font-bold uppercase tracking-wide text-xs">Title <span className="text-red-500">*</span></Label>
                <Input required value={title} onChange={e => setTitle(e.target.value)} className="border-2 border-black focus-visible:ring-lime-300 font-medium" placeholder="e.g. Calculus Tutoring" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold uppercase tracking-wide text-xs">Category <span className="text-red-500">*</span></Label>
                <Input required value={category} onChange={e => setCategory(e.target.value)} className="border-2 border-black focus-visible:ring-lime-300 font-medium" placeholder="e.g. Academics" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold uppercase tracking-wide text-xs">Description <span className="text-red-500">*</span></Label>
                <Textarea required value={description} onChange={e => setDescription(e.target.value)} className="border-2 border-black focus-visible:ring-lime-300 min-h-[100px] font-medium" placeholder="Describe what you offer..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold uppercase tracking-wide text-xs">Price</Label>
                  <Input value={price} onChange={e => setPrice(e.target.value)} className="border-2 border-black focus-visible:ring-lime-300 font-medium" placeholder="e.g. $20/hr" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold uppercase tracking-wide text-xs">Operating Hours</Label>
                  <Input value={operatingHours} onChange={e => setOperatingHours(e.target.value)} className="border-2 border-black focus-visible:ring-lime-300 font-medium" placeholder="e.g. Mon-Fri 5PM-9PM" />
                </div>
              </div>
              <Button type="submit" className="w-full mt-4 font-black text-lg border-2 border-black bg-lime-300 text-black hover:bg-lime-400 shadow-[4px_4px_0_0_#000]">
                Publish Service
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={(open) => {
          setIsEditOpen(open)
          if (!open) resetForm()
        }}>
          <DialogContent className="border-4 border-black shadow-[8px_8px_0_0_#000] sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tight">Edit Service</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="font-bold uppercase tracking-wide text-xs">Title <span className="text-red-500">*</span></Label>
                <Input required value={title} onChange={e => setTitle(e.target.value)} className="border-2 border-black focus-visible:ring-lime-300 font-medium" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold uppercase tracking-wide text-xs">Category <span className="text-red-500">*</span></Label>
                <Input required value={category} onChange={e => setCategory(e.target.value)} className="border-2 border-black focus-visible:ring-lime-300 font-medium" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold uppercase tracking-wide text-xs">Description <span className="text-red-500">*</span></Label>
                <Textarea required value={description} onChange={e => setDescription(e.target.value)} className="border-2 border-black focus-visible:ring-lime-300 min-h-[100px] font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold uppercase tracking-wide text-xs">Price</Label>
                  <Input value={price} onChange={e => setPrice(e.target.value)} className="border-2 border-black focus-visible:ring-lime-300 font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold uppercase tracking-wide text-xs">Operating Hours</Label>
                  <Input value={operatingHours} onChange={e => setOperatingHours(e.target.value)} className="border-2 border-black focus-visible:ring-lime-300 font-medium" />
                </div>
              </div>
              <Button type="submit" className="w-full mt-4 font-black text-lg border-2 border-black bg-lime-300 text-black hover:bg-lime-400 shadow-[4px_4px_0_0_#000]">
                Save Changes
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!services.length ? (
        <section className="rounded-2xl border-4 border-dashed border-black bg-white/70 p-10 text-center">
          <h2 className="text-xl font-extrabold uppercase tracking-[0.18em]">
            No active services
          </h2>
          <p className="mt-2 text-sm text-foreground/70 font-medium">
            You haven&apos;t created any services yet. Add one to get started!
          </p>
        </section>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_#000] hover:-translate-y-1 transition-transform"
            >
              <div>
                <header className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-lg font-black uppercase tracking-tight flex-1">
                    {service.title}
                  </h3>
                  <Badge variant="outline" className="border-2 border-black font-bold text-xs uppercase bg-purple-100 whitespace-nowrap">
                    {service.status}
                  </Badge>
                </header>
                
                <p className="text-sm font-medium text-foreground/80 line-clamp-3 mb-4">
                  {service.description}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-xs font-semibold text-foreground/70">
                    <Tag className="w-3.5 h-3.5 mr-2 text-black" />
                    {service.category}
                  </div>
                  {service.price && (
                    <div className="flex items-center text-xs font-semibold text-foreground/70 bg-green-50 w-fit px-2 py-0.5 rounded border border-green-200">
                      <DollarSign className="w-3.5 h-3.5 mr-1 text-green-600" />
                      <span className="text-green-700">{service.price}</span>
                    </div>
                  )}
                  {service.operatingHours && (
                    <div className="flex items-center text-xs font-semibold text-foreground/70">
                      <Clock className="w-3.5 h-3.5 mr-2 text-black" />
                      {service.operatingHours}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t-2 border-black/10">
                <Button 
                  onClick={() => openEdit(service)}
                  variant="outline" 
                  className="flex-1 font-bold border-2 border-black bg-amber-100 hover:bg-amber-200 shadow-[2px_2px_0_0_#000] hover:-translate-y-0.5 transition-all text-xs h-9"
                >
                  <Pencil className="w-3.5 h-3.5 mr-1.5" />
                  Edit
                </Button>
                <Button 
                  onClick={() => handleDelete(service.id)}
                  variant="destructive" 
                  className="px-3 font-bold border-2 border-black shadow-[2px_2px_0_0_#000] hover:-translate-y-0.5 transition-all h-9"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
