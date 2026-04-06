// Author: Brandon Christian
// Date: 4/6/2026

import { GetVolumeWEBM } from "./analyzeVolume";

export async function TestAnalyzeVolume(blob: Blob) {
    const volumeDataArray = await GetVolumeWEBM(blob);

    let msg = "Volume: ";

    volumeDataArray.forEach(
        (volume) => {
            msg += ", " + volume;
        }
    )

    console.log(msg);
}