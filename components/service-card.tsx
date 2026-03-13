
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone } from "lucide-react"

// Define Service type locally or import from Prisma client/types
// For now, inline interface based on schema
interface ServiceCardProps {
    id: string
    title: string
    description: string
    category: string
    status: string
    price: string | null
    provider: {
        name: string
        image: string | null
        location: string | null
    }
}

const categoryColors: Record<string, string> = {
    "Laundry": "bg-cyan-300",
    "Grooming": "bg-pink-300",
    "Tech Support": "bg-purple-300",
    "Food Delivery": "bg-orange-300",
    "Coffee Run": "bg-lime-300",
    "Tutoring": "bg-yellow-300",
}

export function ServiceCard({ id, title, description, category, status, price, provider }: ServiceCardProps) {
    const categoryColor = categoryColors[category] || "bg-purple-200"
    const statusColor = status === "Available"
        ? "bg-green-300 text-black"
        : "bg-yellow-300 text-black"

    return (
        <Link href={`/services/${id}`} className="min-w-0">
            <Card className="h-full cursor-pointer overflow-hidden group bg-white min-w-0">
                <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
                    <div className="flex flex-wrap items-start gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <Badge variant="outline" className={`${categoryColor} border-black font-black whitespace-normal text-left text-[10px] sm:text-xs`}>
                            {category}
                        </Badge>
                        <Badge variant="outline" className={`${statusColor} border-black font-black whitespace-normal text-left text-[10px] sm:text-xs`}>
                            {status}
                        </Badge>
                    </div>
                    <CardTitle className="text-base sm:text-lg md:text-xl group-hover:text-pink-500 transition-colors whitespace-normal leading-tight line-clamp-2">{title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2 sm:pb-3 px-3 sm:px-6">
                    <p className="text-muted-foreground text-xs sm:text-sm font-bold line-clamp-2 min-h-[2.5rem]">
                        {description}
                    </p>
                    {price && (
                        <div className="mt-2 sm:mt-3 font-black text-foreground flex items-center gap-1">
                            <span className="inline-block bg-yellow-300 border-2 border-black px-1.5 sm:px-2 py-0.5 text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                {price}
                            </span>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="pt-2 sm:pt-3 px-3 sm:px-6 border-t-4 border-black bg-muted/30 flex flex-wrap justify-between items-center gap-2 text-[10px] sm:text-xs font-bold group-hover:bg-accent/30 transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="font-black text-foreground truncate">{provider.name}</div>
                    </div>
                    {provider.location && (
                        <div className="flex items-center gap-1 min-w-0 shrink-0">
                            <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                            <span className="truncate max-w-[80px] sm:max-w-[100px]">{provider.location}</span>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </Link>
    )
}
