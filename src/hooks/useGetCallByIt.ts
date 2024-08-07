import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

export const useGetCallById = (id: string | string[]) => {
    const [call, setCall] = useState<Call>();
    const [isCallLoading, setIsCallLoading] = useState(true);

    const client = useStreamVideoClient(); // from Provider

    useEffect(() => {
        try {
                if (!client) return;

                const loadCall = async () => {
                    // https://getstream.io/video/docs/react/guides/querying-calls/#filters
                    const { calls } = await client.queryCalls({ filter_conditions: { id } });
                    
                    if (calls.length > 0) setCall(calls[0]);
                    setIsCallLoading(false);
                };

                loadCall();


        } catch (error) {
            console.log(error);
        }
    }, [client, id])

    return {
        call, isCallLoading
    }
}