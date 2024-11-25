


export default function Task({ task }) {
  



  return (
    <div className="flex flex-col w-[70%] h-min event bg-gray-600 mb-2 rounded-xl">
      <div className="flex justify-between items-center w-full h-full ml-5 mt-2">
        <div className="text-white font-bold text-lg">{task.title}</div>
      </div>
      <div className='start-date flex flex-row'>
        <div className='ml-5 text-purple-300'>Start:</div>
        <div className='flex ml-2 text-white'>{10}</div>
        <div className='ml-2 text-slate-300'>at</div>
        <div className='ml-2 text-white'>{10}</div>
      </div>
      <div className='end-date flex flex-row'>
        <div className='ml-5 text-red-300'>End:</div>
        <div className='ml-3 text-white'>{10}</div>
        <div className='ml-2 text-slate-300'>at</div>
        <div className='ml-2 text-white'>{10}</div>
      </div>
    </div>
  );
}
