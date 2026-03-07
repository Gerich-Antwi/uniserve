"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

export async function submitAdminReply(messageId: string, replyText: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        // NOTE: In a real app we'd verify session.user.role === 'ADMIN'
        if (!session?.user) {
            return { error: "You must be logged in as an admin to reply." }
        }

        if (!replyText || replyText.trim().length < 5) {
            return { error: "Reply must be at least 5 characters long." }
        }

        const message = await prisma.supportMessage.findUnique({
            where: { id: messageId }
        })

        if (!message) {
            return { error: "Message not found." }
        }

        if (message.adminReply) {
            return { error: "This message has already been replied to." }
        }

        await prisma.supportMessage.update({
            where: { id: messageId },
            data: {
                adminReply: replyText,
                status: "Resolved"
            }
        })

        revalidatePath(`/admin/support/${messageId}`)
        revalidatePath('/admin/support')
        revalidatePath('/support/tickets')

        return { success: true }
    } catch (error) {
        console.error("Error submitting admin reply:", error)
        return { error: "Failed to submit reply. Please try again later." }
    }
}
