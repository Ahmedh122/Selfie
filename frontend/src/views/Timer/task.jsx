


export default function Task({ task }) {
  



  return (
    <div className="flex flex-col w-[70%] h-min event bg-gray-600 mb-2 rounded-xl">
      <div className="flex justify-between items-center w-full h-full ml-5 mt-2">
        <div className="text-white font-bold text-lg">{task.title}</div>
      </div>
      <div className='start-date flex flex-row'>
        <div className='ml-5 text-purple-300'>pomos done:</div>
        <div className='flex ml-2 text-white'>{10}</div>
        <div className='ml-2 text-slate-300'>/</div>
        <div className='ml-2 text-white'>{10}</div>
      </div>
    </div>
  );
}
