// Install the axios and fs-extra package by executing the command "npm install axios"
//Author: Brandon Christian
//Date: 1-30-2026
//Refactored from CS to be JS instead

import axios from "axios";
import TokenizeText from "./tokenizeText";

export async function ProcessAudio(audioData: Blob) {
    const text: string = await TranscribeAudioAsync(audioData);
    const tokensByCount = TokenizeText.textToTokensByCount(text);

    return tokensByCount;
}

async function UploadAudioAsync(audioData: Blob) {
    const baseUrl = "https://api.assemblyai.com";

    //TODO: use from .env file
    const headers = {
        authorization: "excised",
        "content-type": "application/octet-stream",
    };

    const uploadResponse = await fetch(`${baseUrl}/v2/upload`, {
        method: "POST",
        headers,
        body: audioData,
    });

    if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${await uploadResponse.text()}`);
    }

    const uploadData = await uploadResponse.json();
    const audioUrl = uploadData.upload_url;

    return audioUrl;
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
        authorization: "excised",
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

