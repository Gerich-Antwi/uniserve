import { MessageSquare } from "lucide-react"

export default function ChatPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-6 md:px-10 md:py-10">
      <div className="w-full max-w-md border-4 border-black bg-white p-8 rounded-2xl shadow-[8px_8px_0_0_#000] text-center flex flex-col items-center">
        <MessageSquare className="w-16 h-16 mb-4 text-lime-600" />
        <h1 className="text-3xl font-black mb-4 uppercase tracking-tighter">Chat <span className="text-lime-500">System</span></h1>
        <div className="bg-lime-50 border-2 border-black p-4 rounded-xl shadow-[4px_4px_0_0_#000]">
          <p className="font-bold text-sm">
            Messaging will be integrated via API shortly. Stay tuned!
          </p>
        </div>
      </div>
    </main>
  )
}
