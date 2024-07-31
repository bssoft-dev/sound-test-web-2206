
import React from "react";
import { shallow } from "zustand/shallow";
import { useStore } from "../stores/useStore";

export const links = [
    {name: '사운드 처리 테스트', url: '/sound-test', isHyperuser: false },
    {name: '화자 분리 테스트', url: '/bss-test', isHyperuser: true },
    {name: 'STT 기본모델 테스트', url: '/stt-test', isHyperuser: true },
    {name: 'TTS 기본모델 테스트', url: '/tts-test', isHyperuser: true },
    {name: '카페 주문 테스트', url: '/menu-test', isHyperuser: true },
    {name: 'ADL 분석 테스트', url: '/audio-test', isHyperuser: true },
    {name: '위험 사운드 분류', url: '/danger-sound', isHyperuser: false },
    // {name: '로그인', url: '/login' },
    // {name: '테스트', url: '/test' },
]

export const withHyperuser = (Component) => (props) => {
    const { isHyperuser, } = useStore(
        state => ({
            isHyperuser: state.isHyperuser, 
        }), shallow
    );

    return( 
        <>
            {links.filter(link => isHyperuser ? true : !link.isHyperuser)
            .map((link) => (
                <Component {...props} key={link.name} link={link} />
            ))}
        </>
    )

}