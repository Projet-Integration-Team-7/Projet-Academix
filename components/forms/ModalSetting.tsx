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
            value: "Short Break",
            ref: shortBreakRef,
            defaultValue: 5,
        },
        {
            value: "Long Break",
            ref: longBreakRef,
            defaultValue: 10,
        },
    ];

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
                    className={`max-w-xl bg-white absolute sn:w-96 w-11/12 left-1/2 top-1/2 p-5 rounded-md ${
                        openSetting ? "" : "hidden"
                    }`}
                    style={{ transform: "translate(-50%,-50%)" }}
                    onClick={handleModalClick} 
                >
                    <div
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        className="text-black-400 flex-justify items-center"
                    >
                        <h1 className="font-bold ">Time Settings</h1>
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
                                            className="w-full bg-gray-400 opacity-62 py-2 rounded outline-none text-center "
                                            ref={input.ref}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <Button className="uppercase w-full mt-5 rounded py-2" onClick={updateTimeDefaultValue}>
                        Save
                    </Button>
                </div>
            </div>
        </>
    );
};

export default ModalSetting;
