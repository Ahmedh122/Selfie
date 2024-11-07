import React, { useContext } from 'react'
import { AuthContext } from '../../context/authcontext';
import { QueryClient, useMutation, useQueryClient } from 'react-query';
import { makeRequest } from '../../axios';


  const Event = ({event, user}) => {
    const queryClient = useQueryClient();

    const {curretUser} = useContext(AuthContext);


    const deleteMutation = useMutation(
      (eventId) => {
        return makeRequest.delete("/events/" + eventId);
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["events"]);
        },
      }
    ); 
    


  return (
    <div className='  flex w-[70%] h-[4rem]  event bg-slate-300 mb-2 rounded-xl justify-center items-center'>
      <div className='flex text-white w-full h-full ml-4  ' >{event.title}</div>
      <div>{event.eventStart}</div>
      
    </div>
  )
}

export default Event