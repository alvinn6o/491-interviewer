// Author: Brandon Christian
// Date: 4/6/2026

import { GetVolume } from "./analyzeVolume";

export async function TestAnalyzeVolume(blob: Blob) {
    const volumeDataArray = await GetVolume(blob);

    let msg = "Volume: ";

    volumeDataArray.forEach(
        (volume) => {
            msg += ", " + volume;
        }
    )

    console.log(msg);
}