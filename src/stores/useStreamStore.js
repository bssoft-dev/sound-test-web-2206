import { devtools, subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

export const useStreamStore = createWithEqualityFn(
    devtools(
        subscribeWithSelector(
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
        )
    ), Object.is
)

useStreamStore.subscribe(
    (state) => state.recordedData,
    ({ recordedData, streamList, setRows, setStreamList, setAudioSrc, setRecordedData }) => {
        const createData = (reckey, oriUrlBase, receivedTime, duration, history ) => {
            return {
              reckey,
              oriUrlBase,
              receivedTime,
              duration,
              history
            };
        }
        if (recordedData && streamList) {
            const newRow = createData(
            recordedData.Date,
            recordedData.blobURL,
            recordedData.Date,
            '10초',
            streamList,
            );
            console.log('streamList', streamList);
            setRows(newRow);
            setRecordedData(null);
            setStreamList([]);
            setAudioSrc('');
        }
    }
);