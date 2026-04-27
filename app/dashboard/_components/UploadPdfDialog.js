'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAction, useMutation } from 'convex/react'
import { Loader2Icon } from 'lucide-react'
import { api } from '@/convex/_generated/api'
import uuid4 from 'uuid4'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'

function UploadPdfDialog({ children, isMaxFile }) {

  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl)
  const addFileEntry = useMutation(api.fileStorage.AddFileEntryToDb)
  const getFileUrl = useMutation(api.fileStorage.getFileUrl)
  const embeddDocument = useAction(api.myActions.ingest)
  const { user } = useUser();

  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState()
  const [open, setOpen] = useState(false)

  const OnFileSelect = (event) => {
    setFile(event.target.files[0])
  }

  const onUpload = async () => {
    if (!file) {
      toast.error("Please select a file before uploading.");
      return;
    }
    if (!fileName?.trim()) {
      toast.error("Please enter a file name.");
      return;
    }
    setLoading(true);

    try {
      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file?.type },
        body: file,
      });
      const { storageId } = await result.json();

      console.log("StorageId:", storageId);

      const fileId = uuid4();
      const fileUrl = await getFileUrl({ storageId });

      // Step 3: Save the newly allocated storage id to the database
      await addFileEntry({
        fileId,
        storageId,
        fileName: fileName ?? 'Untitled File',
        fileUrl,
        createdBy: user?.primaryEmailAddress.emailAddress
      })

      // Step 4: Let Convex fetch & process the PDF server-side
      await embeddDocument({
        fileUrl: fileUrl,
        fileId: fileId
      })

      toast.success('File is ready...');

      setLoading(false);
      setOpen(false);

    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed, please try again.");
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} disabled={isMaxFile} className='w-full'>
          + Upload PDF File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload PDF File</DialogTitle>
          <DialogDescription asChild>
            <div>
              <h2 className='mt-5'>Select a file to Upload</h2>
              <div className='gap-2 p-3 rounded-md border'>
                <input type='file' accept='application/pdf' onChange={OnFileSelect} />
              </div>
              <div className='mt-2'>
                <label>File Name</label>
                <Input
                  placeholder='File Name'
                  onChange={(event) => setFileName(event.target.value)}
                  required
                />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={onUpload} disabled={loading}>
            {loading ? <Loader2Icon className='animate-spin' /> : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UploadPdfDialog
