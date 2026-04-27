import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

function WorkspaceHeader({fileName,onSave}) {

  const userButtonAppearance = {
    elements: {
      userButtonAvatarBox: "w-20 h-10", // Custom width and height using Tailwind CSS classes
      // You can also use other CSS properties like:
      // userButtonAvatarBox: {
      //   width: "40px",
      //   height: "40px",
      // },
    },
  };

  return (
    <div className='p-4 flex justify-between shadow-md ' >
        <Image src={'/next1.svg'} alt="logo" width={120} height={120}/>
        <h2 className='font-bold'>{fileName}</h2>
        <div className='flex gap-2 items-center'>
          <Button onClick={onSave}>Save</Button>
            <UserButton appearance={userButtonAppearance}/>
        </div>

    </div>
  )
}

export default WorkspaceHeader