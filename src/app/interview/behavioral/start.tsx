//Author: Brandon Christian
//Date: 12/12/2025

//Date: 1/31/2026
//send recorded audio for processing and receive

//Date: 2/19/2026
//Move to start.tsx

import styles from "./test.module.css";
import React from "react";
import { CameraBox } from "./userInput";
import { BIPageState, OnStartInterviewClicked, OnFailedStartInterview } from "./main";



export function BIStart({ changeState, changePrompt, audioRef, setSessionId }: {
    changeState: React.Dispatch<React.SetStateAction<BIPageState>>;
    changePrompt: React.Dispatch<React.SetStateAction<string>>;
    audioRef: React.RefObject<Blob | null>; //Unused but necessary for the component format
    setSessionId: React.Dispatch<React.SetStateAction<string>>;
}) {

    const StartInterviewButton = async () => {
        try {
            //Try and Wait For Upload
            const result = await OnStartInterviewClicked();

            //Set response as prompt
            changePrompt(result.prompt);

            console.log("setting id: " + result.session.id);

            setSessionId(result.session.id)

            //Change state if successful
            changeState(BIPageState.ACTIVE);
        } catch (error) {

            OnFailedStartInterview(error);

        }
    };

    return (
        <div className={`${styles.centered_column} w-full`}>
            <CameraBox recordAudio={false} audioRef={audioRef} />
            <button className="orange_button" onClick={StartInterviewButton}>Start Interview</button>
        </div>
    );
}