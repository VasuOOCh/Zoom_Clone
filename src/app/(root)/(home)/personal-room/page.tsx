'use client'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import React from 'react'
import { useToast } from '@/components/ui/use-toast';
import { useGetCallById } from '@/hooks/useGetCallByIt';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';

const Table = ({title,description} : {title :string, description : string}) => (
  <div className='flex flex-col items-start gap-2 xl:flex-row'>
    <h1 className='text-base text-sky-1 font-medium lg:text-xl xl:min-w-32'>{title} : </h1>
    <h1 className='font-semibold truncate text-sm max-sm:max-w-[320px] lg:text-xl'>{description}</h1>
  </div>
)

const PersonalRoom = () => {
  const { toast } = useToast();
  const {user} = useUser();
  const meetingId = user?.id;
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`
  const  {call} = useGetCallById(meetingId!);
  const client = useStreamVideoClient();
  const router = useRouter();

  const startRoom = async () => {
    console.log("running");
    
    if(!user || !client) return;
    const newCall =client.call('default', meetingId!);
    if(!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(), // specifying the start of meeting
        }
      })
    }

    router.push(`/meeting/${meetingId}?personal=true`)

    
  }
  
  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <h1 className='text-3xl font-bold'>
        Personal
      </h1>

      <div className='flex w-full flex-col gap-8 xl:max-w-[900px]'>
        <Table title="Topic" description={user?.username || `${user?.firstName + " " + user?.lastName}` + "'s meeting Room"} />
        <Table title="Meeting ID" description={meetingId!} />
        <Table title="Invite Link" description={meetingLink} />
      <div className='flex gap-4'>
      <Button className='bg-blue-1' onClick={startRoom}>
        Start Meeting
      </Button>
      <Button className='bg-dark-3' onClick={() => {
        navigator.clipboard.writeText(meetingLink);
        toast({
          title : "Copied to clipboard"
        })
      }}>
        Copy Link
      </Button>
      </div>
      
      </div>
    </section>
  )
}

export default PersonalRoom