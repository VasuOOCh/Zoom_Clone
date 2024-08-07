import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import MobileNav from './MobileNav'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

const Navbar = () => {
  return (
    <nav className='flex-between z-50 fixed text-white bg-dark-1 px-6 py-4 lg:px-10 w-full'>
      <Link href={'/'} className='flex items-center gap-1' >
        <Image src={'/icons/logo.svg'} width={32} height={32} alt='Your room' className='max-sm:size-10' />
        <p className='text-[26px] font-extrabold max-sm:hidden'>Yoom</p>
      </Link>

      <div className='flex gap-5'>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  )
}

export default Navbar