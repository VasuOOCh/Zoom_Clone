'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModel from './MeetingModel'
import { useUser } from '@clerk/nextjs'
import { useToast } from "@/components/ui/use-toast"
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import DatePicker from "react-datepicker";


const MeetingTypeList = () => {
  const { toast } = useToast()
  const [meetingState, setmeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>(undefined);
  const router = useRouter();
  const user = useUser();
  const client = useStreamVideoClient(); //using from Provider

  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '', // no description for instant meeting
    link: ''
  })
  const [callDetails, setCallDeatails] = useState<Call>()

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  const createMeeting = async () => {
    if (!client || !user) return;
    if (!values.dateTime) {
      toast({ title: "Please select a date and time" })
      return;
    }

    try {
      const id = crypto.randomUUID();

      const call = client.call('default', id); //creating a call

      if (!call) throw new Error("Failed to create call")
      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString()
      const desciption = values.description || "Instant meeting"

      await call.getOrCreate({
        data: {
          starts_at: startsAt, // specifying the start of meeting
          custom: {
            desciption
          }
        }
      })

      setCallDeatails(call);

      // for an instant meeting -> push the user to meeting link
      if (!values.description) {
        router.push(`/meeting/${call.id}`)
      }

      toast({ title: "Meeting created" })
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create meeting"
      })
    }

  }

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      <HomeCard img='/icons/add-meeting.svg' title="New Meeting"
        desc="Start an instant meeting"
        handleClick={() => setmeetingState('isInstantMeeting')}
        className="bg-orange-1"
      />
      <HomeCard img='/icons/schedule.svg' title="Schedule Meeting"
        desc="Plan a meeting"
        handleClick={() => setmeetingState('isScheduleMeeting')}
        className="bg-blue-1"
      />
      <HomeCard img='/icons/recordings.svg' title="View Recordings"
        desc="Check out your recordings"
        handleClick={() => router.push('/recordings')}
        className="bg-purple-1"
      />
      <HomeCard img='/icons/join-meeting.svg' title="Join Meeting"
        desc="via invitation link"
        handleClick={() => setmeetingState('isJoiningMeeting')}
        className="bg-yellow-1"
      />

      {
        !callDetails ? (
          <MeetingModel isOpen={meetingState === 'isScheduleMeeting'} onClose={() => { setmeetingState(undefined) }} title="Create Meeting" className="text-center"
            handleClick={createMeeting}
          >
            <div className='flex flex-col gap-2.5'>
              <label className='text-base text-normal leading-[22px] text-sky-2'>Add a description</label>
              <Textarea onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))} className='bg-dark-3 border-none focus-visible:ring-0 text-white focus-visible:ring-offset-0' />

            </div>

            {/* for Datepicker  */}
            <div className='flex w-full flex-col gap-2'>
              <label className='text-base text-normal leading-[22px] text-sky-2'>Select date and time</label>
              <DatePicker selected={values.dateTime} onChange={(date) => setValues((prev) => ({ ...prev, dateTime: date! }))} showTimeSelect timeFormat='HH:mm' timeIntervals={15} timeCaption='Time' dateFormat={'MMMM d, yyyy h:mm aa'} className='w-full rounded bg-dark-3 p-2 focus:outline-none' />
            </div>
          </MeetingModel>
        ) : (
          <MeetingModel isOpen={meetingState === 'isScheduleMeeting'} onClose={() => { setmeetingState(undefined) }} title="Meeting Created" className="text-center" btnText="Copy meeting link"
            handleClick={() => {
              navigator.clipboard.writeText(meetingLink)
              toast({ title: "Link Copied" })
            }}
            img='/icons/checked.svg'
            buttonIcon='/icons/copy.svg'

          />
        )

      }

      <MeetingModel
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setmeetingState(undefined)}
        title="Join a Meeting"
        className="text-center"
        btnText="Join"
        handleClick={() => {
          router.push(values.link)
        }}
      >
        <Input onChange={(e) => {
          setValues((prev) => ({...prev, link: e.target.value}))
        }} className='bg-dark-3 border-none text-white focus-visible:ring-offset-0 focus-visible::ring-0' placeholder='Meeting link' />
      </MeetingModel>

      <MeetingModel
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setmeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        btnText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  )
}

export default MeetingTypeList