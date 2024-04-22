"use client"
import Navigation from '@/components/forms/Navigation';
import Timer from '@/components/forms/Timer';
import React, {useState} from "react";

export default function Pomodoro (){
    const [pomodoro,setPomodoro]=useState(25)
    const [shortBreak,setShortBreak]=useState(5)
    const [longBreak,setLongBreak]=useState(10)
    const [stage, setStage]=useState(0);
    const switchStage=(index : number) =>{
        setStage(index)
    }

   


      return (

        <section>
            <h1  className="head-text mb-10"> Timer   </h1>
            <section className="mt-10 flex flex-col gap-5">
              <div className='max-w-2xl min-h-screen mx-auto'>
              <Navigation/>
              <Timer stage={stage} switchStage={switchStage}/>
              </div>
            </section>
            </section>
            )}
          
