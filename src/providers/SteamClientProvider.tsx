'use client'
import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';
import { useUser } from '@clerk/nextjs';
import {
    StreamVideo,
    StreamVideoClient,
  } from '@stream-io/video-react-sdk';
import { ReactNode, useEffect, useState } from 'react';
  
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  
  export const StreamClientProvider = ({children} : {children : ReactNode}) => {
    const [videoClient, setvideoClient] = useState<StreamVideoClient>();
    const {user,isLoaded} = useUser();


    useEffect(() => {
        if(!isLoaded || !user ) {
            return;
        }
        
        
        if(!apiKey) throw new Error('Stream API key is missing')
        const client = new StreamVideoClient({
            apiKey,
            user : {
                id : user?.id,
                name : `${user.firstName} ${user.lastName}` || user?.username || user?.id,
                image : user?.imageUrl
            },
            tokenProvider : tokenProvider
        })                
        
        setvideoClient(client);
    },[user]) //user is async, it will take to load, so we are adding its dependencies

    if(!videoClient) return <Loader />

    return (
      // the client will be accessible to all the children, Because we are using Provider
      <StreamVideo client={videoClient}> 
        {children}
      </StreamVideo>
    );
  };

  export default StreamClientProvider;