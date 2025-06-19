import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { useCallback, useEffect, useRef, useState } from 'react';
import { App } from 'antd';
import { uploadPostImageAPI } from '@/services/api';

const MenuBar = ({ editor }: { editor: any }) => {
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showHighlightPicker, setShowHighlightPicker] = useState(false);
    const [currentTextColor, setCurrentTextColor] = useState('#000000');
    const [currentHighlightColor, setCurrentHighlightColor] = useState('#ffeb3b');
    const colorPickerRef = useRef<HTMLDivElement>(null);
    const highlightPickerRef = useRef<HTMLDivElement>(null);
    const { message } = App.useApp();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
                setShowColorPicker(false);
            }
            if (highlightPickerRef.current && !highlightPickerRef.current.contains(event.target as Node)) {
                setShowHighlightPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!editor) {
        return null;
    }

    const addImage = useCallback(() => {
        // Trigger file input click
        imageInputRef.current?.click();
    }, [editor]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type and size
        const isValidFormat = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
        if (!isValidFormat) {
            message.error('You can only upload JPG/PNG/WebP file!');
            return;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must smaller than 5MB!');
            return;
        }

        try {
            const res = await uploadPostImageAPI(file);
            if (res?.data) {
                const imageUrl = `${import.meta.env.VITE_BACKEND_URL}uploads/posts/images/${res.data}`;
                editor.chain().focus().setImage({ src: imageUrl }).run();
            } else {
                message.error(res?.message || 'Failed to upload image. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            message.error('Failed to upload image. Please try again.');
        }

        // Clear the input
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    };

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL:', previousUrl);

        if (url === null) {
            return; // Cancelled
        }

        if (url === '') {
            editor.chain().focus().unsetLink().run();
            return;
        }

        editor.chain().focus().setLink({ href: url }).run();
    }, [editor]);

    const addTable = useCallback(() => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }, [editor]);
    const colors = [
        '#000000',
        '#434343',
        '#666666',
        '#999999',
        '#b7b7b7',
        '#cccccc',
        '#d74242',
        '#e91e63',
        '#9c27b0',
        '#673ab7',
        '#3f51b5',
        '#2196f3',
        '#03a9f4',
        '#00bcd4',
        '#009688',
        '#4caf50',
        '#8bc34a',
        '#cddc39',
        '#ffeb3b',
        '#ffc107',
        '#ff9800',
        '#ff5722',
        '#795548',
        '#607d8b',
    ];

    const handleColor = (color: string) => {
        setCurrentTextColor(color);
        editor.chain().focus().setColor(color).run();
    };

    return (
        <div className="border-b border-gray-200 p-4 flex flex-wrap gap-2">
            {/* Hidden file input for image upload */}
            <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Bold"
            >
                <i className="fas fa-bold"></i>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Italic"
            >
                <i className="fas fa-italic"></i>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 rounded ${editor.isActive('strike') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Strike"
            >
                <i className="fas fa-strikethrough"></i>
            </button>
            <div className="border-l border-gray-200 mx-2"></div>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Heading 1"
            >
                H1
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Heading 2"
            >
                H2
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Heading 3"
            >
                H3
            </button>
            <div className="border-l border-gray-200 mx-2"></div>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Bullet List"
            >
                <i className="fas fa-list-ul"></i>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Numbered List"
            >
                <i className="fas fa-list-ol"></i>
            </button>
            <div className="border-l border-gray-200 mx-2"></div>
            <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Align Left"
            >
                <i className="fas fa-align-left"></i>
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Align Center"
            >
                <i className="fas fa-align-center"></i>
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Align Right"
            >
                <i className="fas fa-align-right"></i>
            </button>
            <div className="border-l border-gray-200 mx-2"></div>
            <button
                onClick={setLink}
                className={`p-2 rounded ${editor.isActive('link') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Add Link"
            >
                <i className="fas fa-link"></i>
            </button>
            <button onClick={addImage} className="p-2 rounded hover:bg-gray-100" title="Add Image">
                <i className="fas fa-image"></i>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Blockquote"
            >
                <i className="fas fa-quote-right"></i>
            </button>
            <button
                onClick={addTable}
                className={`p-2 rounded ${editor.isActive('table') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Insert Table"
            >
                <i className="fas fa-table"></i>
            </button>
            <div className="border-l border-gray-200 mx-2"></div>

            {/* Text Color */}
            <div className="relative">
                <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="p-2 rounded hover:bg-gray-100 flex items-center gap-1"
                    title="Text Color"
                >
                    <i className="fas fa-paint-brush"></i>
                    <div className="w-2 h-2" style={{ backgroundColor: currentTextColor }}></div>
                </button>
                {showColorPicker && (
                    <div
                        ref={colorPickerRef}
                        className="absolute top-full right-0 mt-1 p-2 bg-white shadow-lg rounded-lg z-50 w-64"
                    >
                        <div className="mb-2">
                            <input
                                type="color"
                                value={currentTextColor}
                                onChange={(e) => handleColor(e.target.value)}
                                className="w-full h-10 cursor-pointer"
                            />
                        </div>
                        <div className="grid grid-cols-6 gap-1">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => {
                                        handleColor(color);
                                        setShowColorPicker(false);
                                    }}
                                    className="w-8 h-8 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Highlight */}
            <div className="relative">
                <button
                    onClick={() => {
                        const isActive = editor.isActive('highlight');
                        if (isActive) {
                            editor.chain().focus().unsetHighlight().run();
                        } else {
                            editor.chain().focus().setHighlight({ color: currentHighlightColor }).run();
                        }
                    }}
                    className={`p-2 rounded ${editor.isActive('highlight') ? 'bg-gray-200' : 'hover:bg-gray-100'} flex items-center gap-1`}
                    title="Highlight"
                >
                    <i className="fas fa-highlighter"></i>
                    <div
                        className="w-3 h-3 border border-gray-200 cursor-pointer"
                        style={{ backgroundColor: currentHighlightColor }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowHighlightPicker(!showHighlightPicker);
                        }}
                    ></div>
                </button>
                {showHighlightPicker && (
                    <div
                        ref={highlightPickerRef}
                        className="absolute top-full right-0 mt-1 p-2 bg-white shadow-lg rounded-lg z-50 w-64"
                    >
                        <div className="mb-2">
                            <input
                                type="color"
                                value={currentHighlightColor}
                                onChange={(e) => {
                                    const newColor = e.target.value;
                                    setCurrentHighlightColor(newColor);
                                    if (editor.isActive('highlight')) {
                                        editor.chain().focus().setHighlight({ color: newColor }).run();
                                    }
                                }}
                                className="w-full h-10 cursor-pointer"
                            />
                        </div>
                        <div className="grid grid-cols-6 gap-1">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => {
                                        setCurrentHighlightColor(color);
                                        if (editor.isActive('highlight')) {
                                            editor.chain().focus().setHighlight({ color }).run();
                                        }
                                        setShowHighlightPicker(false);
                                    }}
                                    className="w-8 h-8 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

interface PostEditorProps {
    content?: string;
    onChange?: (content: string) => void;
}

const PostEditor = ({ content = '', onChange }: PostEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                    HTMLAttributes: {
                        class: 'font-bold',
                    },
                },
                bulletList: {
                    keepMarks: true,
                    keepAttributes: true,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: true,
                },
            }),
            TextStyle,
            Color,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 hover:underline',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
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
                    class: 'highlight',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph', 'bulletList', 'orderedList'],
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            const jsonContent = editor.getJSON();
            onChange?.(JSON.stringify(jsonContent));
        },
        autofocus: true,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
            },
        },
    });

    return (
        <div className="border rounded-lg overflow-hidden">
            <MenuBar editor={editor} />
            <div className="p-4">
                <EditorContent editor={editor} className="prose max-w-none min-h-[300px]" />
            </div>
        </div>
    );
};

export default PostEditor;
