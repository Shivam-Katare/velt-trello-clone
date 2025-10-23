"use client";

import { useState } from "react";
import { useProjects } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";

export function ProjectSettings() {
  const { currentProject, updateProject } = useProjects();
  const [title, setTitle] = useState(currentProject?.title || "");
  const [description, setDescription] = useState(
    currentProject?.description || ""
  );
  const [members, setMembers] = useState(currentProject?.members || []);
  const [newMember, setNewMember] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    if (currentProject) {
      updateProject(currentProject.id, { title, description, members });
      setIsOpen(false);
    }
  };

  const addMember = () => {
    if (newMember && !members.includes(newMember)) {
      setMembers([...members, newMember]);
      setNewMember("");
    }
  };

  const removeMember = (member: string) => {
    setMembers(members.filter((m) => m !== member));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label>Members</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {members.map((member) => (
                <Badge
                  key={member}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeMember(member)}
                >
                  {member} ×
                </Badge>
              ))}
            </div>
            <div className="flex mt-2">
              <Input
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                placeholder="Add member"
              />
              <Button onClick={addMember} className="ml-2">
                Add
              </Button>
            </div>
          </div>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
