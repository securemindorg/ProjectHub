import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bold, Italic, List, ListOrdered, Link } from 'lucide-react';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  preview?: boolean;
}

export function MarkdownEditor({ content, onChange, preview = false }: MarkdownEditorProps) {
  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent = 
      content.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      content.substring(end);

    onChange(newContent);
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        end + prefix.length
      );
    }, 0);
  };

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="flex items-center space-x-2 p-2 border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button
          onClick={() => insertMarkdown('**', '**')}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertMarkdown('*', '*')}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertMarkdown('\n- ')}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertMarkdown('\n1. ')}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertMarkdown('[', '](url)')}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Link"
        >
          <Link className="w-4 h-4" />
        </button>
      </div>

      {preview ? (
        <div className="p-4 prose dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 min-h-[200px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none"
          placeholder="Write your content in Markdown..."
        />
      )}
    </div>
  );
}