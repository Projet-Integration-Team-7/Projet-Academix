import React from "react";
import { FaWindowClose } from "react-icons/fa";
import { Button } from "../ui/button";

interface ModalSettingProps {
    openSetting: boolean;
    setOpenSetting: React.Dispatch<React.SetStateAction<boolean>>;
    pomodoroRef: any;
    shortBreakRef: any;
    longBreakRef: any;
    updateTimeDefaultValue: any;
}

/**
 * Composant ModalSetting
 * 
 * @param openSetting - Indique si le modal des paramètres est ouvert ou fermé
 * @param setOpenSetting - Fonction pour ouvrir ou fermer le modal des paramètres
 * @param pomodoroRef - Référence de l'input pour le temps du Pomodoro
 * @param shortBreakRef - Référence de l'input pour le temps de la petite pause
 * @param longBreakRef - Référence de l'input pour le temps de la longue pause
 * @param updateTimeDefaultValue - Fonction pour mettre à jour les valeurs par défaut des temps
 * @returns Le composant ModalSetting
 */
const ModalSetting: React.FC<ModalSettingProps> = ({
    openSetting,
    setOpenSetting,
    pomodoroRef,
    shortBreakRef,
    longBreakRef,
    updateTimeDefaultValue,
}) => {
    const inputs = [
        {
            value: "Pomodoro",
            ref: pomodoroRef,
            defaultValue: 25,
        },
        {
            value: "Petite pause",
            ref: shortBreakRef,
            defaultValue: 5,
        },
        {
            value: "Longue pause",
            ref: longBreakRef,
            defaultValue: 10,
        },
    ];

    /**
     * Gère le clic sur le modal pour empêcher la propagation de l'événement
     * 
     * @param e - L'événement de clic
     */
    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <>
            <div
                className={`absolute h-full w-full left-0 top-0 bg-black bg-opacity-30 ${openSetting ? "" : "hidden"}`}
                onClick={() => setOpenSetting(false)}
            >
                <div
                    className={`max-w-xl bg-green-300 font-mono absolute sn:w-96 w-11/12 left-1/2 top-1/2 p-5 rounded-md ${
                        openSetting ? "" : "hidden"
                    }`}
                    style={{ transform: "translate(-50%,-50%)" }}
                    onClick={handleModalClick} 
                >
                    <div
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        className="text-black-400 flex-justify items-center"
                    >
                        <h1 className="font-bold ">Paramétres de la minuterie</h1>
                        <FaWindowClose className="text-2xl cursor-pointer " onClick={() => setOpenSetting(false)} />
                    </div>
                    <div className="h-1 w-full bg-gray-400 mt-5 mb-20 ">
                        <div className="flex gap-5">
                            {inputs.map((input, index) => {
                                return (
                                    <div key={index}>
                                        <h1 className="text-black-400 text-sm font-bold mt-5 ">{input.value}</h1>
                                        <input
                                            defaultValue={input.defaultValue}
                                            type="number"
                                            className="w-full bg-white-400 opacity-62 py-2 rounded outline-none text-center "
                                            ref={input.ref}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <Button className="uppercase w-full mt-5 rounded py-2" onClick={updateTimeDefaultValue}>
                        Sauvegarder
                    </Button>
                </div>
            </div>
        </>
    );
};

export default ModalSetting;
