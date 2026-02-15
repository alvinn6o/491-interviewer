//Author: Brandon Christian
//Date: 12/12/2025

//Date: 1/31/2026
//send recorded audio for processing and receive


"use client";
import { useState, useEffect } from "react";
import styles from "./test.module.css";
import React from "react";
import type { ReactNode } from "react";
import { CameraBox } from "./userInput"
import { SendAudioToServer } from "./behavioralService";
import { FeedbackCategory } from "./feedbackItem";
import type { FeedbackItem } from "./feedbackItem";


//-------------------------------------
//  Functionality
//-------------------------------------

async function OnStartInterviewClicked(): Promise<string> {

    //TODO:
    //Establish connection to server
    //Begin camera and audio recording
    //Get Interview Prompt from server

    //dummy data in place of actual response
    const prompt = "This is where I would place the interview question or prompt. If I had one!";

    //return stub promise
    return new Promise((resolve) => {
        setTimeout(() => resolve(prompt), 10);
    });
};

function OnFailedStartInterview() {
    console.log("Faled Upload");
}


async function OnEndInterviewClicked(audioData: Blob): Promise<FeedbackItem[]> {
    //Send audio and camera to server
    //Receive analysis/feedback
    //page.tsx > behavioralService.tsx > api/behavioral/uploadAudio/route.ts
    const fbItems: FeedbackItem[] = await SendAudioToServer(audioData);

    return new Promise((resolve) => {
        setTimeout(() => resolve(fbItems), 10);
    });
};

function OnFailedEndInterview() {
    console.log("Faled End Interview");
}

//-------------------------------------
//  View
//-------------------------------------


export default function BehavioralInterview() {

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


enum BIPageState {
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

    const [interviewPrompt, setInterviewPrompt] = useState("no prompt.");

    const [audioData, setAudio] = useState(new Blob());

    switch (pageState) {
        case BIPageState.START:
            return (<BIStart changeState={setPageState} changePrompt={setInterviewPrompt} />);

        case BIPageState.ACTIVE:
            return (<BIActive changeState={setPageState} prompt={interviewPrompt} setAudio={setAudio} />);

        case BIPageState.END:
            return (<BIEnd changeState={setPageState} audioData={audioData} />);
    }
}

function BIStart({ changeState, changePrompt }: {
    changeState: React.Dispatch<React.SetStateAction<BIPageState>>;
    changePrompt: React.Dispatch<React.SetStateAction<string>>;
}) {

    //Unused setAudio, only here so that the non-recording mic display doesn't complain.
    const [audioData, setAudio] = useState(new Blob());

    const StartInterviewButton = async () => {
        try {
            //Try and Wait For Upload
            const result = await OnStartInterviewClicked();

            //Set response as prompt
            changePrompt(result);

            //Change state if successful
            changeState(BIPageState.ACTIVE);
        } catch (error) {
            OnFailedStartInterview();
        }
    };

    return (
        <div className={`${styles.centered_column} w-full`}>
            <CameraBox recordAudio={false} setAudio={setAudio} />
            <button className="orange_button" onClick={StartInterviewButton}>Start Interview</button>
        </div>
    );
}

function BIActive({ changeState, prompt, setAudio }: {
    changeState: React.Dispatch<React.SetStateAction<BIPageState>>;
    setAudio: React.Dispatch<React.SetStateAction<Blob>>;
    prompt: string;
}) {


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
            <CameraBox recordAudio={true} setAudio={setAudio} />
            <button className="orange_button" onClick={EndInterviewButton}>End Interview</button>
            <DisplayBox title="Interview Prompt">
                <p>
                    {prompt} 
                </p>
            </DisplayBox>
        </div>
    );
}

function BIEnd({ changeState, audioData }: {
    changeState: React.Dispatch<React.SetStateAction<BIPageState>>;
    audioData: Blob;
}) {
    //Helps set useState typing
    const test_items = [
        { key: FeedbackCategory.NONE, content: "Eye Contact", score: 1 }
    ];

    //Modified for UC 1 to include loading and error states
    const [data, setFeedbackData] = useState(test_items);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => { //Call once on page state load

        async function UploadAudio() {
            try {
                setLoading(true);

                //Try and Wait For Upload
                //Send the audio data previously set by the useEffect cleanup in
                //The Active page state to the server to be transcribed.
                const result = await OnEndInterviewClicked(audioData);

                //store data in useState
                setFeedbackData(result);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                setError(true);
                console.error(err);
            }
        }

        UploadAudio();

        
    },

    [])

    const RestartInterviewButton = async () => {
        changeState(BIPageState.START);
    };

    const DataDisplay = ({ data }: { data: FeedbackItem[] }) => {

        const notes = data.filter(item => item.key === FeedbackCategory.NOTES);
        const otherData = data.filter(item => item.key !== FeedbackCategory.NOTES);

        const DisplayBox = ({ title, children }: { title: string; children: ReactNode }) => {

            return (
                <div className="outline-2 rounded w-full">
                    <h2>{title}</h2>
                    <hr/>
                    {children}
                </div>
            )
        };

        const FeedbackList = ({ data }: { data: FeedbackItem[] }) => {

            const splitFeedback = (data: FeedbackItem[]) => {
                const middle = Math.ceil(data.length / 2); // rounds up if odd
                const firstHalf = data.slice(0, middle);
                const secondHalf = data.slice(middle);

                return [firstHalf, secondHalf];
            };

            const [firstHalf, secondHalf] = splitFeedback(data);

            return (
                <div className="flex flex-row gap-4 p-2">
                    <div className="flex flex-col">
                        {firstHalf?.map(

                            (item, i) => (
                                <div key={`${i}`} className="p-1">
                                    <h3>{item.key}</h3>
                                    <span>{item.score.toString()}</span>
                                </div>
                            )
                        )}
                    </div>
                    <div className="flex flex-col">
                        {secondHalf?.map(

                            (item, i) => (
                                <div key={`${i}`} className="p-1">
                                    <h3>{item.key}</h3>
                                    <span>{item.score.toString()}</span>
                                </div>
                            )
                        )}
                    </div>
                </div>
            );

        };

        return (
            <div className="w-3/4 flex flex-row gap-4">
                <DisplayBox title="Notes">
                    {notes[0]?.content}
                </DisplayBox>

                <DisplayBox title="Statistics">
                    <FeedbackList data={otherData}/>
                </DisplayBox>
            </div>
        );
    };

    return (
        <div className={`${styles.centered_column} w-full`}>
            <RecordedVideoBox />
            <button className="orange_button" onClick={RestartInterviewButton}>Restart Interview</button>

            {loading && (
                <div>
                Loading feedback...
                </div>
            )}

            {!loading && !error && (
                <DataDisplay data={data} />
            )}

            {error  && (
                <div>
                    Failed to load feedback!
                </div>
            )}

            
        </div>
    );

}

function RecordedVideoBox() {
    return (
        <div className={`${styles.centered_column} outline-2 rounded w-3/4 p-2`}>
            <VideoPlayer />
        </div>
    );
}

interface VideoPlayerProps {
    src?: string;
    width?: number;
    height?: number;
    controls?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    src,
    width = 640,
    height = 360,
    controls = true,
}) => {
    return (
        <video
            width={width}
            height={height}
            controls={controls}
            style={{
                backgroundColor: "#000", // shows black box if no video
                display: "block",
            }}
        >
            {src ? <source src={src} type="video/mp4" /> : null}
            Your browser does not support the video tag.
        </video>
    );
};



