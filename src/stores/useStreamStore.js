import { devtools } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

export const useStreamStore = createWithEqualityFn(
    devtools(
        (set) => ({
            streamList: [],
            setStreamList: (value) => set(
                { steamList: value }, false, 'setStreamList'
            ),
            handleStreamList: (value) => set(
                state => ({ steamList: [...state.setStreamList, value] }), false, 'handleStreamList'
            ),

            audioSrc: null,
            setAudioSrc: (value) => set(
                { audioSrc: value }, false, 'setAudioSrc'
            ),

            tempFile: null,
            setTempFile: (value) => set(
                { tempFile: value }, false, 'setTempFile'
            ),

            status: '',
            controlAudio: (value) => {
                set(
                    {status: value}, false, 'controllAudio'
                );
                console.log("status", value);
            },
            
            recordedData: null,
            setRecordedData: (value) => set(
                { recordedData: value }, false, 'setRecordData'
            ),

            rows: [],
            setRows: (value) => set(
                state => ({ rows: [...state.rows, value] }), false, 'setRows'
            ),
        })
    ), Object.is
)