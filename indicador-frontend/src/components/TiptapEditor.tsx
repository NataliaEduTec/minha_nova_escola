import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import History from '@tiptap/extension-history';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import EditorMenu from './EditorMenu';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  isAlternative?: boolean;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ 
  content, 
  onChange, 
  placeholder = 'Type your question here...\n\nAdd alternatives using the task list button (☐) and mark the correct one...',
  className = '',
  isAlternative = false
}) => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Underline,
      History,
      Image.configure({
          inline: false,
          allowBase64: false,
      }),
      Heading.configure({
        levels: [1, 2, 3, 4],
      }),
      BulletList,
      ListItem,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className={`border border-gray-300 rounded-md shadow-sm relative ${className}`}>
      <EditorMenu editor={editor} isAlternative={isAlternative} />
        <div
            className={`cursor-text border-none ${!isAlternative ? 'min-h-[300px]' : ''}`}
            onClick={() => editor?.chain().focus().run()}
        >
            <EditorContent
                editor={editor}
                className={`border-none prose max-w-none editor-content ${isAlternative ? 'alternative-editor_content' : 'p-3 [&_.is-editor-empty]:text-gray-400 [&_.is-editor-empty]:min-h-[280px]'}`}

            />
        </div>
    </div>
  );
};

export default TiptapEditor;