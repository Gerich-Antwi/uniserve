import Link from "next/link"
import { Card, CardTitle } from "@/components/ui/card"
import { CheckCircle2, MapPin, Star } from "lucide-react"

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
    index?: number
}

// Pastel background colors for the content section, mapped by category
const categoryColors: Record<string, string> = {
    "Laundry": "bg-[#e0f7fa]",
    "Grooming": "bg-[#ffe0b2]",
    "Tech Support": "bg-[#e1bee7]",
    "Food Delivery Services": "bg-[#dcedc8]",
    "Cleaning Services": "bg-[#e1bee7]",
    "Coffee Run": "bg-[#ffe0b2]",
    "Tutoring": "bg-[#fff9c4]",
    "default": "bg-[#dcedc8]",
}

const getCategoryLabel = (category: string) => {
    if (category.toLowerCase().includes("food") || category.toLowerCase().includes("coffee")) return "FOOD"
    if (category.toLowerCase().includes("cleaning") || category.toLowerCase().includes("laundry")) return "CLEANING"
    return category.toUpperCase()
}

export function ServiceCard({ id, title, description, category, status, price, provider, index = 0 }: ServiceCardProps) {
    const bgColor = categoryColors[category] || categoryColors["default"]
    const isAcademics = category.trim().toLowerCase().includes("academic")
    const effectiveImageSrc = provider.image || (isAcademics ? "/images/academics.png" : null)

    // Alternating rotation — even indices go clockwise, odd go anti-clockwise
    // Clockwise tilt is intentionally subtle.
    const rotationClass = index % 2 === 0
        ? "hover:rotate-[5deg]"
        : "hover:-rotate-[10deg]"

    // Dummy rating — replace with real data when available
    const rating = (4 + (index % 10) * 0.1).toFixed(1)
    const reviewCount = 100 + (index * 57) % 500

    return (
        <Link href={`/services/${id}`} className={`block h-full transition-all duration-300 ${rotationClass}`}>
            {/* The `group` class here enables group-hover on all children. p-0 removes shadcn's default py-6 padding. gap-0 removes the default gap-6. */}
            <Card className="group relative h-full p-0 gap-0 overflow-hidden flex flex-col border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none bg-white">

                {/* ── FRONT FACE (visible by default) ── */}
                <div className="flex flex-col h-full opacity-100 group-hover:opacity-0 transition-opacity duration-300">

                    {/* IMAGE AREA – fill the whole 16/9 box */}
                    <div className="relative aspect-[16/9] w-full border-b-4 border-black overflow-hidden flex-shrink-0 bg-gray-100">
                        {effectiveImageSrc ? (
                            <div className="relative w-full h-full overflow-hidden bg-black/5">
                                {/* Blurred Background to 'occupy' space without white or gray bars */}
                                <img
                                    src={effectiveImageSrc}
                                    alt=""
                                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-60 scale-110 pointer-events-none"
                                />
                                {/* Main Image 'fully rendered' without cropping */}
                                <img
                                    src={effectiveImageSrc}
                                    alt={title}
                                    className="relative z-10 w-full h-full object-contain"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full overflow-hidden bg-purple-50 flex items-center justify-center text-5xl text-gray-300">
                                📸
                            </div>
                        )}

                        {/* VERIFIED BADGE */}
                        <div className="absolute z-20 top-3 right-3 bg-[#69ffb4] border-2 border-black px-2 py-0.5 flex items-center gap-1.5 rotate-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="font-black text-xs tracking-widest">VERIFIED</span>
                        </div>
                    </div>

                    {/* CARD BODY */}
                    <div className={`p-3 flex-grow flex flex-col justify-between ${bgColor}`}>
                        <div>
                            <div className="font-black text-gray-600 text-xs tracking-widest mb-1 uppercase">
                                {getCategoryLabel(category)}
                            </div>
                            <CardTitle className="text-base font-black leading-tight line-clamp-2 mb-2">
                                {title}
                            </CardTitle>
                        </div>

                        <div className="flex justify-between items-center">
                            {/* Rating */}
                            <div className="bg-[#ffeb3b] border-2 border-black px-2 py-0.5 flex items-center gap-1 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <Star className="w-3 h-3 fill-black" />
                                <span className="text-xs">{rating}</span>
                                <span className="text-[10px] text-gray-700">({reviewCount})</span>
                            </div>

                            {/* Price */}
                            {price && (
                                <span className="font-black text-base">{price}</span>
                            )}
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="bg-black text-white py-2 flex justify-center items-center">
                        <span className="font-black text-xs tracking-widest">VIEW DETAILS →</span>
                    </div>
                </div>

                {/* ── BACK FACE (revealed on hover) – black background with details ── */}
                <div className="absolute inset-0 bg-black text-white p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between pointer-events-none">
                    {/* Title */}
                    <div>
                        <div className="font-black text-xs tracking-widest text-[#69ffb4] uppercase mb-1">
                            {getCategoryLabel(category)}
                        </div>
                        <CardTitle className="text-xl text-white font-black leading-tight line-clamp-2 mb-3">
                            {title}
                        </CardTitle>

                        {/* Description */}
                        <p className="text-gray-300 text-xs leading-relaxed line-clamp-5">
                            {description}
                        </p>
                    </div>

                    {/* Provider & Price */}
                    <div className="border-t-2 border-white pt-3 flex flex-col gap-2">
                        <div className="flex justify-between items-center gap-2">
                            <span className="font-black text-[#ffeb3b] text-sm truncate">{provider.name}</span>
                            {price && (
                                <span className="bg-[#ffeb3b] text-black border-2 border-white px-2 py-0.5 text-xs font-black flex-shrink-0">
                                    {price}
                                </span>
                            )}
                        </div>

                        {provider.location && (
                            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">{provider.location}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 fill-[#ffeb3b] text-[#ffeb3b]" />
                            <span className="text-xs font-bold text-gray-300">{rating} ({reviewCount} reviews)</span>
                        </div>
                    </div>
                </div>

            </Card>
        </Link>
    )
}
