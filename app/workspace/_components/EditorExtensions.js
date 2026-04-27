"use client"

import { api } from '@/convex/_generated/api'
import { useAction, useMutation, useQuery } from 'convex/react'
import { AlignCenter, AlignLeftIcon, AlignRight, AlignRightIcon, Bold, FileDown, Heading1, Heading2, Heading3Icon, Highlighter, Italic, ListOrdered, MoveLeft, MoveRight, Sparkle, Sparkles, Strikethrough, Underline } from 'lucide-react'
import { useParams } from 'next/navigation'
import { generateText } from '@/configs/AIModel'
import React from 'react'
import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs'
import { downloadDocx } from '@/app/utils/downloadDocx'

function EditorExtensions({editor}) {
    const {fileId}=useParams();
    const SearchAI=useAction(api.myActions.search)
    const saveNotes=useMutation(api.notes.AddNotes)
    const {user}=useUser();

    const fileName = useQuery(api.fileStorage.getFileNameById, { fileId });

    const onAiClick=async()=>{
      toast("AI is getting your answer...")
        const selectedText=editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to, 
            ' '
        );
        console.log(selectedText)
        const result=await SearchAI({
            query:selectedText, 
            fileId:fileId
        });

        const unformattedAns=result;
        let AllunformattedAnswer=''
        unformattedAns&&unformattedAns.forEach(item=>{
            AllunformattedAnswer=AllunformattedAnswer+item.pageContent
        });

        const PROMPT ="For Question:"+selectedText+"and with given content as answer,"+"please give appropriate answer in HTML format without CSS. The answer content is: "+AllunformattedAnswer;

//         Generate an HTML fragment as a string using the given Question (selectedText) and provided answer content (AllunformattedAnswer).
// Instructions:
// - Place the Question inside an <h2> tag.
// - For the answer content:
// - If it contains multiple paragraphs or lists, wrap it in a <div>.
// - If it is a simple paragraph, use a <p> tag.
// - Preserve only <p>, <ul>, <ol>, and <li> tags if present; remove all other HTML tags.
// - If there is no HTML formatting, wrap the answer in appropriate <p> or list tags.
// - Escape special HTML characters in the answer unless already properly formatted.
// - If AllunformattedAnswer is empty or null, output <div>No answer is available.</div> after the question header.


        const AIModelResult=await generateText(PROMPT)

        console.log(AIModelResult);
        const FinalAns=AIModelResult.replace('```','').replace('html','').replace('```','');

        const Alltext=editor.getHTML();
        editor.commands.setContent(Alltext+'<p><strong>Answer:</strong>'+FinalAns+'</p>')

        saveNotes({
          notes:editor.getHTML(),
          fileId:fileId,
          createdBy:user?.primaryEmailAddress?.emailAddress
        })


    }

  return editor&&(
    <div className='p-3'>
        <div className="control-group">
            <div className="button-group flex gap-3">

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`hover:text-blue-500 ${editor.isActive("heading", { level: 1 }) ? "text-blue-500 font-bold" : ""} cursor-pointer`}
        >
          <Heading1/>
        </button>
                <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`hover:text-blue-500 ${editor.isActive("heading", { level: 2 }) ? "text-blue-500 font-bold" : ""} cursor-pointer`}
        >
          <Heading2/>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`hover:text-blue-500 ${editor.isActive("heading", { level: 3 }) ? "text-blue-500 font-bold" : ""} cursor-pointer`}
        >
          <Heading3Icon/>
        </button>


                <button
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`hover:text-blue-500 ${editor?.isActive('bold') ? 'text-blue-500' : ''} cursor-pointer`}
                    style={{ cursor: "pointer" }}
                >
                <Bold/>
                </button>

                <button
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`hover:text-blue-500 ${editor?.isActive('italic') ? 'text-blue-500' : ''} cursor-pointer`}
                >
                <Italic/>
                </button>

                          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`hover:text-blue-500 ${editor.isActive('underline') ? 'is-active' : ''}cursor-pointer`}
          >
            <Underline/>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHighlight({}).run()}
            className={`hover:text-blue-500 ${editor.isActive('highlight', {}) ? 'is-active' : ''} cursor-pointer `}
          >
            <Highlighter/>
          </button>

                    <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`hover:text-blue-500 ${editor.isActive('strike') ? 'is-active' : ''} cursor-pointer`}
          >
            <Strikethrough/>
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`hover:text-blue-500 ${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''} cursor-pointer`}
          >
            <AlignLeftIcon/>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`hover:text-blue-500 ${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''} cursor-pointer`}
          >
            <AlignCenter/>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`hover:text-blue-500 ${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''} cursor-pointer`}
          >
            <AlignRightIcon/>
          </button> 

        <button
            onClick={()=>onAiClick()}
            className={'hover:text-blue-500 cursor-pointer'}
          >
            <Sparkles/>
          </button> 

          <button
            onClick={() => {
            const json = editor.getJSON();   // TipTap JSON
              downloadDocx(json,fileName);              // Export to docx
              }}
            className="hover:text-green-600 cursor-pointer"
            >
            <FileDown />
          </button>


          </div>
        </div>
    </div>
  )
}

export default EditorExtensions