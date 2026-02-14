// Install the axios and fs-extra package by executing the command "npm install axios"
//Author: Brandon Christian
//Date: 1-30-2026
//Refactored from CS to be JS instead

import axios from "axios";
import TokenizeText from "./tokenizeText";

export async function ProcessAudioToText(audioData: Blob) {
    //return "TODO: call API with real API key in api/behavioral/uploadAudio/audioProcess.ts. Dummy response.";

    //TODO: return real response, implement API key
    const text: string = await TranscribeAudioAsync(audioData);

    return text; 
}

export function ProcessTextToTokens(text: string) {
    const tokensByCount = TokenizeText.textToTokensByCount(text);

    return tokensByCount;
}

const API_KEY =  process.env.ASSEMBLY_AI_API;

async function UploadAudioAsync(audioData: Blob) {
    const baseUrl = "https://api.assemblyai.com";

    console.log("Blob size:", audioData.size);
    console.log("Blob type:", audioData.type);

    const buffer = Buffer.from(await audioData.arrayBuffer());

    console.log("Buffer length:", buffer.length);

    console.log("about to upload to assembly ai")

    try {
        const uploadResponse = await axios.post(
            `${baseUrl}/v2/upload`,
            buffer,
            {
                headers: {
                    authorization: API_KEY,
                    "content-type": "application/octet-stream",
                },
                maxBodyLength: Infinity,
            }
        );

        const audioUrl = uploadResponse.data.upload_url;

        console.log("Audio URL:", audioUrl);

        return audioUrl;

    } catch (error: any) {
        console.error("Status:", error.response?.status);
        console.error("Headers:", error.response?.headers);
        console.error("Data:", error.response?.data);
        console.error("Full error:", error);
        throw error;
    }

}

//The following function was modified from template
//code providied by AssemblyAI (not AI-generated) to
//use their API
async function TranscribeAudioAsync(audioData: Blob)
{
    const audioUrl = await UploadAudioAsync(audioData);
    //const audioUrl = "https://assembly.ai/wildfires.mp3";

    //TODO: use api key from .env file
    const headers = {
        authorization: API_KEY,
    };

    const data = {
        audio_url: audioUrl,
        speech_models: ["universal"],
    };

    const baseUrl = "https://api.assemblyai.com";
    const url = `${baseUrl}/v2/transcript`;
    const response = await axios.post(url, data, { headers: headers });

    const transcriptId = response.data.id;
    const pollingEndpoint = `${baseUrl}/v2/transcript/${transcriptId}`;

    while (true) {
        const pollingResponse = await axios.get(pollingEndpoint, {
            headers: headers,
        });
        const transcriptionResult = pollingResponse.data;

        if (transcriptionResult.status === "completed") {
            console.log(transcriptionResult.text);

            //Modification
            //Return result instead of only printing it to console
            return transcriptionResult.text;


        } else if (transcriptionResult.status === "error") {
            throw new Error(`Transcription failed: ${transcriptionResult.error}`);
        } else {
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
    }
}

