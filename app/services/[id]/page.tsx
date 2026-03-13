import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { ContactProvider } from "@/components/contact-provider"

export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ServiceDetailsPage({ params }: PageProps) {
    const { id } = await params

    const service = await prisma.service.findUnique({
        where: { id },
        include: { provider: true },
    })

    if (!service) {
        notFound()
    }

    // Category-specific colors
    const categoryColors: Record<string, string> = {
        "Laundry": "bg-cyan-300",
        "Grooming": "bg-pink-300",
        "Tech Support": "bg-purple-200",
        "Food Delivery": "bg-orange-300",
        "Coffee Run": "bg-yellow-300",
        "Tutoring": "bg-lime-300",
    }
    const categoryBg = categoryColors[service.category] || "bg-purple-200"

    return (
        <div className="container py-8 max-w-4xl mx-auto px-4 md:px-6">
            <div className="mb-6">
                <Link href="/services">
                    <Button variant="outline" size="sm">
                        &larr; Back to Services
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <div className="relative">
                        <div className="absolute -left-4 top-0 w-1.5 h-full bg-black" />
                        <div className="flex items-center gap-3 mb-4">
                            <Badge variant="outline" className={`text-base px-3 py-1 ${categoryBg}`}>
                                {service.category}
                            </Badge>
                            <Badge variant="secondary" className={`${
                                service.status === "Available"
                                    ? "bg-green-300 text-black"
                                    : "bg-yellow-300 text-black"
                            } text-base px-3 py-1`}>
                                {service.status}
                            </Badge>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
                            {service.title}
                        </h1>
                        <div className="flex flex-col gap-3 mb-6 p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            {service.price && (
                                <div className="text-2xl font-black flex items-center gap-2">
                                    <span className="bg-yellow-300 border-2 border-black px-3 py-1">{service.price}</span>
                                    <span className="text-sm font-bold text-muted-foreground ml-2">starting price</span>
                                </div>
                            )}
                            {service.operatingHours && (
                                <div className="flex items-center gap-2 text-sm font-bold">
                                    <Clock className="h-4 w-4" />
                                    <span>{service.operatingHours}</span>
                                </div>
                            )}
                            
                            {/* Book Now Button */}
                            <Link href={`/book/${service.id}`} className="w-full mt-4">
                                <button className="w-full bg-black text-white px-8 py-4 font-black text-xl border-4 border-black hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    BOOK NOW →
                                </button>
                            </Link>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap leading-relaxed font-bold">
                                {service.description}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar / Provider Info */}
                <div className="space-y-4 sm:space-y-6">
                    <Card className="sticky top-20 bg-purple-100">
                        <CardHeader className="p-3 sm:p-6">
                            <CardTitle className="text-base sm:text-lg">About the Provider</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
                                    <AvatarImage src={service.provider.image || ""} alt={service.provider.name} />
                                    <AvatarFallback>
                                        <UserIcon className="h-6 w-6" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <div className="font-black truncate">{service.provider.name}</div>
                                    <div className="text-xs font-bold text-muted-foreground">Joined {service.provider.createdAt.toLocaleDateString()}</div>
                                </div>
                            </div>

                            {service.provider.bio && (
                                <p className="text-sm font-bold text-muted-foreground leading-relaxed pt-2 border-t-2 border-black">
                                    {service.provider.bio}
                                </p>
                            )}

                            <div className="space-y-3 pt-2 border-t-2 border-black">
                                <ContactProvider
                                    phoneNumber={service.provider.phoneNumber}
                                    location={service.provider.location}
                                />
                            </div>
                        </CardContent>

                    </Card>
                </div>
            </div>
        </div>
    )
}