import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Heading1,
    Heading2,
    Heading3,
    Image,
    Italic,
    Link,
    List,
    ListOrdered,
    Highlighter,
    Strikethrough,
    Table,
    Undo,
    Redo,
} from 'lucide-react';
import { Editor } from '@tiptap/react';
import { useCallback, useRef } from 'react';
import { App } from 'antd';
import { uploadPostImageAPI } from '@/services/api';

interface MenuBarProps {
    editor: Editor;
    isSticky?: boolean;
}

const MenuBar = ({ editor, isSticky = false }: MenuBarProps) => {
    const imageInputRef = useRef<HTMLInputElement>(null);
    const { message } = App.useApp();
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

    const handleAddTable = useCallback(() => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run();
    }, [editor]);

    const handleHighlight = useCallback(() => {
        const isActive = editor.isActive('highlight');
        if (isActive) {
            editor.chain().focus().unsetHighlight().run();
        } else {
            editor.chain().focus().setHighlight({ color: '#faf594' }).run();
        }
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

    if (!editor) {
        return null;
    }

    const options = [
        {
            icon: <Undo className="size-4" />,
            onClick: () => {
                editor.chain().focus().undo().run();
            },
            className: `p-2 rounded hover:bg-gray-100`,
            label: 'Undo',
            title: 'Undo',
        },
        {
            icon: <Redo className="size-4" />,
            onClick: () => {
                editor.chain().focus().redo().run();
            },
            className: `p-2 rounded hover:bg-gray-100`,
            label: 'Redo',
            title: 'Redo',
        },
        {
            icon: <span></span>,
            onClick: () => {},
            className: 'border-l border-gray-200 cursor-none',
            label: 'lane0',
        },
        {
            icon: <Heading1 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            className: `p-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`,
            label: 'H1',
            title: 'Heading 1',
        },
        {
            icon: <Heading2 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            className: `p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`,
            label: 'H2',
            title: 'Heading 2',
        },
        {
            icon: <Heading3 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            className: `p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`,
            label: 'H3',
            title: 'Heading 3',
        },
        {
            icon: <span></span>,
            onClick: () => {},
            className: 'border-l border-gray-200 cursor-none',
            label: 'lane1',
        },
        {
            icon: <Bold className="size-4" />,
            onClick: () => editor.chain().focus().toggleBold().run(),
            className: `p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`,
            label: 'Bold',
            title: 'Bold',
        },
        {
            icon: <Italic className="size-4" />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            className: `p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`,
            label: 'Italic',
            title: 'Italic',
        },
        {
            icon: <Strikethrough className="size-4" />,
            onClick: () => editor.chain().focus().toggleStrike().run(),
            className: `p-2 rounded ${editor.isActive('strike') ? 'bg-gray-200' : 'hover:bg-gray-100'}`,
            label: 'Strike',
            title: 'Strike',
        },
        {
            icon: <span></span>,
            onClick: () => {},
            className: 'border-l border-gray-200 cursor-none',
            label: 'lane2',
        },
        {
            icon: <List className="size-4" />,
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            className: `p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`,
            label: 'Bullet List',
            title: 'Bullet List',
        },
        {
            icon: <ListOrdered className="size-4" />,
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            className: `p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`,
            label: 'Ordered List',
            title: 'Ordered List',
        },
        {
            icon: <span></span>,
            onClick: () => {},
            className: 'border-l border-gray-200 cursor-none',
            label: 'lane3',
        },
        {
            icon: <AlignLeft className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign('left').run(),
            className: `p-2 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`,
            label: 'Align Left',
            title: 'Align Left',
        },
        {
            icon: <AlignCenter className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign('center').run(),
            className: `p-2 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`,
            label: 'Align Center',
            title: 'Align Center',
        },
        {
            icon: <AlignRight className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign('right').run(),
            className: `p-2 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`,
            label: 'Align Right',
            title: 'Align Right',
        },
        {
            icon: <span></span>,
            onClick: () => {},
            className: 'border-l border-gray-200 cursor-none',
            label: 'lane4',
        },
        {
            icon: <Image className="size-4" />,
            onClick: () => {
                imageInputRef.current?.click();
            },
            className: `p-2 rounded hover:bg-gray-100`,
            label: 'Image',
            title: 'Image',
        },
        {
            icon: <Link className="size-4" />,
            onClick: () => {
                setLink();
            },
            className: `p-2 rounded hover:bg-gray-100`,
            label: 'Link',
            title: 'Link',
        },
        {
            icon: <Table className="size-4" />,
            onClick: () => {
                handleAddTable();
            },
            className: `p-2 rounded ${editor.isActive('table') ? 'bg-gray-200' : 'hover:bg-gray-100'}`,
            label: 'Table',
            title: 'Table',
        },
        {
            icon: <span></span>,
            onClick: () => {},
            className: 'border-l border-gray-200 cursor-none',
            label: 'lane5',
        },
        {
            icon: <Highlighter className="size-4" />,
            onClick: () => {
                handleHighlight();
            },
            className: `p-2 rounded ${editor.isActive('highlight') ? 'bg-gray-200' : 'hover:bg-gray-100'}`,
            label: 'Highlight',
            title: 'Highlight',
        },
    ];

    return (
        <div className={`p-3 flex flex-wrap gap-2 ${isSticky ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}>
            <input type="file" ref={imageInputRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
            {options.map((option) => (
                <button
                    key={option.label}
                    onClick={option.onClick}
                    className={option.className}
                    title={option?.title || ''}
                >
                    {option.icon}
                </button>
            ))}
        </div>
    );
};

export default MenuBar;
