import StreamClientProvider from '@/providers/SteamClientProvider'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Yoom",
    description: "Video calling app",
    icons : {
      icon : '/icons/logo.svg'
    }
  };
  

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <StreamClientProvider>
            <main className='relative'>
            {children}
        </main>
        </StreamClientProvider>
    )
}

export default layout           