//Author: Brandon Christian
//Date: 12/12/2025

//Date: 1/31/2026
//send recorded audio for processing and receive


"use client";
import { useState } from "react";
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

    const [pageState, setPageState] = useState(BIPageState.START);

    //Helps set useState typing
    const test_items = [
        { key: FeedbackCategory.NONE, content: "Eye Contact", score: 1}
    ];

    const [feedbackData, setFeedbackData] = useState(test_items);

    const [interviewPrompt, setInterviewPrompt] = useState("no prompt.");



    switch (pageState) {
        case BIPageState.START:
            return (<BIStart changeState={setPageState} changePrompt={setInterviewPrompt} />);

        case BIPageState.ACTIVE:
            return (<BIActive changeState={setPageState} changeFeedbackData={setFeedbackData} prompt={interviewPrompt}/>);

        case BIPageState.END:
            return (<BIEnd changeState={setPageState} data={feedbackData} />);
    }
}

function BIStart({ changeState, changePrompt }: {
    changeState: React.Dispatch<React.SetStateAction<BIPageState>>;
    changePrompt: React.Dispatch<React.SetStateAction<string>>;
}) {

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

function BIActive({ changeState, changeFeedbackData, prompt }: {
    changeState: React.Dispatch<React.SetStateAction<BIPageState>>;
    changeFeedbackData: React.Dispatch<React.SetStateAction<FeedbackItem[]>>;
    prompt: string;
}) {

    const [audioData, setAudio] = useState(new Blob());

    const EndInterviewButton = async () => {
        try {
            //Try and Wait For Upload
            const result = await OnEndInterviewClicked(audioData);

            //store data in useState
            changeFeedbackData(result);

            //Change state if successful
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

function BIEnd({ changeState, data }: {
    changeState: React.Dispatch<React.SetStateAction<BIPageState>>;
    data: FeedbackItem[];
}) {

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
            <DataDisplay data={data}/>
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



