// Author: Brandon Christian
// Date: 4/6/2026
//Check the volume of the audio blob over time

//import { decode } from 'wav-decoder';
//import { FFmpeg } from '@ffmpeg/ffmpeg';
//import { AudioContext } from 'web-audio-api';
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
        const averageVolumesPerSecond = AverageVolume(volumes, sampleRate)

        //1. average volumes for each second of audio
        //2. locate sections of audio of being quiet or silent for more than 1s
        //3. provide analysis feedback based on frequency and proportion of silent sections over the whole audio

        //for now, simply return the average audio sample
        return averageVolumesPerSecond;
    }

    //fail
    return [0];
}

//Convert blob into decoded audio data
//using audio-decode package
async function DecodeAudio(blob: Blob) {

    /*
    //move data from blob to array buffer for processing
    const arrayBuffer = await blob.arrayBuffer();

    //use audio context to decode the audio into viewable samples
    const audioCtx = new AudioContext();

    const decodedData = await audioCtx.decodeAudioData(arrayBuffer);*/

    const arrayBuffer = await blob.arrayBuffer();
    const decodedData = await decode(arrayBuffer);
        
    return decodedData;
}

//find average volume of each second of audio data
function AverageVolume(volumes: Float32Array<ArrayBuffer>, sampleRate: number) {
    //TODO:

    return [1];
}

//DEPRECATED:
//INPUT: audio blob in webm format (from userAudio.tsx)
//OUTPUT: array of volumes at each sample in the data
/*
export async function GetVolumeWEBM(blob: Blob) {
    //TODO: Error: ffmpeg.wasm does not support nodejs, find alternatie solution

    //init FFMPEG to convert webm to wav
    const ffmpeg = new FFmpeg();
    await ffmpeg.load();

    //convert blob to buffer to get processable data
    const arrayBuffer = await blob.arrayBuffer();

    //helper file name when dealing with ffmpeg functions
    const filename = `input-${Date.now()}.webm`;

    //use ffmpeg's virtual file system
    //write the audio data as a file
    ffmpeg.writeFile(filename, new Uint8Array(arrayBuffer));

    //simpler to convert to wav and decode than keep as webm
    await ffmpeg.exec(['-i', filename, '-f', 'wav', 'output.wav']); 

    //read and decode the wav file
    const wavData = ffmpeg.readFile('output.wav');
    const audioData = await decode(wavData);

    //use audioContext to create a buffer to store the audio data
    const offlineAudioContext = new OfflineAudioContext(audioData.numberOfChannels, audioData.length, audioData.sampleRate);
    const buffer = offlineAudioContext.createBuffer(audioData.numberOfChannels, audioData.length, audioData.sampleRate);

    //assume only one channel exists
    //even if more channels exist, we simply don't process them
    buffer.copyToChannel(audioData.channelData[0], 0);

    //use to store a list of volumes at each frame
    const volumeData = [];

    //get the volume of each sample
    for (let i = 0; i < buffer.length; i++) {
        const sampleValue = buffer.getChannelData(0)[i];

        if (sampleValue !== undefined) {
            const peakVolume = Math.abs(sampleValue);
            volumeData.push(peakVolume);
        }
    }

    return volumeData;
}
*/
//Analyze the volume over time and provide
//feedback about the volume

//criteria:
//1. not too loud
//2. not too quiet
//3. not too many or too lengthy pauses

//what length is considered for a pause?
//pauses at start or end are OK but mentioned
//IE: start speaking promptly after beginning a session!
//ensure to end the session promptly when finished!

//INPUT: 

async function AnalyzeVolume(volumeData: number[]) {

}
