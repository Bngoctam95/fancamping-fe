export interface EditorMark {
    type: 'bold' | 'italic' | 'strike' | 'link' | 'highlight' | 'textStyle';
    attrs?: {
        href?: string;
        color?: string;
    };
}

export interface EditorInline {
    type: 'text';
    text: string;
    marks?: EditorMark[];
}

export interface EditorBlock {
    type: 'paragraph' | 'heading' | 'bulletList' | 'orderedList' | 'blockquote' | 'image' | 'table';
    attrs?: {
        level?: number;
        textAlign?: 'left' | 'center' | 'right';
        src?: string;
        alt?: string;
        title?: string;
    };
    content?: EditorBlock[] | EditorInline[];
}

export interface EditorContent {
    type: 'doc';
    content: EditorBlock[];
}
