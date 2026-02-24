//Author: Brandon Christian
//Date: 12/12/2025

//Date: 1/31/2026
//send recorded audio for processing and receive

//Date: 2/19/2026
//Move to active.tsx


import { useEffect } from "react";
import styles from "./test.module.css";
import React from "react";
import type { ReactNode } from "react";
import { AudioMeterAndCameraBox } from "./userInput"
import { BIPageState, OnFailedEndInterview } from "./main";


export function BIActive({ changeState, prompt, audioRef }: {
    changeState: React.Dispatch<React.SetStateAction<BIPageState>>;
    audioRef: React.RefObject<Blob | null>;
    prompt: string;
}) {
    useEffect(() => {
        audioRef.current = null;
    }, []);

    const EndInterviewButton = async () => {
        try {

            //Change state if successful, send data as we enter the next page
            //The audio data is triggered by the re-render for the next page state
            //A useEffect cleanUp for the audio recording will set the audioData as the new
            //Page is rendered

            changeState(BIPageState.END);

        } catch (error) {
            console.log(error);
            OnFailedEndInterview();
        }
    };

    const DisplayBox = ({ title, children }: { title: string; children: ReactNode }) => {

        return (
            <div className="outline-2 rounded w-full">
                <h2>{title}</h2>
                <hr />
                {children}
            </div>
        )
    };

    return (
        <div className={`${styles.centered_column} w-3/4`}>
            <AudioMeterAndCameraBox recordAudio={true} audioRef={audioRef} />
            <button className="orange_button" onClick={EndInterviewButton}>End Interview</button>
            <DisplayBox title="Interview Prompt">
                <p>
                    {prompt} 
                </p>
            </DisplayBox>
        </div>
    );
}




