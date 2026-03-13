
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ArrowRight, Check, MapPin } from "lucide-react"

interface ServiceCardProps {
    id: string
    title: string
    description: string
    category: string
    status: string
    price: string | null
    imageUrl?: string | null
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

export function ServiceCard({ id, title, description, category, status, price, imageUrl, provider }: ServiceCardProps) {
    const categoryBg = categoryColors[category] || "bg-pink-300"
    const statusBg = status === "Available" ? "bg-green-400" : "bg-yellow-400"

    return (
        <article className="group relative border-[3px] border-black bg-white shadow-[8px_8px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0_0_#000] transition-all overflow-hidden flex flex-col h-full">
            {/* Header with image */}
            <div className="relative aspect-video w-full border-b-[3px] border-black bg-slate-50 overflow-hidden">
                <Image 
                    src={imageUrl || "https://furntech.org.za/wp-content/uploads/2017/05/placeholder-image.png"} 
                    alt={title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Tilted Verified Badge Overlay - Match Photo */}
                <div className="absolute top-3 right-3 bg-[#86efac] border-[3px] border-black px-3 py-1 shadow-[4px_4px_0_0_#000] flex items-center gap-1.5 -rotate-2 z-10">
                    <Check className="w-4 h-4 text-black stroke-[4px]" />
                    <span className="text-xs font-black uppercase tracking-tight text-black">Verified</span>
                </div>
            </div>

            {/* Content Body - Light colored background */}
            <CardContent className={`${categoryBg} p-6 flex-grow flex flex-col gap-4 bg-opacity-30`}>
                {/* Category name - Simple text */}
                <span className="text-xs font-black uppercase tracking-widest text-black/60">
                    {category}
                </span>

                {/* Service Title - Large & Bold */}
                <Link href={`/services/${id}`} className="block">
                    <h3 className="text-2xl font-black uppercase leading-none tracking-tight text-black hover:underline decoration-4">
                        {title}
                    </h3>
                </Link>

                <div className="flex items-end justify-between mt-2">
                    {/* Rating Box - Yellow with border */}
                    <div className="bg-yellow-400 border-[3px] border-black px-3 py-2 flex items-center gap-2 shadow-[2px_2px_0_0_#000]">
                        <Star className="w-4 h-4 fill-black text-black" />
                        <span className="font-black text-sm">4.6 <span className="opacity-60">(92)</span></span>
                    </div>

                    {/* Price - Large Text */}
                    <div className="text-2xl font-black tracking-tighter text-black">
                        {price || "FREE"}
                    </div>
                </div>
            </CardContent>

            {/* Solid Black Footer - Match Photo */}
            <Link href={`/services/${id}`} className="block">
                <div className="bg-black py-4 flex items-center justify-center gap-2 group/btn">
                    <span className="text-white text-sm font-black uppercase tracking-widest transition-all group-hover:tracking-[0.2em]">
                        View Details →
                    </span>
                </div>
            </Link>
        </article>
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
