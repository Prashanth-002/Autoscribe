'use client'

import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { Loader2, Upload } from 'lucide-react' // optional for spinner
import UploadPdfDialog from './_components/UploadPdfDialog'
import { Button } from '@/components/ui/button'

function Dashboard() {
  const { user } = useUser()
  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  })

  return (
    <div>
      <h2 className="font-medium text-3xl">WorkSpace</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-10">
        {/* 👉 Case 1: Loading */}
        {fileList === undefined &&
          [1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="bg-slate-200 rounded-md h-[150px] animate-pulse"
            ></div>
          ))}

        {/* 👉 Case 2: Loaded but no files */}
        {fileList?.length === 0 && (
          <div className='col-span-full flex flex-col items-center justify-center text-center py-20 border rounded-md bg-slate-50'>
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-600">No files uploaded yet</p>
            <p className="text-sm text-gray-400 mt-1">Upload your first PDF to get started</p>
            
            <div className="mt-5">
              <UploadPdfDialog>
                <Button>+ Upload PDF</Button>
              </UploadPdfDialog>
            </div>
          </div>
        )}

        {/* 👉 Case 3: Files available */}
        {fileList?.length > 0 &&
          fileList.map((file, index) => (
            <Link key={index} href={'/workspace/' + file.fileId}>
              <div className="flex p-5 shadow-md rounded-md flex-col items-center justify-center border cursor-pointer hover:bg-slate-100">
                <Image src="/pdf.png" alt="file" width={50} height={50} />
                <h2 className="mt-3 font-medium text-lg">
                  {file?.fileName || 'Untitled'}
                </h2>
              </div>
            </Link>
          ))}
      </div>
    </div>
  )
}

export default Dashboard
