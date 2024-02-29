import axios from "axios";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import supabase from "../utils/supabase";

export const useStore = createWithEqualityFn(
    devtools(
        subscribeWithSelector(
            persist(
                (set, get) => ({
                    // location pathname
                    pathname: '',
                    setPathname: (value) => set(
                        { pathname: value }, false, 'setPathname'
                    ),
        
                    loading: false,
                    setLoading: (value) => set(
                        { loading: value }, false, 'setLodaing'
                    ),
        
                    title: '비에스 소프트',
                    setTitle: (value) => set(
                        { title: value }, false, 'setTitle'
                    ),
        
                    isAlert: {
                        open: false,
                        type: 'warning',
                        message: ''
                    },
                    setAlert: (value) => set(
                        { isAlert: value }, false, 'setAlert',
                    ),
        
                    mobileOpen: false,
                    handleDrawerToggle: () => set(
                        state => ({ mobileOpen: !state.mobileOpen }), false, 'handleDreawerToggle'
                    ),
        
                    regions: [
                        {
                          id: 'region-1',
                          start: 0,
                          end: 1,
                          color: "rgba(60, 179, 113, 0.3)"
                        }
                    ],
                    setRegion: (value) => set(
                        { regions: [value] }, false, 'setRegion'
                    ),
        
                    files: [null],
                    pushFile: (value) => set(
                        state => ({ files: [...state.files, value] }), false, 'pushFile'
                    ),
                    setFile: (value) => set(
                        { files: value }, false, 'setFile'
                    ),
        
                    rows: [],
                    setRows: (value) => set(
                        { rows: value }, false, 'setRows'
                    ),
        
                    version: null,
                    setVersion: (value) => set(
                        { version: value }, false, 'setVersion'
                    ),
        
                    serverHealth: null,
                    setServerHealth: (value) => set(
                        { serverHealth: value }, false, 'setServerHealth'
                    ),
        
                    fetchData: (baseUrl) => {
                        set(
                            { rows: [] }, false, 'rowReset'
                        );
                        axios.get(baseUrl)
                            .then((response)=> {
                                console.log('response status: ', response.data);
                                if(response.status === 200) {
                                    set(
                                    { serverHealth: true }, false, 'setServerHealth'
                                    );
                                }
        
                                if(response.data) {
                                    set(
                                        { rows: response.data }, false, 'fetchData'
                                    );
                                }
                                else {
                                    set(
                                        { rows: [] }, false, 'not response.data rowReset'
                                    );
                                }
        
                            })
                            .catch((error)=> {
                                set(
                                    { rows: [] }, false, 'response errpr rowReset'
                                );
                                console.log(error);
                            });
                    },
        
                    // supabase sound data
                    soundTableRows: [],
                    setSoundTableRows: (value) => set(
                        { soundTableRows: value }, false, 'setSoundTableRows'
                    ),
                    fetchSoundDatas: async () => {
                        let {data, error} = await supabase
                            .from('sound')
                            .select('*')
                            .order('receivedTime', { ascending: false });
                        if(data) {
                            console.log('Get Sound: ', data );
                            set(
                                { soundTableRows: data }, false, 'fetchSoundDatas'
                            );
                        } else {
                            console.log(error);
                        }
                    },

                    bssSoundTableRows: [],
                    setBssSoundTableRows: (value) => set(
                        { soundTableRows: value }, false, 'setSoundTableRows'
                    ),
                    fetchBssSoundDatas: async () => { 
                        let {data, error} = await supabase
                            .from('bssSound')
                            .select('*')
                            .order('receivedTime', { ascending: false });
                        if(data) {
                            console.log('Get Sound: ', data );
                            set(
                                { bssSoundTableRows: data }, false, 'bssSoundTableRows'
                            );
                        } else {
                            console.log(error);
                        }
                    },
        
                    bssNumPerson: 2,
                    handleNumPerson: (event) => {
                        console.log(event.target.value);
                        set(
                            { bssNumPerson: event.target.value }, false, 'handleNumPerson'
                        );
                    },
        
                    sttResult: null,
                    handleSttResult: (value) => set(
                        { sttResult: value }, false, 'handleSttResult'
                    ),
        
                    token: null, 
                    setToken: (value) => set(
                        {token: value }, false, 'setToken'
                    ),

                    isHyperuser: false,
                    setIsHyperuser: (value) => set(
                        {isHyperuser: value}, false, 'setIsHyperuser'
                    )
                }), {
                    name: 'auth Storage',
                    partialize: state => (
                        { token: state.token, isHyperuser: state.isHyperuser }
                    )
                }
            )
        )
    ), Object.is
)
