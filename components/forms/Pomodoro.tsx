"use client"
import Navigation from '@/components/forms/Navigation';
import Timer from '@/components/forms/Timer';
import React, {useEffect, useState,useRef} from "react";
import Alarm from './Alarm';
import ModalSetting from './ModalSetting';
export default function Pomodoro (){
    /**
     * Variable d'état pour la durée de la session Pomodoro.
     * @type {number}
     */
    const [pomodoro,setPomodoro]=useState(25)

    /**
     * Variable d'état pour la durée de la pause courte.
     * @type {number}
     */
    const [shortBreak,setShortBreak]=useState(5)

    /**
     * Variable d'état pour la durée de la pause longue.
     * @type {number}
     */
    const [longBreak,setLongBreak]=useState(10)

    /**
     * Nombre de secondes écoulées.
     * @type {number}
     */
    const[seconds,setSecond]=useState(0);

    /**
     * Étape actuelle de la session Pomodoro (0 pour travail, 1 pour pause courte, 2 pour pause longue).
     * @type {number}
     */
    const [stage, setStage]=useState(0);

    /**
     * Nombre total de secondes écoulées pendant la session Pomodoro.
     * @type {number}
     */
    const [consumedSecond,setConsumedSecond]=useState(0);

    /**
     * Indique si le minuteur est en cours d'exécution.
     * @type {boolean}
     */
    const[ticking,setTicking]=useState(false);

    /**
     * Référence à l'élément audio pour le son de l'alarme.
     * @type {React.MutableRefObject<HTMLAudioElement>}
     */
    const alarmRef= useRef<HTMLAudioElement>(null)

    /**
     * Indique si le modal des réglages est ouvert.
     * @type {boolean}
     */
    const[openSetting,setOpenSetting]=useState(false)

    /**
     * Indique si le temps est écoulé pour l'étape actuelle.
     * @type {boolean}
     */
    const [isTimeUp,setIsTimeUp]=useState(false)

    /**
     * Référence au champ d'entrée pour la durée Pomodoro.
     * @type {React.MutableRefObject<undefined>}
     */
    const pomodoroRef=useRef()

    /**
     * Référence au champ d'entrée pour la durée de la pause courte.
     * @type {React.MutableRefObject<undefined>}
     */
    const shortBreakRef=useRef()

    /**
     * Référence au champ d'entrée pour la durée de la pause longue.
     * @type {React.MutableRefObject<undefined>}
     */
    const longBreakRef=useRef()

    /**
     * Fonction pour mettre à jour les réglages par défaut en fonction de l'entrée utilisateur.
     */
    const updateTimeDefaultValue =() =>
    {
        setPomodoro(pomodoroRef.current.value);
        setShortBreak(shortBreakRef.current.value);
        setLongBreak(longBreakRef.current.value)
        setOpenSetting(false)
    }   

    /**
     * Fonction pour passer à une autre étape de la session Pomodoro.
     * @param {number} index - L'index de l'étape à passer.
     */
    const switchStage=(index : number) =>{
        const isYes=consumedSecond && stage!== index ? confirm ("Êtes-vous sûr de vouloir changer")
        : false
        if(isYes){
            reset();
            setStage(index)
        }else if(!consumedSecond){
            setStage(index);
        }
        setStage(index)
    }

    /**
     * Fonction pour démarrer ou mettre en pause le minuteur.
     */
    const startTimer=() =>{
       setIsTimeUp(false)
       muteAlarm()
       setTicking((ticking)=> !ticking)
    }

    /**
     * Fonction pour récupérer la durée de l'étape actuelle.
     * @returns {number} La durée de l'étape actuelle en minutes.
     */
    const getTickingTime=() =>{
        const timeStage: { [key: number]: number } = {
            0:pomodoro,
            1:shortBreak,
            2:longBreak
        }
        return timeStage[stage]
    }

    /**
     * Fonction pour mettre à jour la durée de l'étape actuelle.
     */
    const updateMinute = () => {
        const updateStage: { [key: number]: React.Dispatch<React.SetStateAction<number>> } = {
            0: setPomodoro,
            1: setShortBreak,
            2: setLongBreak
        };
    
        return updateStage[stage as 0 | 1 | 2];
    };
    
    /**
     * Fonction pour réinitialiser la session Pomodoro.
     */
    const reset =()=>{
        setConsumedSecond(0)
        setTicking(false)
        setPomodoro(25)
        setLongBreak(10)
        setShortBreak(5)
        setSecond(0)
    }

    /**
     * Fonction pour gérer la fin du temps imparti.
     */
    const timeUp =() =>{
        reset();
        setIsTimeUp(true)
        if(alarmRef.current){
            alarmRef.current.play()

        }else{
            console.error("référence non définie")
        }
    };

    /**
     * Fonction pour faire avancer le minuteur.
     */
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

    /**
     * Fonction pour désactiver l'alarme.
     */
    const muteAlarm =() =>{
        if(alarmRef.current){
            alarmRef.current.pause();
            alarmRef.current.currentTime=0;
        }else{
            console.error("référence non définie")
        }
    }

    /**
     * Effet pour gérer les comportements lorsque la page se ferme.
     */
    useEffect(() => {
        window.onbeforeunload = () => {
            return consumedSecond ? "Voulez-vous vraiment quitter ? Des données non sauvegardées seront perdues." : null
        }

        const timer=setInterval(() => {
            if(ticking){
                setConsumedSecond(value => value+1)
                clockTicking();
            }
        }, 1000);    
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
          
