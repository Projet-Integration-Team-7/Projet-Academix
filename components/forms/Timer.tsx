"use client"
import { IoIosVolumeOff } from "react-icons/io";

import 'react-circular-progressbar/dist/styles.css';
import { Button } from '../ui/button';
import { start } from "repl";
interface TimerProps {
    stage: number;
    switchStage: (index: number) => void;
    getTickingTime: () => number;
    seconds :number;
    ticking : boolean
    startTimer: any
    isTimeUp : boolean
    muteAlarm : any
    reset : any
}    
export default function Timer({ stage, 
    switchStage,
     getTickingTime,
     seconds,
     ticking,
     startTimer,
     isTimeUp,
     muteAlarm,
     reset
    }:

      TimerProps) 
      {
    const options =["Pomodoro","Petite Pause","Longue Pause"]
    return (

        <div className='w-10/12 mx-auto pt-5 text-white flex flex-col justify-center items-center mt-10' >
            <div className='flex gap-5 items-center'>
            {options.map((option, index)=>{
                return(
                    <h1
                    key={index}
                    className={` ${
                        index===stage ?"bg-gray-500 bg-opacity-30" : ""
                    } p-1 cursor-pointer transition-all rounded`
               
                }
                onClick={()=> switchStage(index)} 
                    
                    >
                        
                        {option}
                    </h1>
                );
            }
            )
            }    
            </div>
            <div className='mt-10 mb-10'>
            <h1 className='text-[9rem] font-bold select-none m-0'>
    {getTickingTime()}:{seconds.toString().padStart(2,"0")}
</h1>
            </div>
            
            <div></div>
<div>
            {isTimeUp && (
        <IoIosVolumeOff
        className="text-9xl text-white cursor-pointer"
        onClick={muteAlarm}
        />
    
    ) }
    </div>
    <div className="my-10">
            <Button className="user-card_btn w-48 h-12 mx-2"  
            onClick={startTimer}>

    {ticking? "Arrêter" : "Commencer"}
    </Button>
    </div>
{ticking &&(
 <Button className="user-card_btn w-48 h-12 mx-2"
 onClick={reset}>
 Réinitialiser
</Button>
) }
   
        </div>
    );
}


