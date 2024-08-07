'use client'
import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';

const MeetingSetup = ({setIsSetupComplete} : {setIsSetupComplete : (value : boolean) => void}) => {
    const [isMicCamToggledOn,setMicCamToggledOn] = useState(false);
    const call = useCall();
    
    if(!call) {
        throw new Error("useCall must be used within StreamCall component")
    }
    
    useEffect(() => { 
        // if isMicCamToggledOnis true ,then mic and camera will be disabled
        if(isMicCamToggledOn) {
            call?.camera.disable();
            call?.microphone.disable();
        }else {
            call?.camera.enable();
            call?.microphone.enable();
        }

    },[isMicCamToggledOn,call?.camera, call?.microphone])

  return (
    <div className='flex h-screen w-full justify-center gap-3 text-white flex-col items-center'>
        <h2 className='text-2xl font-bold'>Setup</h2>
        <VideoPreview />
        <div className='flex h-16 items-center justify-center gap-3'>
            <label htmlFor="" className='flex items-center gap-2 justify-center font-medium'>
                <input type="checkbox" checked={isMicCamToggledOn} onChange={(e) => setMicCamToggledOn(e.target.checked)} />
                Join with mic and camera off
            </label>
            <DeviceSettings />
        </div>
        <Button onClick={() => {
            call.join();
            setIsSetupComplete(true)
        }} className='rounded bg-green-600 px-4 py-2.5' >Join Meeting</Button>
    </div> 
  )
}

export default MeetingSetup