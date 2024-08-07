import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react";

export const useGetCall = () => {
    const [calls, setcalls] = useState<Call[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const client = useStreamVideoClient();
    const { user } = useUser();

    useEffect(() => {
        const loadCalls = async () => {
            if(!client || !user?.id) return
            setIsLoading(true);
            const {calls} = await client.queryCalls({
                sort : [{field : 'starts_at',direction : -1}],
                filter_conditions : {
                    starts_at : {$exists : true},
                    $or : [
                        {created_by_user_id : user.id},
                        {members : {$in : [user.id]}}
                    ]
                }
            })
            setcalls(calls);
            try {
                
            } catch (error) {
                console.log(error);
            }finally {
                setIsLoading(false)
            }
        }
        loadCalls()
    },[user?.id, client]);

    const now = new Date();

    const endedCalls = calls.filter(({state : {startsAt,endedAt}} : Call) => {
        return (startsAt && new Date(startsAt) < now || !!endedAt)
    });
    const upcomingCalls = calls.filter(({state : {startsAt,endedAt}} : Call) => {
        return startsAt && new Date(startsAt) > now
    });
    const callRecordings = calls;

    return {
        endedCalls,
        upcomingCalls,callRecordings,isLoading
    }

}