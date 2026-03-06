"use client"

import { format } from "date-fns"
import type { Prisma } from "@/lib/generated/prisma/client"
import { Badge } from "@/components/ui/badge"

type Service = Prisma.ServiceGetPayload<{}>

interface ProviderServicesProps {
  services: Service[]
}

export function ProviderServices({ services }: ProviderServicesProps) {
  if (!services.length) {
    return (
      <section className="rounded-2xl border-4 border-dashed border-black bg-white/70 p-6 text-center shadow-[6px_6px_0_0_#000]">
        <h2 className="text-xl font-extrabold uppercase tracking-[0.18em]">
          No active services
        </h2>
        <p className="mt-2 text-sm text-foreground/70">
          You haven&apos;t created any services yet.
        </p>
      </section>
    )
  }

  return (
    <section className="space-y-4 pt-8">
      <h2 className="text-2xl font-extrabold uppercase tracking-tight">
        Your Services
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <article
            key={service.id}
            className="group relative overflow-hidden rounded-2xl border-4 border-black bg-white p-4 shadow-[6px_6px_0_0_#000] transition-transform hover:-translate-y-1"
          >
            <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.04)_0,rgba(0,0,0,0.04)_2px,transparent_2px,transparent_6px)] opacity-70" />
            <div className="relative flex flex-col gap-3">
              <header className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-extrabold uppercase tracking-[0.15em] mb-1">
                    {service.title}
                  </h3>
                  <Badge variant="outline" className="border-2 border-black font-bold text-xs uppercase bg-purple-100">
                    {service.status}
                  </Badge>
                </div>
              </header>
              <p className="text-sm font-medium text-foreground/80 line-clamp-2">
                {service.description}
              </p>
              <div className="flex items-center justify-between text-xs font-semibold uppercase text-foreground/70 mt-4">
                <span>{service.price || "Free"}</span>
                <span>Created {format(new Date(service.createdAt), "dd MMM yyyy")}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
