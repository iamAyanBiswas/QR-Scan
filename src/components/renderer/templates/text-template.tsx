'use client'
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';

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
// ─── TextTemplate (read-only preview) ──────────────────────────────────────────

export default function TextTemplate({ data, className }: { data: TextPageData; className?: string }) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: sharedExtensions,
        content: data?.content ?? '',
        editable: false,
        editorProps: {
            attributes: {
                class: 'tiptap-viewer',
            },
        },
    });

    useEffect(() => {
        if (editor && data !== undefined && data?.content !== editor.getHTML()) {
            editor.commands.setContent(data.content);
        }
    }, [data, editor]);

    return (
        <div className={cn(
            'overflow-hidden',
            className
        )}>
            <div className="px-4 py-3">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}