//Author: Brandon Christian
//Date: 12/12/2025
//Initial Creation

//Date: 1/29/2026
//Modified to record audio input

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
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number | null>(null);

    const [level, setLevel] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect( () => {
        let stream: MediaStream;

        //Meter Visuals
        async function startAudioMeter() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });


                //Update the audio meter visuals
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

        let mediaRecorder: MediaRecorder;
        let chunks: Blob[] = [];

        /*
        async function recordAudio() {
            try {
                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        chunks.push(event.data);
                    }
                };

                mediaRecorder.start();
            }
            catch (err) {
                console.error(err);
            }
        }

        async function stopRecording() {
            return new Promise<Blob>(resolve => {
                mediaRecorder.onstop = () => {
                    const audioBlob: Blob = new Blob(chunks, { type: 'audio/webm' });
                    resolve(audioBlob);
                };

                mediaRecorder.stop();
            });
        }*/

        startAudioMeter();
        //recordAudio();

        //return async () => {
        return () => {
            //const data: Blob = await stopRecording();

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

export function RecordedVideoBox() {
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

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
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

function SendAudioToServer(data: Blob)
{

}