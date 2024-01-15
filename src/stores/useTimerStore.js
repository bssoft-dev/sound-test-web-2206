import { createWithEqualityFn } from 'zustand/traditional'
import { devtools } from 'zustand/middleware'

export const useTimerStore = createWithEqualityFn(
    devtools(
        (set) => ({
            // timer Runnig state
            isRunning: false,
            setIsRunning: (bool) => set(
                () => ({ isRunning: bool }), false, 'setIsRunning'
            ),

            // timer
            timer: 0,
            increaseTimer: () => set(
                state => ({ timer: state.timer + 10 }), false, 'increaseTimer'
            ),
            setTimer: (value) => set(
                () => ({ timer: value }), false, 'setTimer'
            ),
        })
    ), Object.is
)
