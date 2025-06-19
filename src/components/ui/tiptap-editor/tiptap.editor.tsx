import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from 'components/ui/tiptap-editor/menubar';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';

interface TiptapEditorProps {
    content?: string;
    onChange?: (content: string) => void;
}

const TiptapEditor = ({ content = '', onChange }: TiptapEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph', 'bulletList', 'orderedList'],
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 hover:underline',
                },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse table-auto w-full',
                },
            }),
            TableRow,
            TableHeader,
            TableCell,
            Highlight.configure({
                multicolor: true,
                HTMLAttributes: {
                    class: 'bg-yellow-200',
                },
            }),
            Image.configure({
                allowBase64: true,
                HTMLAttributes: {
                    class: 'w-full h-auto',
                },
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'p-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange?.(JSON.stringify(editor.getJSON()));
        },
    });

    return (
        <>
            {editor && <MenuBar editor={editor} />}
            <EditorContent editor={editor} />
        </>
    );
};

export default TiptapEditor;
