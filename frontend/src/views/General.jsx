import React from 'react'
import { useNavigate } from 'react-router-dom'


function General() {
    const navigate = useNavigate();

    const navToLogin =() =>{
        navigate("/login");
    };
    const navToRegister = () => {
       navigate("/register");
    };



  return (
    <div className="w-screen h-screen flex flex-row justify-center items-center bg-[#313338]  ">
      <div className='z-10'>
        <style>
          {`
                .svg-glow {
                  transition: filter 0.3s ease, transform 0.3s ease; 
                }

                .svg-glow:hover {
                  filter: drop-shadow(0 0 8px white);
                  transform: rotate(-90deg);
                }
              `}
        </style>
        <button
          className="rounded-full absolute flex top-[19%] right-6"
         
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-7 stroke-white svg-glow"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </button>
      </div>
      <style>
        {`
          .text-glow {
            transition: text-shadow 0.3s ease, transform 0.1s ease;
          }

          .text-glow:hover {
            text-shadow: 0 0 14px rgba(255, 255, 255, 0.8);
          }
        `}
      </style>
      <div className="flex  absolute top-0 text-purple-700 font-bold font-sans text-5xl w-screen h-[25%]    bg-[#141517] shadow-[15px_15px_35px_#121214,-15px_-15px_35px_#34363c]">
        <div className="w-[90%] h-[90%]  flex flex-col justify-end  ml-5">
          <span className="text-white text-[2rem]">welcome to</span>
          <span className="text-purple-600 text-[5rem]">SELFIE.</span>
        </div>
      </div>
      <div className="flex flex-row w-full md:w-[50%] h-[30%] justify-evenly items-center mt-[50%] md:mt-[15%]">
        <button className="w-[40%] md:w-[30%] bg-purple-700 h-[35%] rounded-full text-glow text-white text-xl  font-bold font-sans hover:scale-[99.5%] active:scale-90 transition-transform duration-150 ease-out backdrop-blur-xl bg-gradient-to-br from-[#51367d] to-[#712fdc] shadow-[22px_22px_44px_#121214,-22px_-22px_44px_#34363c]  " onClick={navToLogin}>
          Log In
        </button>
        <button className="w-[40%] md:w-[30%] bg-blue-700 h-[35%] rounded-full text-glow text-white text-xl font-bold font-sans hover:scale-[99.5%] active:scale-90 transition-transform duration-150 ease-out backdrop-blur-xl bg-gradient-to-br from-[#36377d] to-[#2f3edc] shadow-[22px_22px_44px_#121214,-22px_-22px_44px_#34363c]" onClick={navToRegister}>
          Register
        </button>
      </div>
      <div className="absolute flex flex-row w-screen h-[8%] bottom-0 bg-[#141517]  shadow-[22px_22px_44px_#121214,-22px_-22px_44px_#34363c]"></div>
    </div>
  );
}

export default General