import React from "react";

interface AlarmProps {

  ref: React.RefObject<HTMLAudioElement>;
}

/**
 * Composant Alarme.
 * 
 * Ce composant représente une alarme audio.
 * 
 * @component
 * @param {AlarmProps} props - Les propriétés du composant.
 * @param {React.Ref<HTMLAudioElement>} ref - La référence vers l'élément audio.
 * @returns {JSX.Element} Le composant Alarme.
 */
const Alarm = React.forwardRef((props: AlarmProps, ref: React.Ref<HTMLAudioElement>) => {
  return (
    <audio ref={ref}>
      <source src="/alarm.mp3" type="audio/mp3" />
    </audio>
  );
});

export default Alarm;
