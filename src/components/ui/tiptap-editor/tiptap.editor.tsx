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
import { useEffect, useState, useRef, useCallback } from 'react';

interface TiptapEditorProps {
    content?: string;
    onChange?: (content: string) => void;
}

const TiptapEditor = ({ content = '', onChange }: TiptapEditorProps) => {
    const [isSticky, setIsSticky] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);
    const menubarRef = useRef<HTMLDivElement>(null);

    const handleScroll = useCallback(() => {
        if (!menubarRef.current) return;

        const menubarRect = menubarRef.current.getBoundingClientRect();
        const isVisible = menubarRect.top >= 0;

        setIsSticky(!isVisible);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        setTimeout(handleScroll, 100);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

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
        <div className="relative" ref={editorRef}>
            {editor && (
                <>
                    {/* Menubar */}
                    <div
                        ref={menubarRef}
                        className={`bg-white border-b border-gray-200 transition-opacity duration-300 ${
                            isSticky ? 'opacity-0 pointer-events-none' : 'opacity-100'
                        }`}
                    >
                        <MenuBar editor={editor} isSticky={false} />
                    </div>

                    {/* Sticky menubar */}
                    <div
                        className={`transition-all duration-300 ease-in-out ${
                            isSticky
                                ? 'fixed top-[70px] left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-lg'
                                : 'hidden'
                        }`}
                    >
                        <div className="container mx-auto px-6">
                            <div className="max-w-4xl mx-auto">
                                <MenuBar editor={editor} isSticky={true} />
                            </div>
                        </div>
                    </div>
                </>
            )}
            <EditorContent editor={editor} />
            {isSticky && <div className="h-16"></div>}
        </div>
    );
};

export default TiptapEditor;
