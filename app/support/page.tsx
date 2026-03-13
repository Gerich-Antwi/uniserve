"use client"

import { useState } from "react"
import { submitSupportMessage } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Send, LifeBuoy } from "lucide-react"
import Link from "next/link"

export default function SupportPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)

        const result = await submitSupportMessage(formData)

        if (result.error) {
            toast.error(result.error)
            setIsSubmitting(false)
        } else {
            toast.success("Message sent successfully")
            setIsSuccess(true)
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container py-8 max-w-7xl mx-auto px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-4rem)]">
            <div className="w-full max-w-2xl">
                <div className="mb-8 flex flex-col gap-2">
                    <h1 className="inline-block text-4xl sm:text-5xl font-black tracking-tight">
                        <span className="bg-yellow-300 border-4 border-black px-4 py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block -rotate-1">
                            SUPPORT
                        </span>
                    </h1>
                    <p className="text-lg font-bold mt-4">
                        Having issues? Send a message to our admin team and we&apos;ll help you out.
                    </p>
                    <div className="mt-4 flex gap-4">
                        <Link href="/support/tickets">
                            <Button className="font-bold border-2 border-black bg-cyan-200 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all">
                                View My Tickets
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
                    <CardHeader className="bg-cyan-50 border-b-4 border-black">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 border-2 border-black">
                                <LifeBuoy className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black uppercase">Submit a Request</CardTitle>
                                <CardDescription className="font-bold text-black">
                                    Fill out the form below to contact support.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {isSuccess ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center bg-green-50 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <div className="bg-green-400 p-4 border-4 border-black rounded-full mb-4">
                                    <Send className="w-8 h-8 text-black" />
                                </div>
                                <h3 className="text-2xl font-black mb-2">Message Sent!</h3>
                                <p className="font-bold text-muted-foreground mb-6 max-w-md">
                                    Your support request has been received. Our team will review it and get back to you shortly.
                                </p>
                                <Button 
                                    onClick={() => setIsSuccess(false)}
                                    className="font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all"
                                >
                                    Send Another Message
                                </Button>
                            </div>
                        ) : (
                            <form action={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="subject" className="font-bold text-base">Subject</Label>
                                    <Input 
                                        id="subject" 
                                        name="subject" 
                                        placeholder="Briefly describe your issue..." 
                                        required
                                        className="border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-medium h-12"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="message" className="font-bold text-base">Message Details</Label>
                                    <Textarea 
                                        id="message" 
                                        name="message" 
                                        placeholder="Please provide as much detail as possible so we can best assist you..." 
                                        required
                                        className="border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-medium min-h-[200px] resize-y"
                                    />
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full h-12 text-lg font-black uppercase tracking-wider bg-pink-400 hover:bg-pink-500 text-black border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all"
                                >
                                    {isSubmitting ? "Sending..." : "Submit Request"}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
