import { useLayoutEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import { useStore } from "../stores/useStore";

export const withHyperuser = (Component) => (props) => {
    const { isHyperuser, } = useStore(
        state => ({
            isHyperuser: state.isHyperuser, 
        }), shallow
    );

    return <Component {...props} isHyperuser={isHyperuser} />

}