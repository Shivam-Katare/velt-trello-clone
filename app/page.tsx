"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { VeltAuth } from "@/components/velt-auth"
import { DynamicVeltComments, DynamicVeltCommentsSidebar } from "@/components/velt-comments-dynamic"
import { getOrCreateUser, switchUser } from "@/lib/user-manager"
import { ProjectsGrid } from "@/components/projects-grid"

export default function Home() {
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Initialize user on client side only
  useEffect(() => {
    const user = getOrCreateUser()
    setCurrentUser(user)
  }, [])

  const handleUserSwitch = async () => {
    const newUser = switchUser()
    if (newUser) {
      setCurrentUser(newUser)
      
      // Small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 50))
      
      // Trigger Velt user switch event
      window.dispatchEvent(new CustomEvent('velt-user-switch'))
    }
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <VeltAuth />
        <Navbar
          currentUser={currentUser}
          onUserSwitch={handleUserSwitch}
          boardTitle="Projects"
        />
        <main className="p-3 sm:p-6">
          <ProjectsGrid />
        </main>

        {/* Velt Comments Components */}
        <DynamicVeltComments popoverMode={true} />
        <DynamicVeltCommentsSidebar />
      </div>
    </ThemeProvider>
  )
}
