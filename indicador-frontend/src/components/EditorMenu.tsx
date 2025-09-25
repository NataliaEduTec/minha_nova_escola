import React, { useRef } from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  RotateCcw,
  RotateCw,
  Image,
  CheckSquare,
  Scissors,
  Upload
} from 'lucide-react';

interface EditorMenuProps {
  editor: Editor | null;
  isAlternative?: boolean;
}

const EditorMenu: React.FC<EditorMenuProps> = ({ editor, isAlternative = true }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Insira a URL da imagem:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          editor.chain().focus().setImage({ src: result }).run();
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset the input
    event.target.value = '';
  };

  const splitByHeadings = () => {
    const content = editor.getHTML();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    const questions: string[] = [];
    let currentQuestion = '';
    let foundFirstHeading = false;
    
    tempDiv.childNodes.forEach((node) => {
      const element = node as Element;
      if (element.tagName?.match(/^H[1-4]$/)) {
        if (foundFirstHeading && currentQuestion) {
          questions.push(currentQuestion);
        }
        foundFirstHeading = true;
        currentQuestion = element.outerHTML;
      } else if (foundFirstHeading) {
        currentQuestion += element.outerHTML;
      }
    });
    
    if (currentQuestion) {
      questions.push(currentQuestion);
    }

    return questions;
  };

  const menuItems = [
    {
      icon: <Bold size={18} />,
      title: 'Negrito',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      icon: <Italic size={18} />,
      title: 'Itálico',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      icon: <Underline size={18} />,
      title: 'Sublinhado',
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
    },
    {
      icon: <Heading1 size={18} />,
      title: 'Título 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
    },
    {
      icon: <Heading2 size={18} />,
      title: 'Título 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    {
      icon: <Heading3 size={18} />,
      title: 'Título 3',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
    },
    {
      icon: <List size={18} />,
      title: 'Lista numerada',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      icon: <CheckSquare size={18} />,
      title: 'Lista de tarefas',
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: editor.isActive('taskList'),
    },
    {
      icon: <Image size={18} />,
      title: 'Adicionar imagem a partir de uma URL',
      action: addImage,
      isActive: false,
    },
    {
      icon: <Upload size={18} />,
      title: 'Upload de Imagem',
      action: () => fileInputRef.current?.click(),
      isActive: false,
    },
  ...(!isAlternative ? [{
      icon: <Scissors size={18}/>,
      title: 'Separar questões por cabeçalhos',
      action: () => {
          const questions = splitByHeadings();
          if (questions.length > 1) {
              const event = new CustomEvent('splitQuestions', {detail: questions});
              window.dispatchEvent(event);
          } else {
              alert('Não há cabeçalhos suficientes para separar as questões.');
          }
      },
      isActive: false,
  }] : []),

    {
      icon: <RotateCcw size={18} />,
      title: 'Desfazer',
      action: () => editor.chain().focus().undo().run(),
      isDisabled: !editor.can().undo(),
    },
    {
      icon: <RotateCw size={18} />,
      title: 'Refazer',
      action: () => editor.chain().focus().redo().run(),
      isDisabled: !editor.can().redo(),
    },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-2 mb-2 bg-white border border-gray-200 rounded-md shadow-sm sticky top-0 z-[50]">
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={item.action}
          className={`p-2 rounded hover:bg-gray-100 transition ${
            item.isActive ? 'bg-blue-100 text-blue-800' : ''
          } ${item.isDisabled ? 'opacity-30 cursor-not-allowed' : ''}`}
          title={item.title}
          disabled={item.isDisabled}
        >
          {item.icon}
        </button>
      ))}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default EditorMenu;