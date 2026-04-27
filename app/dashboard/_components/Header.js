'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import React from 'react'

function Header() {
  const { user } = useUser()

  // Safely get the display name
  const displayName =
    user?.fullName ||  user?.username || 'Anonymous' 

  return (
    <div className='flex justify-end items-center p-5 shadow-sm space-x-3'>
      <span className='font-medium text-gray-700'>Hello 👋 {displayName}</span>
      <UserButton />
    </div>
  )
}

export default Header
