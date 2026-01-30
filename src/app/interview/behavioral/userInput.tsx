//Author: Brandon Christian
//Date: 12/12/2025
//Initial Creation

//Date: 1/29/2026
//Modified to record audio input
//Add functions StartRecording, StopRecording, SendAudioToServer, SetupAudioAsync
//Modify functions AudioMeter

import { useEffect, useRef } from "react";
import { useState } from "react";
import styles from "./test.module.css";

export function CameraBox() {
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
            <AudioMeter />
        </div>

    )
}

export function AudioMeter() {
    const [level, setLevel] = useState(0);
    const [error, setError] = useState<string | null>(null);

    //Wrap AudioSetup in async so the cleanup
    //can be called synchronously
    useEffect(() => {
        let cleanup: (() => void) | undefined;

        (async () => {
            cleanup = await SetupAudioAsync(setError, setLevel);
        })();

        return () => {
            cleanup?.();
        };
    }, []); //array empty so it runs automatically on render
     
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

//Setup audio meter and audio recording
async function SetupAudioAsync(
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    setLevel: React.Dispatch<React.SetStateAction<number>>
)
{
    try {
        const stream: MediaStream = await StartStream(); //create audio stream
        const StopMeter = await StartAudioMeter(stream, setLevel); //start and return cleanup func

        //Meter Visuals

        let mediaRecorder: MediaRecorder = new MediaRecorder(stream);
        let chunks: Blob[] = StartRecording(mediaRecorder);

        return async () => {
            const data: Blob = await StopRecording(mediaRecorder, chunks);

            stream?.getTracks().forEach(track => track.stop());

            StopMeter();

            //TODO: send data to server
        }
    }
    catch (err)
    {
        setError("Microphone is unavailable or denied.");
        console.error(err);
    }
}

async function StartStream()
{
    let stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
    });

    return stream
}


async function StartAudioMeter(
    stream: MediaStream,
    setLevel: React.Dispatch<React.SetStateAction<number>>
)
{
    //Update the audio meter visuals
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 256;

    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let animationId: number | null = null;

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

        animationId = requestAnimationFrame(updateMeter);
    }

    updateMeter();

    const stopMeter = () => {

        if (animationId !== null) {
            cancelAnimationFrame(animationId);
        }

        audioContext.close();
    }

    return stopMeter;
}

function StartRecording(mediaRecorder: MediaRecorder) {
    let chunks: Blob[] = []

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            chunks.push(event.data);
        }
    };

    mediaRecorder.start();

    return chunks;
}

async function StopRecording(mediaRecorder: MediaRecorder, chunks: Blob[]) {
    return new Promise<Blob>(resolve => {
        mediaRecorder.onstop = () => {
            const audioBlob: Blob = new Blob(chunks, { type: 'audio/webm' });
            resolve(audioBlob);
        };

        mediaRecorder.stop();
    });
}

function SendAudioToServer(data: Blob)
{

}