"use client"

import { Placeholder } from '@tiptap/extensions'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect } from 'react'
import EditorExtensions from './EditorExtensions'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from "@tiptap/extension-text-align";
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useParams } from 'next/navigation'



function TextEditor({ onReady }) {
    const{fileId}=useParams()
    const file = useQuery(api.fileStorage.GetFileRecord, { fileId });

    const notes=useQuery(api.notes.GetNotes,{
        fileId:fileId
    })

    console.log(notes)

    const editor = useEditor({
    extensions: [StarterKit,Placeholder.configure({placeholder:'Start Taking your Notes here'}),
        Highlight.configure({ multicolor: true }),
        TextAlign.configure({types: ['heading', 'paragraph'],}),
    ],
    editorProps:{
        attributes:{
            class:'focus:outline-none'
        },
    },
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  })

  useEffect(()=>{
    editor&&editor.commands.setContent(notes)
  },[notes&&editor])

    useEffect(() => {
    if (editor && onReady) {
      onReady(() => editor.getHTML()) // parent can later call this
    }
  }, [editor, onReady])

  return (
    <div>
        <EditorExtensions editor={editor}/>
        <div className='overflow-scroll h-[88vh]'>
            <EditorContent editor={editor} />
        </div>
    </div>
  )
}

export default TextEditor