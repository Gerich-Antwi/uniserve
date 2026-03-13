"use client"

import { useState } from "react"
import { Settings2, UserCircle2, Moon, Sun, Monitor, LogOut, Key, Save } from "lucide-react"
import { useTheme } from "next-themes"
import { signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/auth/sign-in")
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error("Failed to log out")
    }
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    // In a real implementation we would call authClient.changePassword here
    toast.success("Password change requested (Mock)")
    setIsChangingPassword(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <main className="px-4 py-6 md:px-10 md:py-10 min-h-screen bg-transparent">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="flex items-center gap-3">
          <div className="p-2 border-4 border-black bg-lime-300 shadow-[4px_4px_0_0_#000]">
            <Settings2 className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase whitespace-nowrap">Settings</h1>
        </header>

        {/* Profile Section */}
        <section className="rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#000] space-y-6">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <UserCircle2 className="w-5 h-5" /> Profile Info
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-6 border-b-4 border-black/5 pb-6">
            <div className="h-24 w-24 rounded-full border-4 border-black bg-lime-200 flex items-center justify-center overflow-hidden shrink-0 shadow-[4px_4px_0_0_#000]">
              <UserCircle2 className="h-16 w-16 text-black/50" />
            </div>
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-black">John Service Provider</h3>
              <p className="font-bold text-black/60">john.provider@example.com</p>
              <div className="inline-flex rounded-full border-2 border-black bg-black px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-lime-300">
                Service Provider
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest">Phone Number</Label>
              <Input readOnly value="+1 (555) 123-4567" className="border-2 border-black font-bold bg-gray-50 focus-visible:ring-lime-300" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest">Location</Label>
              <Input readOnly value="Campus Center, Room 402" className="border-2 border-black font-bold bg-gray-50 focus-visible:ring-lime-300" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest">Bio</Label>
            <div className="font-bold p-3 border-2 border-black rounded-lg bg-gray-50 min-h-[80px] text-sm leading-relaxed">
              Hi! I'm an experienced provider offering top-tier campus services to students. Let me know how I can help!
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button className="font-black border-2 border-black bg-lime-300 text-black hover:bg-lime-400 shadow-[4px_4px_0_0_#000] uppercase tracking-widest">
              Edit Profile
            </Button>
          </div>
        </section>

        {/* Security & Theme Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Appearance Section */}
          <section className="rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#000] flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <Sun className="w-5 h-5" /> Appearance
              </h2>
              <p className="text-sm font-bold text-black/60">Adjust the brightness and theme of your dashboard.</p>
              
              <div className="grid grid-cols-3 gap-2 p-1 border-2 border-black bg-gray-100 rounded-xl">
                <button 
                  onClick={() => setTheme("light")}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${theme === "light" ? "bg-white border-black shadow-[2px_2px_0_0_#000]" : "border-transparent opacity-50 hover:opacity-100"}`}
                >
                  <Sun className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase">Light</span>
                </button>
                <button 
                  onClick={() => setTheme("dark")}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${theme === "dark" ? "bg-black text-white border-black shadow-[2px_2px_0_0_#bef264]" : "border-transparent opacity-50 hover:opacity-100"}`}
                >
                  <Moon className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase">Dark</span>
                </button>
                <button 
                  onClick={() => setTheme("system")}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${theme === "system" ? "bg-lime-100 border-black shadow-[2px_2px_0_0_#000]" : "border-transparent opacity-50 hover:opacity-100"}`}
                >
                  <Monitor className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase">Auto</span>
                </button>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#000] flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <Key className="w-5 h-5" /> Security
              </h2>
              
              {!isChangingPassword ? (
                <div className="space-y-4 pt-2">
                  <p className="text-sm font-bold text-black/60">Manage your password and account protection.</p>
                  <Button 
                    onClick={() => setIsChangingPassword(true)}
                    variant="outline" 
                    className="w-full border-2 border-black font-black uppercase tracking-widest hover:bg-amber-100 shadow-[4px_4px_0_0_#000]"
                  >
                    Change Password
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black/60">Current Password</Label>
                    <Input 
                      type="password" 
                      required 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="h-8 border-2 border-black font-bold focus-visible:ring-lime-300" 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black/60">New Password</Label>
                    <Input 
                      type="password" 
                      required 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-8 border-2 border-black font-bold focus-visible:ring-lime-300" 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black/60">Confirm New Password</Label>
                    <Input 
                      type="password" 
                      required 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-8 border-2 border-black font-bold focus-visible:ring-lime-300" 
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" className="flex-1 bg-black text-white hover:bg-black/90 border-2 border-black shadow-[2px_2px_0_0_#bef264] font-bold text-xs">
                      Update
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setIsChangingPassword(false)}
                      variant="outline" 
                      className="flex-1 border-2 border-black font-bold text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>

        {/* Danger Zone */}
        <section className="rounded-2xl border-4 border-black bg-red-50 p-6 shadow-[8px_8px_0_0_#000] border-red-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-red-600">Session</h2>
              <p className="text-sm font-bold text-red-600/70 mt-1">Exit the provider portal securely.</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="destructive" 
              className="px-8 font-black border-2 border-black shadow-[4px_4px_0_0_#000] uppercase tracking-widest"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </section>
      </div>
    </main>
  )
}
