'use client';

import { useEffect, useRef, memo } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import { headers } from 'next/headers';

// type TextEditorProps = {
//     data?: OutputData;
//     onChange?: (data: OutputData) => void;
// };

export function TextEditor({ data, onChange }: any) {
    const editorRef = useRef<EditorJS | null>(null);
    const holderRef = useRef<HTMLDivElement>(null);

    // We need to store the initial data to pass to EditorJS only once
    const isMounted = useRef(false);

    useEffect(() => {
        if (!isMounted.current && !editorRef.current && holderRef.current) {
            isMounted.current = true;

            const editor = new EditorJS({
                holder: holderRef.current,
                tools: {
                    header: Header,
                    list: List,
                },
                // Only pass data on initial render
                data: data,
                async onChange(api, event) {
                    const content = await api.saver.save();
                    onChange(content);
                },
            });

            editorRef.current = editor;
        }

        return () => {
            // Optional: You might want to skip destroying on every re-render
            // But strict mode requires proper cleanup
        };

    }, []);

    // Cleanup only on unmount
    useEffect(() => {
        return () => {
            if (editorRef.current && editorRef.current.destroy) {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, []);

    return (
        <div className="border-input dark:bg-input/30 focus-within:border-ring focus-within:ring-ring/50 rounded-xl border bg-transparent px-4 py-3 transition-colors focus-within:ring-[3px] min-h-30 w-full cursor-text">
            <div ref={holderRef} className="prose dark:prose-invert max-w-none" />
        </div>
    );
}

export const MemoizedTextEditor = memo(TextEditor, (prevProps, nextProps) => {
    // Only re-render if initial data changes (which effectively never happens in this flow)
    // or if the onChange handler changes (which shouldn't if useCallback is used)
    return true; // Return true to prevent re-render always, as internal state handles updates
});




export function TextViewer({ data }: { data: OutputData | undefined }) {
    const editorRef = useRef<EditorJS | null>(null);
    const holderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!holderRef.current) return;

        if (!editorRef.current && data) {
            const editor = new EditorJS({
                holder: holderRef.current,
                readOnly: true,
                data: data,
                tools: {
                    header: Header,
                    list: List,
                },
            });

            editorRef.current = editor;
        } else if (editorRef.current && data) {
            // Debounce the update to prevent crashing on rapid changes
            const validEditor = editorRef.current;
            const timeoutId = setTimeout(() => {
                validEditor.isReady.then(() => {
                    // Check if editor is still mounted and valid
                    if (editorRef.current === validEditor) {
                        validEditor.render(data).catch(() => {
                            // Ignore render errors from rapid updates
                        });
                    }
                });
            }, 300); // 300ms debounce

            return () => clearTimeout(timeoutId);
        }

        return () => {
            if (editorRef.current && editorRef.current.destroy) {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, [data]);

    if (!data) {
        return null;
    }

    return (
        <div className="border-input dark:bg-input/30 rounded-xl border bg-transparent px-4 py-3 min-h-30 w-full">
            <div ref={holderRef} className="prose dark:prose-invert max-w-none" />
        </div>
    );
}