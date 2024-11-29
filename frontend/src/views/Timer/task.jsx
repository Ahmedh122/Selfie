


export default function Task({ task , click}) {
  



  return (
    <div onClick={()=> click(task)} className="flex flex-col w-[70%] h-min event bg-gray-600 mb-2 rounded-xl">
      <div className="flex justify-between items-center w-full h-full ml-5 mt-2">
        <div className="text-white font-bold text-lg">{task.taskname}</div>
      </div>
      <div className='start-date flex flex-row'>
        <div className='ml-5 text-purple-300'>pomos done:</div>
        <div className='flex ml-2 text-white'>{task.donepomo}</div>
        <div className='ml-2 text-slate-300'>/</div>
        <div className='ml-2 text-white'>{task.longBreakInterval}</div>
      </div>
    </div>
  );
}
