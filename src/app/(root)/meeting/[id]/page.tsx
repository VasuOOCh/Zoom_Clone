'use client';
import Loader from '@/components/Loader';
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import { useGetCallById } from '@/hooks/useGetCallByIt';
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import React, { useState } from 'react'

const Meeting = ({params} : {params : {id : string}}) => {
  const {user,isLoaded} = useUser();

  const {call,isCallLoading} = useGetCallById(params.id);
  
  const [isSetupComplete,setIsSetupComplete] = useState(false);
  
  if(!isLoaded || isCallLoading) return <Loader />

  return (
    <main className='h-screen w-full text-white'>
      <StreamCall call={call}>
          <StreamTheme>
            {
              !isSetupComplete ? (
                <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
              ) : (
                <MeetingRoom />
              )
            }
          </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting