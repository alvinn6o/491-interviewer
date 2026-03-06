//Author: Brandon Christian
//Date: 12/12/2025

//Date: 1/31/2026
//send recorded audio for processing and receive

//Date: 2/19/2025
//Move to end.tsx

import { useState, useEffect } from "react";
import styles from "./test.module.css";
import React from "react";
import type { ReactNode } from "react";
import { FeedbackCategory } from "./feedbackItem";
import type { FeedbackItem } from "./feedbackItem";
import { BIPageState } from "./main";
import { SendAudioToServer , EndSession} from "./behavioralService";

export function BIEnd({ changeState, waitForAudio, sessionId }: {
    changeState: React.Dispatch<React.SetStateAction<BIPageState>>;
    waitForAudio: () => Promise<Blob>;
    sessionId: string;
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

        console.log("CALLING USE EFFECT FOR BI END");

        async function UploadAudio() {
            try {
                setLoading(true);

                //Try and Wait For Upload
                //Send the audio data previously set by the useEffect cleanup in
                //The Active page state to the server to be transcribed.
                console.log("Waiting for audioData to resolve.")

                const audioData = await waitForAudio(); //await for the audio data to be sent by BIActive

                console.log("Waiting for audioData to be analyzed with session ID: " + sessionId)

                const result = await SendAudioToServer(audioData);      //await for the audio data to be uploaded
                const updatedSession = await EndSession(sessionId);   //update session with completed state

                console.log("Completed audio upload and session end.")

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



