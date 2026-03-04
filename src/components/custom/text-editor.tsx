'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code,
    Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Minus,
    Link as LinkIcon, Link2Off,
    AlignLeft, AlignCenter, AlignRight,
    Undo2, Redo2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

// ─── Shared extensions (used by both editor & viewer) ────────────────────────

const sharedExtensions = [
    StarterKit.configure({
        heading: { levels: [1, 2, 3] },
    }),
    Underline,
    Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'tiptap-link' },
    }),
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
];

// ─── Toolbar button ──────────────────────────────────────────────────────────

type ToolbarBtnProps = {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
};

function ToolbarBtn({ icon: Icon, label, active, disabled, onClick }: ToolbarBtnProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    aria-label={label}
                    aria-pressed={active}
                    className={cn(
                        'inline-flex items-center justify-center size-7 rounded-md text-muted-foreground',
                        'transition-all duration-150 ease-out cursor-pointer',
                        'hover:bg-accent hover:text-accent-foreground hover:scale-105',
                        'disabled:opacity-30 disabled:pointer-events-none disabled:cursor-default',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        active && 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground',
                    )}
                    onClick={onClick}
                >
                    <Icon className="size-3.5" />
                </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">{label}</TooltipContent>
        </Tooltip>
    );
}

// ─── Button group wrapper ────────────────────────────────────────────────────

function ToolbarGroup({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-0.5 rounded-lg bg-muted/50 p-0.5">
            {children}
        </div>
    );
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

function Toolbar({ editor }: { editor: Editor | null }) {
    if (!editor) return null;

    const setLink = () => {
        const prev = editor.getAttributes('link').href ?? '';
        const url = window.prompt('Enter URL', prev);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="flex flex-wrap items-center gap-1.5 border-b border-border/60 bg-muted/30 px-3 py-2">
            {/* Text formatting */}
            <ToolbarGroup>
                <ToolbarBtn icon={Bold} label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
                <ToolbarBtn icon={Italic} label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
                <ToolbarBtn icon={UnderlineIcon} label="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} />
                <ToolbarBtn icon={Strikethrough} label="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} />
                <ToolbarBtn icon={Code} label="Inline code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} />
            </ToolbarGroup>

            {/* Headings */}
            <ToolbarGroup>
                <ToolbarBtn icon={Heading1} label="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} />
                <ToolbarBtn icon={Heading2} label="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
                <ToolbarBtn icon={Heading3} label="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
            </ToolbarGroup>

            {/* Lists & blocks */}
            <ToolbarGroup>
                <ToolbarBtn icon={List} label="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
                <ToolbarBtn icon={ListOrdered} label="Ordered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
                <ToolbarBtn icon={Quote} label="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
                <ToolbarBtn icon={Minus} label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
            </ToolbarGroup>

            {/* Link */}
            <ToolbarGroup>
                <ToolbarBtn icon={LinkIcon} label="Set link" active={editor.isActive('link')} onClick={setLink} />
                <ToolbarBtn icon={Link2Off} label="Remove link" disabled={!editor.isActive('link')} onClick={() => editor.chain().focus().unsetLink().run()} />
            </ToolbarGroup>

            {/* Alignment */}
            <ToolbarGroup>
                <ToolbarBtn icon={AlignLeft} label="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} />
                <ToolbarBtn icon={AlignCenter} label="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} />
                <ToolbarBtn icon={AlignRight} label="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} />
            </ToolbarGroup>

            {/* Undo / Redo */}
            <ToolbarGroup>
                <ToolbarBtn icon={Undo2} label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()} />
                <ToolbarBtn icon={Redo2} label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()} />
            </ToolbarGroup>
        </div>
    );
}

// ─── TextEditor ──────────────────────────────────────────────────────────────

type TextEditorProps = {
    data?: string;
    onUpdate?: (data: string) => void;
    className?: string;
};

export function TextEditor({ data, onUpdate, className }: TextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            ...sharedExtensions,
            Placeholder.configure({ placeholder: 'Start writing…' }),
        ],
        content: data ?? '',
        onUpdate: ({ editor }) => {
            onUpdate?.(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'tiptap-editor',
            },
        },
    });

    return (
        <div className={cn(
            'rounded-xl border border-border/60 bg-background overflow-hidden',
            'shadow-sm transition-shadow duration-200',
            'focus-within:shadow-md focus-within:border-ring/40',
            className
        )}>
            <Toolbar editor={editor} />
            <div className="px-4 py-3">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}

