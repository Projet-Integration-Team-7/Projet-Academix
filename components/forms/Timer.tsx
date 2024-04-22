import { CircularProgressbar,buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function Timer() {
const options =["Pomodoro","Short Break","Long Break"]
    return (

        <div className='w-10/12 mx-auto pt-5 text-white flex flex-col justify-center items-center mt-10' >
            <div className='flex gap-5 items-center'>
            {options.map((option, index)=>{
                return(
                    <h1
                    key={index}
                    className={` ${
                        index===0 ?"bg-gray-500 bg-opacity-30" : ""
                    } p-1 cursor pointer transition-all rounded`
                
                }
                    
                    
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
    25:00
</h1>
            </div>
            <button className='px-16 py-2 text-2xl rounded-md bg-white uppercase font-bold' style={{ color: 'black' }}>
    Start
</button>


        </div>
    );
}

export default Timer;
