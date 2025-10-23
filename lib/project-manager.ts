export type Project = {
  id: string
  name: string
  description: string
  color: string
  createdAt: string
  updatedAt: string
}

const PROJECTS_STORAGE_KEY = 'trello-projects'

const PROJECT_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#ec4899', // pink
  '#6b7280', // gray
]

export const getProjects = (): Project[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const saveProjects = (projects: Project[]): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects))
  } catch (error) {
    console.error('Failed to save projects:', error)
  }
}

export const createProject = (name: string, description: string, color?: string): Project => {
  const now = new Date().toISOString()
  const project: Project = {
    id: `project-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    name,
    description,
    color: color || PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)],
    createdAt: now,
    updatedAt: now,
  }
  
  const projects = getProjects()
  projects.push(project)
  saveProjects(projects)
  
  return project
}

export const updateProject = (id: string, updates: Partial<Pick<Project, 'name' | 'description' | 'color'>>): Project | null => {
  const projects = getProjects()
  const index = projects.findIndex(p => p.id === id)
  
  if (index === -1) return null
  
  const updatedProject = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  
  projects[index] = updatedProject
  saveProjects(projects)
  
  return updatedProject
}

export const deleteProject = (id: string): boolean => {
  const projects = getProjects()
  const filtered = projects.filter(p => p.id !== id)
  
  if (filtered.length === projects.length) return false
  
  saveProjects(filtered)
  return true
}

export const getProjectById = (id: string): Project | null => {
  const projects = getProjects()
  return projects.find(p => p.id === id) || null
}

export const getAvailableColors = () => PROJECT_COLORS
