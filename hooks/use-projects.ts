"use client";

import { useState, useEffect, useCallback } from "react";

export type Project = {
  id: string;
  title: string;
  description: string;
  members: string[]; // user IDs
  settings: { [key: string]: any }; // e.g., theme, visibility
  createdAt: string;
  updatedAt: string;
};

const PROJECTS_STORAGE_KEY = "trello-projects";

const initialProjects: Project[] = [
  {
    id: "project-1",
    title: "Sample Project 1",
    description: "A sample project to demonstrate multi-project functionality.",
    members: ["user_alice_johnson", "user_bob_smith"],
    settings: { theme: "default", visibility: "private" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "project-2",
    title: "Sample Project 2",
    description: "Another sample project.",
    members: ["user_alice_johnson"],
    settings: { theme: "dark", visibility: "public" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load projects from localStorage
  useEffect(() => {
    const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (storedProjects) {
      try {
        const parsed = JSON.parse(storedProjects);
        setProjects(parsed);
        // Set first project as current if none selected
        if (parsed.length > 0 && !currentProjectId) {
          setCurrentProjectId(parsed[0].id);
        }
      } catch (error) {
        console.error("Error parsing projects from localStorage:", error);
        setProjects(initialProjects);
        setCurrentProjectId(initialProjects[0]?.id || null);
      }
    } else {
      setProjects(initialProjects);
      setCurrentProjectId(initialProjects[0]?.id || null);
    }
    setIsInitialized(true);
  }, [currentProjectId]);

  // Save projects to localStorage
  const saveProjects = useCallback((newProjects: Project[]) => {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(newProjects));
    setProjects(newProjects);
  }, []);

  // Create a new project
  const createProject = useCallback(
    (title: string, description: string, members: string[] = []) => {
      const newProject: Project = {
        id: `project-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 11)}`,
        title,
        description,
        members,
        settings: { theme: "default", visibility: "private" },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedProjects = [...projects, newProject];
      saveProjects(updatedProjects);
      setCurrentProjectId(newProject.id);
      return newProject;
    },
    [projects, saveProjects]
  );

  // Update a project
  const updateProject = useCallback(
    (id: string, updates: Partial<Project>) => {
      const updatedProjects = projects.map((project) =>
        project.id === id
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project
      );
      saveProjects(updatedProjects);
    },
    [projects, saveProjects]
  );

  // Delete a project
  const deleteProject = useCallback(
    (id: string) => {
      const updatedProjects = projects.filter((project) => project.id !== id);
      saveProjects(updatedProjects);
      if (currentProjectId === id) {
        setCurrentProjectId(updatedProjects[0]?.id || null);
      }
    },
    [projects, saveProjects, currentProjectId]
  );

  // Set current project
  const setCurrentProject = useCallback((id: string) => {
    setCurrentProjectId(id);
  }, []);

  const currentProject =
    projects.find((p) => p.id === currentProjectId) || null;

  return {
    projects,
    currentProject,
    currentProjectId,
    isInitialized,
    createProject,
    updateProject,
    deleteProject,
    setCurrentProject,
  };
}
