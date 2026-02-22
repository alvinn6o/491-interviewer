//Author: Brandon Christian
//Date: 12/12/2025
//Initial Creation

//Date: 1/29/2026
//Modified to record audio input
//Add functions StartRecording, StopRecording, SendAudioToServer, SetupAudioAsync
//Modify functions AudioMeter

//Date: 1/31/2026
//send audio back with useState

import { useEffect, useRef } from "react";
import { useState } from "react";
import styles from "./test.module.css";

async function StartStream(useAudio: boolean, useVideo: boolean) {

    //obtain the user's camera and audio feed
    let stream = await navigator.mediaDevices.getUserMedia({
        audio: useAudio,
        video: useVideo,
    });

    return stream
}

//Camera component
//Also contains audio meter component
//TODO: implement camera recording
export function CameraBox({ recordAudio, audioRef }: {
    recordAudio: boolean,
    audioRef: React.RefObject<Blob | null>;
}) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let stream: MediaStream;

        async function startCamera() {
            try {
                stream = await StartStream(false, true);

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
            <AudioMeter recordAudio={recordAudio} audioRef={audioRef} />
        </div>

    )
}

//Audio Meter component
function AudioMeter({ recordAudio, audioRef }: {
    recordAudio: boolean,
    audioRef: React.RefObject<Blob | null>
}) {
    const [level, setLevel] = useState(0);
    const [error, setError] = useState<string | null>(null);

    //console.log("setup audio meter");

    useEffect(() => {
        console.log("call use effect");

        //Either the cleanup effect or undefined if it never finished
        let Cleanup: (() => void) | undefined;

        //Run SetupAudioAsync
        //Wrap in async so it can be run synchronously within useEffect
        (async () => {
            Cleanup = await SetupAudioAsync(
                setError,
                setLevel,
                recordAudio,
                audioRef
            );
        })();

        //Run cleanup
        return () => {
            console.log("Doing cleanup");

            if (Cleanup) {
                console.log("did cleanup");

                Cleanup();
            }
            else {
                console.log("failed to do cleanup");
            }
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
    setLevel: React.Dispatch<React.SetStateAction<number>>,
    recordAudio: boolean,
    audioRef: React.RefObject<Blob | null>
)
{
    console.log("setup audio async");

    try {
        const stream: MediaStream = await StartStream(true, false); //create audio stream
        const StopMeter = await StartAudioMeter(stream, setLevel); //start meter and return cleanup func

        const cleanup = async () => {
            stream?.getTracks().forEach(track => track.stop());
            StopMeter();
        }

        //if not recordAudio, then only cleanup audio meter
        if (recordAudio)
        {
            console.log("Start audio recording")

            let mediaRecorder: MediaRecorder = new MediaRecorder(stream);
            let chunks: Blob[] = StartRecording(mediaRecorder);

            //return cleanup function that stops the audio and sends it to the server
            return async () => {
                
                console.log("About to stop recording");

                const data: Blob = await StopRecording(mediaRecorder, chunks);

                cleanup();

                //triggers await in BIEnd for audio data to end
                if (audioRef)
                    audioRef.current = data;
            }
        }
        else
        {
            console.log("Start meter without recording");

            return cleanup;
        }
            
    }
    catch (err)
    {
        setError("Microphone is unavailable or denied.");
        console.error(err);
    }
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

    //Use media recorder to push the data as its recorded into "chunks"
    //which is actiely updated
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            chunks.push(event.data);
        }
    };

    mediaRecorder.start();

    return chunks;
}

async function StopRecording(mediaRecorder: MediaRecorder, chunks: Blob[]) {
    //ON cleanup, return the final audio blob and stop the recording

    return new Promise<Blob>(resolve => {
        mediaRecorder.onstop = () => {
            const audioBlob: Blob = new Blob(chunks, { type: 'audio/webm' });

            console.log("Final blob size:", audioBlob.size);

            resolve(audioBlob);

        };



        mediaRecorder.stop();
    });
}

