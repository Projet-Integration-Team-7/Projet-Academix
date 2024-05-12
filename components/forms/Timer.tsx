// Import des icônes et des composants nécessaires depuis React et d'autres bibliothèques
"use client"
import { IoIosVolumeOff } from "react-icons/io";
import 'react-circular-progressbar/dist/styles.css';
import { Button } from '../ui/button';
import { start } from "repl";

// Interface décrivant les propriétés attendues par le composant Timer
interface TimerProps {
    stage: number; // Le stade actuel du timer (Pomodoro, Petite Pause, Longue Pause)
    switchStage: (index: number) => void; // Fonction pour changer de stade
    getTickingTime: () => number; // Fonction pour obtenir le temps écoulé du timer
    seconds: number; 
    ticking: boolean; 
    startTimer: any; 
    isTimeUp: boolean; 
    muteAlarm: any; 
    reset: any;
}

// Définition du composant Timer
export default function Timer({ 
    stage, 
    switchStage, 
    getTickingTime, 
    seconds, 
    ticking, 
    startTimer, 
    isTimeUp, 
    muteAlarm, 
    reset
}: TimerProps) {

    // Options de stade du timer (Pomodoro, Petite Pause, Longue Pause)
    const options = ["Pomodoro", "Petite Pause", "Longue Pause"];

    return (
        // Conteneur principal du composant Timer, centré horizontalement et verticalement
        <div className='w-10/12 mx-auto pt-5 text-white font-mono flex flex-col justify-center items-center mt-10' >
            
            {/* Conteneur pour afficher les options de stade */}
            <div className='flex gap-5 items-center'>
                {options.map((option, index) => {
                    return (
                        <h1
                            key={index}
                            // Appliquer des styles différents au stade actif
                            className={`${
                                index === stage ? "bg-green-400 font bg-opacity-30" : ""
                            } p-1 cursor-pointer transition-all rounded`}
                            // Gestion de l'événement de clic pour changer de stade
                            onClick={() => switchStage(index)} 
                        >
                            {option}
                        </h1>
                    );
                })}
            </div>

            {/* Conteneur pour afficher le temps restant */}
            <div className='mt-10 mb-10'>
    <h1 className='text-[9rem] font-exotic font-bold text-green-300 select-none m-0'>
        {/* Affichage du temps écoulé et des secondes, formatées avec des zéros */}
        {getTickingTime()}:{seconds.toString().padStart(2, "0")}
    </h1>
</div>

            
            <div></div>

            {/* Conteneur pour afficher l'icône de volume lorsque le temps est écoulé */}
            <div>
                {isTimeUp && (
                    <IoIosVolumeOff
                        className="text-9xl text-white cursor-pointer"
                        onClick={muteAlarm}
                    />
                )}
            </div>

            {/* Conteneur pour afficher le bouton de démarrage/arrêt du timer */}
            <div className="my-10">
                <Button className="user-card_btn w-48 h-12 mx-2" onClick={startTimer}>
                    {/* Affichage dynamique du texte en fonction de l'état du timer */}
                    {ticking ? "Arrêter" : "Commencer"}
                </Button>
            </div>
  
            {/* Conteneur pour afficher le bouton de réinitialisation lorsque le timer est en cours */}
            {ticking && (
                <Button className="user-card_btn w-48 h-12 mx-2" onClick={reset}>
                    Réinitialiser
                </Button>
            )}
        </div>
        
    );
}


