import { createContext, useContext, useState } from "react";

export const TimerContext = createContext({});
export function TimerContextProvider({children}) {
    const [isRunning, setIsRunning] = useState(false);
    const [timer, setTimer] = useState(0);

    return (<TimerContext.Provider value={{
        isRunning, setIsRunning, timer, setTimer
    }}>
        {children}
    </TimerContext.Provider>)
}
export const TimerCtx = () => useContext(TimerContext);