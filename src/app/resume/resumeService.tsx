//Author: Brandon Christian
//Date: 2/10/2026
//Initial Creation


export async function SendResumeToServer(file: File) {

    const formData = new FormData();

    formData.append(
        "file",
        file
    );

    console.log("sending file to server")

    const response = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData
    });

    

    return response;
}

export async function SendResumeTextAndJobDescToServer(resumeText: string, jobDescText: string) {

    const formData = new FormData();

    formData.append(
        "resume",
        resumeText
    );

    formData.append(
        "jobDesc",
        jobDescText
    );

    const response = await fetch("/api/resume/analyze", {
        method: "POST",
        body: formData
    });

    return response;

}