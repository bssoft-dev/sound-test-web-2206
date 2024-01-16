import { useLayoutEffect, useState } from "react";

export const withHyperuser = (Component) => (props) => {
    
    const [isHyperuser, setIsHyperuser] = useState(false);

    useLayoutEffect(() => {
        if(localStorage.getItem('is_hyperuser')) {
            setIsHyperuser(true);
        }
    }, [])

    return <Component {...props} isHyperuser={isHyperuser} />

}