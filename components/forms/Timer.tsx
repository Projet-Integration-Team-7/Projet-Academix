"use client"
import { CircularProgressbar,buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
interface TimerProps {
    stage: number;
    switchStage: (index: number) => void;
    getTickingTime: () => number;
    seconds :number;
    ticking : boolean
    setTicking: any 
}
export default function Timer({ stage, switchStage, getTickingTime,seconds,ticking,setTicking }: TimerProps) {
    const options =["Pomodoro","Short Break","Long Break"]
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
            <button className='px-16 py-2 text-2xl rounded-md bg-white uppercase font-bold' style={{ color: 'black' }} onClick={()=> setTicking((ticking : boolean) => !ticking)}>
    {ticking? "Stop" : "Start"}
</button>


        </div>
    );
}


