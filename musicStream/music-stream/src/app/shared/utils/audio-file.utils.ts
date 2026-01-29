import { AUDIO_CONSTANTS } from "../../core/constants/audio.constants";

export function validateAudioFile(file: File): void {
    if (!AUDIO_CONSTANTS.ALLOWED_MIME_TYPES.includes(file.type)) {
        throw new Error(AUDIO_CONSTANTS.ERRORS.FILE_TOO_LARGE(AUDIO_CONSTANTS.MAX_FILE_SIZE_MB));
    }

    const maxSizeInBytes = AUDIO_CONSTANTS.MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
        throw new Error(AUDIO_CONSTANTS.ERRORS.FILE_TOO_LARGE(AUDIO_CONSTANTS.MAX_FILE_SIZE_MB));
    }


}
export function getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve,reject)=>{
        const objectUrl =URL.createObjectURL(file);
        const audio = new Audio();

        const cleanUp = ()=>URL.revokeObjectURL(objectUrl);

        audio.onloadedmetadata = ()=>{
            cleanUp();
            if (audio.duration == Infinity || isNaN(audio.duration)) {
                audio.currentTime=1e101;
                audio.ontimeupdate= ()=>{
                    cleanUp();
                    audio.ontimeupdate = null;
                    resolve(audio.duration);
                };
            }else{
                    resolve(audio.duration);
            };
        }
        audio.onerror=()=>{
            cleanUp();
         reject(new Error(AUDIO_CONSTANTS.ERRORS.METADATA_ERROR));
        };
        audio.src = objectUrl;
    });
}


