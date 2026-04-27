"use client"

import { useParams } from 'next/navigation'
import React, { useEffect, useRef } from 'react'
import WorkspaceHeader from '../_components/WorkspaceHeader';
import PdfViewer from '../_components/PdfViewer';
import { useMutation, useQueries, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import TextEditor from '../_components/TextEditor';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';


function Workspace() {
    const { user } = useUser() 
    const {fileId}=useParams();

    const saveNotes = useMutation(api.notes.AddNotes)
    const editorRef = useRef(null)

      const handleSave = async () => {
    if (!editorRef.current) return
    const content = editorRef.current() // get editor content
    await saveNotes({
      fileId,
      notes: content,
      createdBy: user?.primaryEmailAddress?.emailAddress,
    })
    toast("✅ Notes saved")
  }


    const fileInfo=useQuery(api.fileStorage.GetFileRecord,{
        fileId:fileId
    })
    useEffect(()=>{
        console.log(fileInfo)
    },[fileInfo])

  if (fileInfo === undefined) {
    return <div>Loading file...</div>;
  }

  // Handle not found
  if (fileInfo === null) {
    return <div>File not found</div>;
  }

  return (
     <div className="h-screen flex flex-col">
      <WorkspaceHeader fileName={fileInfo.fileName} onSave={handleSave}/>
      <PanelGroup direction="horizontal" className="flex-1">

        {/* Left side: Text Editor */}
        <Panel defaultSize={50} minSize={20}>
          <div className="h-full border-r p-2">
            <TextEditor onReady={(getContent) => (editorRef.current = getContent)}/>
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-gray-300 hover:bg-gray-500 transition cursor-col-resize" />

        {/* Right side: PDF Viewer */}
        <Panel defaultSize={50} minSize={20}>
          <div className="h-full p-2">
            <PdfViewer fileUrl={fileInfo?.fileUrl} />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default Workspace