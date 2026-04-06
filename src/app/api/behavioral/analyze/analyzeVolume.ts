// Author: Brandon Christian
// Date: 4/6/2026
//Check the volume of the audio blob over time

import { decode } from 'wav-decoder';
import { FFmpeg } from '@ffmpeg/ffmpeg';

//userAudio.tsx enforces audio recording as webm format
//to ensure consistency across browsers

//INPUT: audio blob in webm format (from userAudio.tsx)
//OUTPUT: array of volumes at each sample in the data

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
