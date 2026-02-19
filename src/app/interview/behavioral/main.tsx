//Author: Brandon Christian
//Date: 12/12/2025

//Date: 1/31/2026
//send recorded audio for processing and receive

//Date 2/19/2026
//Move to main.tsx


"use client";
import { useState, useRef } from "react";
import styles from "./test.module.css";
import React from "react";
import { GetPrompt, CreateSession } from "./behavioralService";
import { BIStart } from "./start";
import { BIActive } from "./active";
import { BIEnd } from "./end";


//-------------------------------------
//  Functionality
//-------------------------------------

export async function OnStartInterviewClicked(): Promise<any> {

    //TODO:
    //Begin camera recording

    //Get Interview Prompt from server
    const prompt = await GetPrompt();

    if (!prompt.success) {
        console.log("Failed to get prompt.");

        throw new Error("Fetch Prompt Failed.")
    }

    //Create a new session on the server
    const newSession = await CreateSession();

    if (!newSession) {
        console.log("Failed to create new session!");

        throw new Error("Create Session Failed.");
    }

    console.log("New session created. ID: " + newSession.id);

    prompt.session = newSession;

    return prompt;
};

export function OnFailedStartInterview(error: any) {
    console.log(error);
}




export function OnFailedEndInterview() {
    console.log("Faled End Interview");
}

//-------------------------------------
//  View
//-------------------------------------


export function BehavioralInterview() {

   return (

        <main className={`${styles.centered_column} pt-12`}>
            <h1>Behavioral Interview Session</h1>
            <p className="description">
                Simulate an authentic interview experience.
                Your responses will be evaluated for clairty, tone, and professionalism in
                real time.
            </p>
            <ViewSwitcher />
            <br />
        </main>


    )
}


export enum BIPageState {
    START,
    ACTIVE,
    END
}

function ViewSwitcher() {

    /*
        Switch between page states for Before, During, and After the interview.
        Also pass recorded data and the prompt between page states.
    */

    const [pageState, setPageState] = useState(BIPageState.START);

    //Data maintained between page states
    const [interviewPrompt, setInterviewPrompt] = useState("no prompt.");
    const [sessionId, setSessionId] = useState("");
    const audioRef = useRef<Blob | null>(null);

    //use deferred promise so that BIEnd can wait until
    //the audio is ready from BIActive before attempting to upload
    function waitForAudio(): Promise<Blob> {
        return new Promise((resolve) => {
            if (audioRef.current) {
                resolve(audioRef.current);
                return;
            }

            const intervalDelay = 50;

            //wait for 50 ticks before checking again
            const interval = setInterval(() => {
                if (audioRef.current) {
                    clearInterval(interval);
                    resolve(audioRef.current);
                }
            }, intervalDelay);
        });
    }

    switch (pageState) {
        case BIPageState.START:
            return (<BIStart changeState={setPageState} changePrompt={setInterviewPrompt} audioRef={audioRef} setSessionId={setSessionId} />);

        case BIPageState.ACTIVE:
            return (<BIActive changeState={setPageState} prompt={interviewPrompt} audioRef={audioRef} />);

        case BIPageState.END:
            console.log("Loading END with id: " + sessionId);
            return (<BIEnd changeState={setPageState} waitForAudio={waitForAudio} sessionId={sessionId} />);
    }
}



