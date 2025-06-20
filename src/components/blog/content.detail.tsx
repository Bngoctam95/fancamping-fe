import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';

const ContentDetail = ({ content }: { content: string }) => {
    const editor = useEditor({
        editable: false,
        extensions: [
            StarterKit,
            TextStyle,
            Color,
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
        content: content,
    });

    if (!editor) return null;
    return <EditorContent editor={editor} className="font-montserrat" />;
};

export default ContentDetail;
