import { CircularProgressbar,buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function Timer() {
    const percentage = 66;

    return (

        <div >
<CircularProgressbar value={percentage} text={`${percentage}%`} />;

        </div>
    );
}

export default Timer;
