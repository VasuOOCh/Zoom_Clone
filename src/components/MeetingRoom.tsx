'use client'
import { cn } from '@/lib/utils'
import { CallControls, CallingState, CallParticipantsList, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList, Users } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import EndCallButton from './EndCallButton'
import Loader from './Loader'


type CallLayout = 'grid' | 'speaker-left' | 'speaker-right'

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal')
  const [showParticipants, setShowParticipants] = useState(false)
  const [layout, setLayout] = useState<CallLayout>('speaker-left')
  const router = useRouter();
  const {useCallCallingState} = useCallStateHooks();
  const callingState = useCallCallingState();

  if(callingState != CallingState.JOINED) return <Loader />


  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />
        break;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition={'left'} />
        break;
      default:
        return <SpeakerLayout participantsBarPosition={'right'} />
        break;
    }
  }

  return (
    <section className='h-screen w-full overflow-hidden text-white p-4 relative '>
      <div className='relative flex size-full items-center justify-center'>
        <div className='flex size-full max-w-[1000px] items-center'>
          <CallLayout />
        </div>

        <div className={cn('h-[calc(100vh-86px)] hidden ml-2', {
          'show-block': showParticipants
        })}>
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      <div className='fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap'>
        <CallControls onLeave={() => {
          router.push('/')
        }} />
        <DropdownMenu>
          <div className='flx items-center'>
            <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
              <LayoutList size={20} className='text-white' />
            </DropdownMenuTrigger>

          </div>
          <DropdownMenuContent className='border-dark-1 bg-dark-1 text-white'>
            {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item,index) => (
              <div key={index}>
                <DropdownMenuItem className='cursor-pointer' onClick={(e) => setLayout(item.toLowerCase() as CallLayout)} >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className='border-dark-1' />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button onClick={() => setShowParticipants(!showParticipants)}>
            <div className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
              <Users size={20} className='text-white' />
            </div>
        </button> 
          {
            !isPersonalRoom && (
              <EndCallButton />
            )
          }
      </div>

    </section>
  )
}

export default MeetingRoom