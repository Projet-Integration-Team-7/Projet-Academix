import React from "react"
export default function Alarm(){
    return(
        <audio controls>
        <source src="/alarm.mp3" type="audio/mp3" />
      </audio>
    )
}