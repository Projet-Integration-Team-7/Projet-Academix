"use client"
import Navigation from '@/components/forms/Navigation';
import Timer from '@/components/forms/Timer';
import React, {useEffect, useState,useRef} from "react";
import Alarm from './Alarm';
import ModalSetting from './ModalSetting';
export default function Pomodoro (){
    const [pomodoro,setPomodoro]=useState(25)
    const [shortBreak,setShortBreak]=useState(5)
    const [longBreak,setLongBreak]=useState(10)
    const[seconds,setSecond]=useState(0);
    const [stage, setStage]=useState(0);
    const [consumedSecond,setConsumedSecond]=useState(0);
    const[ticking,setTicking]=useState(false);
    const alarmRef= useRef<HTMLAudioElement>(null)
    const[openSetting,setOpenSetting]=useState(false)
    const [isTimeUp,setIsTimeUp]=useState(false)
    const pomodoroRef=useRef()
    const shortBreakRef=useRef()
  const longBreakRef=useRef()
  const updateTimeDefaultValue =() =>
{
    setPomodoro(pomodoroRef.current.value);
    setShortBreak(shortBreakRef.current.value);
    setLongBreak(longBreakRef.current.value)
    setOpenSetting(false)
}   
const switchStage=(index : number) =>{
        const isYes=consumedSecond && stage!== index ? confirm ("Are you sure to switch")
        : false
        if(isYes){
            reset();
            setStage(index)
        }else if(!consumedSecond){
            setStage(index);
        }
        setStage(index)
    }
   const startTimer=() =>{
       setIsTimeUp(false)
       muteAlarm()
       setTicking((ticking)=> !ticking)
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
    
const reset =()=>{
    setConsumedSecond(0)
    setTicking(false)
    setPomodoro(25)
    setLongBreak(10)
    setShortBreak(5)
    setSecond(0)
}
const timeUp =() =>{
 reset();
 setIsTimeUp(true)
 if(alarmRef.current){
    alarmRef.current.play()

 }else{
    console.error("ref pas defini")
 }
};
   const clockTicking =() =>{
    const minutes=getTickingTime();
    const setMinutes=updateMinute();
    if(minutes===0 && seconds===0){
        timeUp()
}else if (seconds ===0){
     setMinutes((minute) => minute-1)
     setSecond(59);
   }else{
    setSecond((second) => second-1);
   
}
   }
   const muteAlarm =() =>{
    if(alarmRef.current){
    alarmRef.current.pause();
    alarmRef.current.currentTime=0;
    }else{
        console.error("ref pas defini")
     }
   }
    useEffect(() =>{
      
      
      window.onbeforeunload = () =>{
        return consumedSecond ?"show waring " : null
      }

        const timer=setInterval(() =>{
            if(ticking){
                setConsumedSecond(value => value+1)
            clockTicking();
            }
        },1000);    
        return() =>  {
    clearInterval(timer);
       };
},[seconds,pomodoro,shortBreak,longBreak,ticking]);
      return (

        <section>
            <h1  className="head-text mb-10">   </h1>
            <section className="mt-10 flex flex-col gap-5">
              <div className='max-w-2xl min-h-screen mx-auto'>
              <Navigation setOpenSetting={setOpenSetting}/>
              <Timer stage={stage} 
              switchStage={switchStage}
               getTickingTime={getTickingTime}
               seconds={seconds}
               ticking ={ticking}
               startTimer={startTimer}
               isTimeUp={isTimeUp}
               muteAlarm={muteAlarm}
               reset={reset}
               />
              <Alarm ref={alarmRef}/>
              <ModalSetting 
              openSetting={openSetting} 
              setOpenSetting={setOpenSetting}
              pomodoroRef={pomodoroRef}
              shortBreakRef={shortBreakRef}
              longBreakRef={longBreakRef}
              updateTimeDefaultValue={updateTimeDefaultValue}/>
         
              </div>
            </section>
            </section>
            )}
          
