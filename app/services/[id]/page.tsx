import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProviderServicesClient } from "@/components/provider-services-client"

export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ServiceDetailsPage({ params }: PageProps) {
    const { id } = await params

    // Fetch the clicked service with provider info
    const service = await prisma.service.findUnique({
        where: { id },
        include: { 
            provider: {
                include: {
                    servicesProvided: {
                        orderBy: { createdAt: 'desc' }
                    }
                }
            }
        },
    })

    if (!service) {
        notFound()
    }

    const provider = service.provider

    return (
        <div className="container py-8 max-w-7xl mx-auto px-4 md:px-6">
            {/* Back Button */}
            <div className="mb-6">
                <Link href="/services">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Services
                    </Button>
                </Link>
            </div>

            {/* Provider Header */}
            <div className="mb-8 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-start gap-4">
                    <Avatar className="h-20 w-20 border-4 border-black">
                        <AvatarImage src={provider.image || ""} alt={provider.name} />
                        <AvatarFallback className="bg-yellow-300 font-black text-2xl">
                            {provider.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                        <h1 className="text-3xl md:text-4xl font-black mb-2">{provider.name}</h1>
                        
                        {provider.bio && (
                            <p className="text-muted-foreground font-bold mb-3">{provider.bio}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-3 text-sm">
                            {provider.location && (
                                <div className="flex items-center gap-1 font-bold">
                                    <MapPin className="h-4 w-4" />
                                    <span>{provider.location}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1 font-bold">
                                <span className="bg-green-300 border-2 border-black px-2 py-1 text-xs">
                                    {provider.servicesProvided.length} {provider.servicesProvided.length === 1 ? 'Service' : 'Services'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div>
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                    <span className="bg-pink-300 border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block -rotate-1">
                        ALL SERVICES
                    </span>
                </h2>

                <ProviderServicesClient 
                    services={provider.servicesProvided} 
                    providerId={provider.id} 
                    providerName={provider.name}
                    highlightedServiceId={service.id}
                />
            </div>
        </div>
    )
}
