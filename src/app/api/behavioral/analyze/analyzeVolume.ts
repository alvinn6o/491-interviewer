// Author: Brandon Christian
// Date: 4/6/2026
//Check the volume of the audio blob over time

import decode from 'audio-decode';


//Decode the blob and extract the volume from each sample

//INPUT: audio blob in webm format (from userAudio.tsx)
//OUTPUT: array of volumes at each sample in the data

export async function GetVolume(blob: Blob) {

    //Array of amplitudes from -1 to 1 of the volume of each sample
    const decodedData = await DecodeAudio(blob);

    //extract the first channel
    //assume there is only one channel in the audio
    //const rawPCM = decodedData.getChannelData(0);
    const rawPCM = decodedData.channelData[0];

    //Map each sample's raw amplitude to its abs and store in an arrayBuffer
    if (rawPCM != undefined) {
        const volumes = rawPCM.map((sample: any) => Math.abs(sample));

        //average volumes for each second of audio
        const sampleRate = decodedData.sampleRate;
        const averageVolumesPerSecond = AverageVolume(volumes, sampleRate, 0.5)

        //1. average volumes for each second of audio
        //2. locate sections of audio of being quiet or silent for more than 1s
        //3. provide analysis feedback based on frequency and proportion of silent sections over the whole audio

        //for now, simply return the average audio sample
        //return averageVolumesPerSecond;

        return [AnalyzeVolume(averageVolumesPerSecond)];
    }

    //fail
    return [0];
}

//Convert blob into decoded audio data
//using audio-decode package
async function DecodeAudio(blob: Blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const decodedData = await decode(arrayBuffer);
        
    return decodedData;
}

//find average volume of each second of audio data
function AverageVolume(volumes: Float32Array<ArrayBuffer>, sampleRate: number, sampleTime: number) {
    console.log("Volume length: " + volumes.length + " sample rate: " + sampleRate + " seconds: " + volumes.length / sampleRate);

    const averageVolumes = [];

    let total = 0;
    let cur = 0;

    volumes.forEach(
        (volume) => {
            total += volume;
            cur += 1;

            if (cur >= sampleRate * sampleTime) {
                const avg = total / cur;
                const trunc = Math.trunc(avg * 1000) / 1000
                averageVolumes.push(trunc);

                total = 0;
                cur = 0;
            }
        }
    );

    //one last average 
    if (cur != 0) {
        const avg = total / cur;
        const trunc = Math.trunc(avg * 1000) / 1000
        averageVolumes.push(trunc);
    }
    

    return averageVolumes;
}


//Analyze volume for periods of quiet

//INPUT: array of average volume of samples over certain
//intervals (currently 0.5s)

//OUTPUT: numerical score based on number of pauses from 1 to 5

async function AnalyzeVolume(averageVolumes: number[]) {

    const talkingVolumeThreshold = 0.001;

    //Sample is "quiet" or "talking" based on talkingVolumeThreshold
    //A random quiet or loud sample is not part of total samples
    //unless there are at least two of them in a row
    //There is also forgiveness for the start and end
    //of the session where a pause is allowed.

    let sampleSections: any[] = [];
    let currentSamples = 0;
    let inPause = true;

    averageVolumes.forEach(
        (volume) => {

            if (volume <= talkingVolumeThreshold) {

                //Add or switch if not in pause
                if (inPause) {
                    currentSamples++;
                }
                else {
                    sampleSections.push(currentSamples);
                    currentSamples = 0;
                    inPause = true;
                }

            }
            else {

                //switch if in pause or add
                if (inPause) {
                    sampleSections.push(currentSamples);
                    currentSamples = 0;
                    inPause = false;
                }
                else {
                    currentSamples++;
                }
            }
            
        }
    );


    let preTalkSamples = sampleSections[0];
    let pauseSamples = 0;
    let talkSamples = 0;
    let postTalkSamples = sampleSections[sampleSections.length - 1];


    //alternate between pause and talk
    //assume we start with talk
    for (let i = 1; i < sampleSections.length - 1; i++) {
        if (i % 2 == 1) {
            talkSamples += sampleSections[i];
        }
        else {
            pauseSamples += sampleSections[i];
        }

    }

    const totalValidSamples = averageVolumes.length - preTalkSamples - postTalkSamples;
    const score = (pauseSamples + talkSamples) / totalValidSamples;

    console.log("pre: " + preTalkSamples + "pause: " + pauseSamples + "talk: " + talkSamples + "post: " + postTalkSamples + " score: " + score);

    //TODO: score by threshold, what % of the interview should they be talking at least? 
    //TODO: penalty for unusually large pause sections

    return score;
}
