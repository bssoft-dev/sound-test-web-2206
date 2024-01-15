import { devtools } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

export const useRecordStore = createWithEqualityFn(
    devtools(
        (set) => ({
            record: false,
            setRecord: (value) => set(
                { record: value }, false, 'setRecord'
            ),

            tempFile: null,
            setTempFile: (value) => set(
                { tempFile: value }, false, 'setTempFile'
            ),

            downloadLinkURL: null,
            setDownloadLinkURL: (value) => set(
                { downloadLinkURL: value }, false, 'setDownloadLinkURL'
            ),


            onData: (recordedBlob) => {
                console.log('chunk of real-time data is: ', recordedBlob);
            },

            onStop: (recordedBlob) => {
                set(
                    { tempFile:  recordedBlob}, false, 'onStop'
                ); // 'audio/wav'
                console.log('tempFile', recordedBlob);
            },

            onSave: (recordedBlob) => set(
                { downloadLinkURL: recordedBlob.blobURL }, false, 'onSave'
            )
        })
    ), Object.is
)