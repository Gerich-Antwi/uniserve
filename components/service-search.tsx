
"use client"

import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { Input } from "@/components/ui/input"

export function ServiceSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const searchParamsString = searchParams.toString()
    const [text, setText] = useState(searchParams.get("q") || "")
    const [query] = useDebounce(text, 300)

    useEffect(() => {
        const params = new URLSearchParams(searchParamsString)
        if (query) {
            params.set("q", query)
        } else {
            params.delete("q")
        }
        router.push(`/services?${params.toString()}`)
    }, [query, router, searchParamsString])

    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-black" />
            <Input
                type="search"
                placeholder="Search services..."
                className="pl-9 w-full"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </div>
    )
}
