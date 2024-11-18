import React from 'react';
import { Project } from '../types';
import { FolderKanban, ChevronRight, ChevronDown, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ProjectTreeProps {
  project: Project;
  projects: Project[];
  level: number;
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
}

export function ProjectTree({
  project,
  projects,
  level,
  selectedProjectId,
  onSelectProject,
  isExpanded,
  onToggleExpand,
}: ProjectTreeProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: project.id,
    data: {
      type: 'project',
      project,
      level,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const subprojects = projects.filter(p => p.parentId === project.id);
  const hasSubprojects = subprojects.length > 0;

  return (
    <div ref={setNodeRef} style={style} className="relative" data-project-id={project.id}>
      <div
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
          selectedProjectId === project.id
            ? 'bg-gray-800 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
        style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
      >
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:text-gray-400"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        {hasSubprojects && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(project.id);
            }}
            className="p-1 hover:bg-gray-700 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
        <FolderKanban className="w-4 h-4" />
        <button
          onClick={() => onSelectProject(project.id)}
          className="flex-1 text-left truncate"
        >
          {project.name}
        </button>
      </div>

      {/* Nesting indicator */}
      <div 
        className="absolute inset-0 border-2 border-blue-500 rounded-lg opacity-0 pointer-events-none transition-opacity duration-200"
        data-nesting-indicator
      />

      {isExpanded && hasSubprojects && (
        <div className="ml-4">
          {subprojects.map((subproject) => (
            <ProjectTree
              key={subproject.id}
              project={subproject}
              projects={projects}
              level={level + 1}
              selectedProjectId={selectedProjectId}
              onSelectProject={onSelectProject}
              isExpanded={expandedProjects.has(subproject.id)}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}