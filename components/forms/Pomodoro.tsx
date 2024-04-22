"use client"
import Navigation from '@/components/forms/Navigation';
import Timer from '@/components/forms/Timer';
import React, {useEffect, useState} from "react";

export default function Pomodoro (){
    const [pomodoro,setPomodoro]=useState(25)
    const [shortBreak,setShortBreak]=useState(5)
    const [longBreak,setLongBreak]=useState(10)
    const[seconds,setSecond]=useState(0);
    const [stage, setStage]=useState(0);
    const[ticking,setTicking]=useState(false);
    const switchStage=(index : number) =>{
        setStage(index)
    }
   
    const getTickingTime=() =>{
        const timeStage: { [key: number]: number } = {
            0:pomodoro,
            1:shortBreak,
            2:longBreak
        }
        return timeStage[stage]
    }
    const updateMinute = () => {
        const updateStage: { [key: number]: React.Dispatch<React.SetStateAction<number>> } = {
            0: setPomodoro,
            1: setShortBreak,
            2: setLongBreak
        };
    
        return updateStage[stage as 0 | 1 | 2];
    };
    
   const clockTicking =() =>{
    const minutes=getTickingTime();
    const setMinutes=updateMinute();
    if(minutes===0 && seconds===0){
           alert("Time up");
}else if (seconds ===0){
     setMinutes((minute) => minute-1)
     setSecond(59);
   }else{
    setSecond((second) => second-1);
   
}
   }
    useEffect(() =>{
      
      
      
        const timer=setInterval(() =>{
            if(ticking){
            clockTicking();
            }
        },1000);
    
    
        return() =>  {


    clearInterval(timer);
       };
},[seconds,pomodoro,shortBreak,longBreak,ticking]);

      return (

        <section>
            <h1  className="head-text mb-10"> Timer   </h1>
            <section className="mt-10 flex flex-col gap-5">
              <div className='max-w-2xl min-h-screen mx-auto'>
              <Navigation/>
              <Timer stage={stage} 
              switchStage={switchStage}
               getTickingTime={getTickingTime}
               seconds={seconds}
               ticking ={ticking}
               setTicking={setTicking}
               />
              </div>
            </section>
            </section>
            )}
          
