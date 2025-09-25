import React from 'react';
import { Folder, File } from 'lucide-react';

interface FileSystemItem {
    name: string;
    type: 'file' | 'folder';
    children?: FileSystemItem[];
}

const demoData: FileSystemItem[] = [
    {
        name: 'Área de Trabalho',
        type: 'folder',
        children: [
            {
                name: 'Projetos',
                type: 'folder',
                children: [
                    { name: 'projeto1.txt', type: 'file' },
                    { name: 'projeto2.docx', type: 'file' },
                    {
                        name: 'Nova pasta',
                        type: 'folder',
                        children: [
                            { name: 'projeto1.txt', type: 'file' },
                            { name: 'projeto2.docx', type: 'file' },
                        ],
                    },
                ],
            },
            { name: 'notas.txt', type: 'file' },
        ],
    },
    {
        name: 'Documentos',
        type: 'folder',
        children: [
            { name: 'importante.pdf', type: 'file' },
            {
                name: 'Pessoal',
                type: 'folder',
                children: [
                    { name: 'foto.jpg', type: 'file' },
                    { name: 'contrato.pdf', type: 'file' },
                ],
            },
        ],
    },
    {
        name: 'Downloads',
        type: 'folder',
        children: [
            { name: 'música.mp3', type: 'file' },
            { name: 'video.mp4', type: 'file' },
        ],
    },
];

const FileSystemItem: React.FC<{ item: FileSystemItem; depth?: number }> = ({item, depth = 0}) => {
    const isFolder = item.type === 'folder';
    const Icon = isFolder ? Folder : File;
    const paddingLeft = `${depth * 1}rem`;

    if (!isFolder) {
        return (
            <div
                className="flex items-center gap-2 px-4 py-2 hover:bg-base-200 cursor-pointer"
                style={{ paddingLeft: `calc(${paddingLeft} + 1rem)` }}
            >
                <Icon size={18} className="text-primary" />
                <span className="text-sm">{item.name}</span>
            </div>
        );
    }

    return (
        <div className="collapse collapse-arrow bg-base-100 rounded-none pl-2">
            <input type="checkbox" className="peer" />
            <div
                className="collapse-title flex items-center gap-2 pr-4 min-h-12 py-2"
                style={{ paddingLeft }}
            >
                <Icon size={18} className="text-primary" />
                <span className="text-sm font-medium">{item.name}</span>
            </div>
            <div className="collapse-content p-0">
                {item.children?.map((child, index) => (
                    <FileSystemItem key={index} item={child} depth={depth + 1} />
                ))}
            </div>
        </div>
    );
};

function FileSystem() {
    return (
        <div className="h-full bg-base-200 flex items-center justify-center">
            <div className="h-full bg-base-100 shadow-xl w-full overflow-hidden">
                <div className="bg-primary text-white p-4">
                    <h1 className="text-lg font-bold">Gerenciador de Arquivos</h1>
                </div>
                <div className="divide-y divide-base-200">
                    {demoData.map((item, index) => (
                        <FileSystemItem key={index} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FileSystem;