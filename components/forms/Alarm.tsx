import React from "react";

interface AlarmProps {

  ref: React.RefObject<HTMLAudioElement>;
}

const Alarm = React.forwardRef((props: AlarmProps, ref: React.Ref<HTMLAudioElement>) => {
  return (
    <audio ref={ref}>
      <source src="/alarm.mp3" type="audio/mp3" />
    </audio>
  );
});

export default Alarm;
