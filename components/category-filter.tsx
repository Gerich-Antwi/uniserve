
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
    categories: string[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentCategory = searchParams.get("category")

    const handleSelect = (category: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (category) {
            params.set("category", category)
        } else {
            params.delete("category")
        }
        router.push(`/services?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
            <Button
                variant={currentCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => handleSelect(null)}
                className={cn(
                    "transition-all font-black uppercase",
                    currentCategory === null
                        ? "bg-black text-white"
                        : ""
                )}
            >
                All
            </Button>
            {categories.map((category) => (
                <Button
                    key={category}
                    variant={currentCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSelect(category)}
                    className={cn(
                        "transition-all whitespace-nowrap font-black uppercase",
                        currentCategory === category
                            ? "bg-black text-white"
                            : ""
                    )}
                >
                    {category}
                </Button>
            ))}
        </div>
    )
}
