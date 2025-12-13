//Author: Brandon Christian
//Date: 12/12/2025


"use client";
import { useState } from "react";
import styles from "./test.module.css";
import React from "react";
import type { ReactNode } from "react";

//-------------------------------------
//  Functionality
//-------------------------------------

async function OnStartInterviewClicked(): Promise<string> {

    //TODO:
    //Establish connection to server
    //Begin camera and audio recording

    //return stub promise
    return new Promise((resolve) => {
        setTimeout(() => resolve("Connection successful!"), 10);
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

    switch (pageState) {
        case BIPageState.START:
            return (<BIStart changeState={setPageState} />);

        case BIPageState.ACTIVE:
            return (<BIActive changeState={setPageState} changeFeedbackData={setFeedbackData} />);

        case BIPageState.END:
            return (<BIEnd changeState={setPageState} data={feedbackData} />);
    }
}

function BIStart({ changeState } : { changeState: React.Dispatch<React.SetStateAction<BIPageState>> }) {

    const StartInterviewButton = async () => {
        try {
            //Try and Wait For Upload
            const result = await OnStartInterviewClicked();
            console.log(result);

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

function BIActive({ changeState, changeFeedbackData }: {
    changeState: React.Dispatch<React.SetStateAction<BIPageState>>;
    changeFeedbackData: React.Dispatch<React.SetStateAction<FeedbackItem[]>>;
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

    return (
        <div className={`${styles.centered_column} w-full`}>
            <CameraBox />
            <button className="orange_button" onClick={EndInterviewButton}>End Interview</button>
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

import { useEffect, useRef } from "react";

function CameraBox() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let stream: MediaStream;

        async function startCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                setError('Camera access denied or unavailable');
                console.error(err);
            }
        }

        startCamera();

        return () => {
            // Stop camera when component unmounts
            stream?.getTracks().forEach(track => track.stop());
        }
    }, [])

    if (error) {
        return <p>{error}</p>
    }

    return (
        <div className={`${styles.centered_column} outline-2 rounded w-3/4 p-2`}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-w-md rounded"
            />
            <AudioMeter/>
        </div>
       
    )
}

function AudioMeter() {
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number | null>(null);

    const [level, setLevel] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let stream: MediaStream;

        async function startAudio() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                
                const audioContext = new AudioContext();
                const source = audioContext.createMediaStreamSource(stream);
                const analyser = audioContext.createAnalyser();

                analyser.fftSize = 256;

                source.connect(analyser);

                audioContextRef.current = audioContext;
                analyserRef.current = analyser;

                const dataArray = new Uint8Array(analyser.frequencyBinCount);

                const updateMeter = () => {
                    analyser.getByteTimeDomainData(dataArray);

                    // RMS (volume)
                    let sumSquares = 0;
                    for (let i = 0; i < dataArray.length; i++) {

                        const val = dataArray?.[i] ?? 128;
                        const v = (val - 128) / 128;
                        sumSquares += v * v;
                    }

                    const rms = Math.sqrt(sumSquares / dataArray.length);
                    setLevel(Math.min(100, Math.round(rms * 100)));

                    animationRef.current = requestAnimationFrame(updateMeter);
                }

                updateMeter();
            } catch (err) {
                setError('Microphone access denied or unavailable');
                console.error(err);
            }
        }

        startAudio();

        return () => {
            stream?.getTracks().forEach(track => track.stop());
            audioContextRef.current?.close();
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        }
    }, [])

    if (error) return <p>{error}</p>

    return (
        <div className="w-48">
            <div className="h-3 bg-gray-300 rounded">
                <div
                    className="h-3 bg-green-500 rounded transition-all"
                    style={{ width: `${level}%` }}
                />
            </div>
            <p className="text-sm mt-1">Level: {level}%</p>
        </div>
    )
}

function RecordedVideoBox() {
    return (
        <div className={`${styles.centered_column} outline-2 rounded w-3/4 p-2`}>
            <VideoPlayer/>
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