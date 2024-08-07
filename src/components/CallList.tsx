//@ts-nocheck
'use client'
import { useGetCall } from '@/hooks/useGetCall'
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import MeetingCard from './MeetingCard';
import Loader from './Loader';
import { toast } from './ui/use-toast';

const CallList = ({ type }: { type: 'upcoming' | 'ended' | 'recording' }) => {
    const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCall();
    const router = useRouter();

    const [recodings, setRecordings] = useState<CallRecording[]>([]);

    const getCalls = () => {
        switch (type) {
            case 'ended':
                return endedCalls
                break;
            case 'recording':
                return recodings;
                break;
            case 'upcoming':
                return upcomingCalls;
                break;
            default:
                return [];
                break;
        }
    }

    const getNoCallsMessage = () => {
        switch (type) {
            case 'ended':
                return 'No Previous Calls'
                break;
            case 'recording':
                return 'No Recordings';
                break;
            case 'upcoming':
                return 'No Upcoming Calls';
                break;
            default:
                return "";
                break;
        }
    }

    useEffect(() => {
        const fetchRecording = async () => {
            try {
                const callData = await Promise.all((callRecordings.map((meeting) => meeting.queryRecordings())))
            
            const recordings = callData
            .filter((call) => call.recordings.length > 0)
            .flatMap((call) => call.recordings)
            
            //flatMap => [['rec1','rec2'],['rec3','rec4']] ==> ['rec1','rec2','rec3','rec4']
            setRecordings(recodings);
            } catch (error) {
                console.log(error);
                toast({
                    title : "Try again later"
                })
                
            }
        }

        if(type === 'recording') fetchRecording()
    },[type,callRecordings])

    const calls = getCalls();
    const noCallsMessage = getNoCallsMessage();

    if(isLoading) return <Loader />

    return (
        <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
            {
                calls && calls.length > 0 ? (
                    calls.map((meeting: Call | CallRecording) => (
                        <MeetingCard
                        key={(meeting as Call).id}
                        icon={
                            type === 'ended' ? '/icons/previous.svg' : type === 'upcoming' ? '/icons/upcoming.svg' : 'icons/recordings.svg'
                        }
                        title={(meeting as Call).state?.custom?.desciption?.substring(0,20) || meeting?.filename?.substring(0,20) || 'Personal Meeting'}
                        date={meeting.state?.startsAt.toLocaleString() || meeting.start_time.toLocaleString()}
                        isPreviousMeeting={
                            type === 'ended'
                        }
                        buttonIcon1={
                            type === 'recording' ? '/icons/play.svg' : undefined
                        }
                        handleClick={
                            type === 'recording' ? () => router.push(`/${meeting.url}`) : () => router.push(`/meeting/${meeting.id}`)
                        }
                        link={
                            type === 'recording' ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`
                        }
                        buttonText={
                            type === 'recording' ? "Play" :"Start"
                        }
                         />
                    ))
                ) : (
                    <h1>{noCallsMessage}</h1>
                )
            }

        </div>
    )
}

export default CallList