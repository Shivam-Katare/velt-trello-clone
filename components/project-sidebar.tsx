"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Plus, Home, Folder, ChevronRight, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { getProjects, type Project } from "@/lib/project-manager"

interface ProjectSidebarProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ProjectSidebar({ isOpen, onOpenChange }: ProjectSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    setProjects(getProjects())
  }, [])

  const handleCreateProject = (project: Project) => {
    setProjects([...projects, project])
    setShowCreateDialog(false)
    router.push(`/project/${project.id}/board`)
  }

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isProjectRoute = pathname.startsWith('/project/')
  const currentProjectId = isProjectRoute ? pathname.split('/')[2] : null

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <Folder className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold">Projects</h2>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchQuery("")}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2 space-y-1">
            {/* Home */}
            <Button
              variant={pathname === '/' ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => router.push('/')}
            >
              <Home className="w-4 h-4" />
              All Projects
            </Button>

            {/* Projects */}
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <Button
                  key={project.id}
                  variant={currentProjectId === project.id ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                  onClick={() => router.push(`/project/${project.id}/board`)}
                >
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="truncate">{project.name}</span>
                  {currentProjectId === project.id && (
                    <ChevronRight className="w-3 h-3 ml-auto" />
                  )}
                </Button>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {searchQuery ? "No projects found" : "No projects yet"}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Create Project Button */}
      <div className="p-4 border-t">
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="w-full gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>
    </div>
  )

  // Desktop sidebar
  return (
    <>
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16">
        <div className="flex-1 flex flex-col min-h-0 bg-card border-r">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <CreateProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onProjectCreated={handleCreateProject}
      />
    </>
  )
}
