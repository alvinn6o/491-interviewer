//Author: Brandon Christian
//Date: 12/12/2025


"use client";
import { useState } from "react";
import styles from "./test.module.css";
import React from "react";
import type { ReactNode } from "react";
import { CameraBox, AudioMeter, RecordedVideoBox, VideoPlayer } from "./userInput"

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



enum FeedbackCategory {
    NONE = "None",
    NOTES = "Notes",
    EYE_CONTACT = "Eye Contact",
    CONFIDENCE = "Confidence",
    QUALITY_OF_ANSWERS = "Quality of Answers",
    SOCIABILITY = "Sociability",
    CLEAR_SPEECH = "Clear Speech"

}

type FeedbackItem = {
    key: FeedbackCategory,
    content: string,
    score: number
}

async function OnEndInterviewClicked(): Promise<FeedbackItem[]> {

    //TODO:
    //Send audio and camera to server
    //Request analysis and receive feedback

    //test items in place of actual data
    const test_items = [
        { key: FeedbackCategory.NOTES, content: "Example paragraph. This is where you will see a description of your interview.", score : 1 },
        { key: FeedbackCategory.EYE_CONTACT, content: "", score : 1 },
        { key: FeedbackCategory.CONFIDENCE, content: "", score : 2 },
        { key: FeedbackCategory.QUALITY_OF_ANSWERS, content: "", score : 3 },
        { key: FeedbackCategory.SOCIABILITY, content: "", score : 4 },
        { key: FeedbackCategory.CLEAR_SPEECH, content: "", score : 5 },

    ];

    //return stub promise
    return new Promise((resolve) => {
        setTimeout(() => resolve(test_items), 10);
    });
};

function OnFailedEndInterview() {
    console.log("Faled Upload");
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
            return (<BIActive changeState={setPageState} changeFeedbackData={setFeedbackData} prompt={interviewPrompt} />);

        case BIPageState.END:
            return (<BIEnd changeState={setPageState} data={feedbackData} />);
    }
}

function BIStart({ changeState, changePrompt }: {
    changeState: React.Dispatch<React.SetStateAction<BIPageState>>;
    changePrompt: React.Dispatch<React.SetStateAction<string>>;
}) {

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
            <CameraBox />
            <button className="orange_button" onClick={StartInterviewButton}>Start Interview</button>
        </div>
    );
}

function BIActive({ changeState, changeFeedbackData, prompt }: {
    changeState: React.Dispatch<React.SetStateAction<BIPageState>>;
    changeFeedbackData: React.Dispatch<React.SetStateAction<FeedbackItem[]>>;
    prompt: string;
}) {


    const EndInterviewButton = async () => {
        try {
            //Try and Wait For Upload
            const result = await OnEndInterviewClicked();

            //store data in useState
            changeFeedbackData(result);

            //Change state if successful
            changeState(BIPageState.END);
        } catch (error) {
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
            <CameraBox />
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


