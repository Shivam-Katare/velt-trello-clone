"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, Settings, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProjectSettings } from "@/components/project-settings";

export function ProjectSwitcher() {
  const router = useRouter();
  const { projects, currentProject, setCurrentProject, createProject } =
    useProjects();
  const [isOpen, setIsOpen] = useState(false);

  const handleProjectSelect = (projectId: string) => {
    setCurrentProject(projectId);
    router.push(`/project/${projectId}`);
    setIsOpen(false);
  };

  const handleCreateProject = () => {
    const title = prompt("Enter project title:");
    if (title) {
      const newProject = createProject(title, "New project description");
      router.push(`/project/${newProject.id}`);
    }
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          {currentProject?.title || "Select Project"}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Projects</SheetTitle>
            <ProjectSettings />
          </div>
        </SheetHeader>
        <div className="mt-4 space-y-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer"
              onClick={() => handleProjectSelect(project.id)}
            >
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{project.title.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{project.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {project.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {project.members.length}
                </span>
              </div>
            </div>
          ))}
          <Button onClick={handleCreateProject} className="w-full mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
