import { devtools } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

export const useMicrophoneStore = createWithEqualityFn(
    devtools(
        (set) => ({
            isPlaying, open, 
      wavesurfer, setPlayerReady, setIsPlaying,
      togglePlayback, stopPlayback, handleDone, handleCancel,
      startRecording, stopRecording, restartRecording,
      isRunning, setIsRunning
        }), Object.is
    )
)