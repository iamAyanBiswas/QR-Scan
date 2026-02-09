'use client'
import { OutputData } from "@editorjs/editorjs";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const TextEditor = dynamic(() => import("@/components/custom/text-editor").then(mod => ({ default: mod.MemoizedTextEditor })), { ssr: false });
const TextViewer = dynamic(() => import("@/components/custom/text-editor").then(mod => ({ default: mod.TextViewer })), { ssr: false });

export default function EditorPage() {
    const [editorJsonData, setEditorJsonData] = useState<OutputData>()
    useEffect(() => {
        console.log(editorJsonData)
    }, [editorJsonData])

    return (
        <div className="space-y-4">
            {/* <TextEditor data={editorJsonData} onChange={setEditorJsonData} /> */}
            <TextViewer data={editorJsonData} />
        </div>
    )
}