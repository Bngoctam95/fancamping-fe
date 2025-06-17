import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const ScrollToTopOnMount = () => {
    const { pathname } = useLocation();
    const navigationType = useNavigationType();

    useEffect(() => {
        if (navigationType !== 'POP') {
            window.scrollTo(0, 0);
        }
    }, [pathname, navigationType]);

    return null;
};

const ScrollToTop = () => {
    return <ScrollToTopOnMount />;
};

export default ScrollToTop;
