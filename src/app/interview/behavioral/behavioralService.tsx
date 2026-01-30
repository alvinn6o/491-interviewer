//Author: Brandon Christian
//Date: 1-30-2026
//Handle API or DB requests between the user and the server

export async function SendAudioToServer(data: Blob) {
    console.log("TODO: implement send audio to server");

    //Extract the file extension
    //which differs between browsers
    const mimeType = data.type;
    const extension = mimeType.split("/")[1];

    const formData = new FormData();

    formData.append(
        "audio",
        data,
        `recording.${extension}`
    );

    const response = await fetch("/api/behavioral/uploadAudio", {
        method: "POST",
        body: formData
    });
}