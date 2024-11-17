import React, { useState } from 'react';
import { FolderKanban, ListTodo, StickyNote, Plus, LogOut, UserCog, LayoutDashboard } from 'lucide-react';
import { Project, User } from '../types';
import { ProjectTree } from './ProjectTree';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

interface SidebarProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string) => void;
  onNewProject: () => void;
  onLogout: () => void;
  user: User;
  onAdminPanel: () => void;
  onDashboard: () => void;
}

export function Sidebar({
  projects,
  selectedProjectId,
  onSelectProject,
  onNewProject,
  onLogout,
  user,
  onAdminPanel,
  onDashboard,
}: SidebarProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const activeProject = projects.find(p => p.id === active.id);
    const overProject = projects.find(p => p.id === over.id);
    
    if (!activeProject || !overProject) return;

    // Get the current order of projects at the same level
    const currentLevelProjects = projects.filter(p => p.parentId === activeProject.parentId);
    const activeIndex = currentLevelProjects.findIndex(p => p.id === active.id);
    const overIndex = currentLevelProjects.findIndex(p => p.id === over.id);

    // Calculate drop target position relative to the over item
    const overRect = (over.data.current?.rect as DOMRect) || null;
    const overCenter = overRect ? overRect.top + overRect.height / 2 : 0;
    const mouseY = event.activatorEvent?.clientY || 0;

    let updatedProjects = [...projects];

    // If dropping near the center of the target, make it a subproject
    if (Math.abs(mouseY - overCenter) < 10) {
      updatedProjects = projects.map(project => {
        if (project.id === activeProject.id) {
          return {
            ...project,
            parentId: overProject.id,
            updatedAt: new Date().toISOString(),
          };
        }
        return project;
      });

      // Expand the parent project
      setExpandedProjects(prev => new Set([...prev, overProject.id]));
    } else {
      // Otherwise, reorder at the same level
      const reorderedProjects = arrayMove(currentLevelProjects, activeIndex, overIndex);
      
      // Update the order in the main projects array
      updatedProjects = projects.map(project => {
        if (project.parentId === activeProject.parentId) {
          const reorderedProject = reorderedProjects.find(p => p.id === project.id);
          return reorderedProject || project;
        }
        return project;
      });
    }

    // Update storage and trigger re-render
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    window.dispatchEvent(new CustomEvent('projectsUpdated', { detail: updatedProjects }));
  };

  const toggleExpand = (projectId: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  };

  // Get root level projects (no parentId)
  const rootProjects = projects.filter(p => !p.parentId);

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <div className="p-4 flex items-center space-x-2 border-b border-gray-700">
        <FolderKanban className="w-6 h-6" />
        <h1 className="text-xl font-bold">ProjectHub</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          <button
            onClick={onDashboard}
            className="w-full flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={onNewProject}
            className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={projects.map(p => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <nav className="space-y-1 px-2">
              {rootProjects.map((project) => (
                <ProjectTree
                  key={project.id}
                  project={project}
                  projects={projects}
                  level={0}
                  selectedProjectId={selectedProjectId}
                  onSelectProject={onSelectProject}
                  isExpanded={expandedProjects.has(project.id)}
                  onToggleExpand={toggleExpand}
                />
              ))}
            </nav>
          </SortableContext>
        </DndContext>
      </div>

      <div className="p-4 border-t border-gray-700 space-y-2">
        {user.isAdmin && (
          <button
            onClick={onAdminPanel}
            className="w-full flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
            <UserCog className="w-4 h-4" />
            <span>Admin Panel</span>
          </button>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}