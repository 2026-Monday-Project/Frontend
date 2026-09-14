import { useEffect } from "react";

import AppFrame from "@/components/common/AppFrame";
import Router from "@/router/Router";

import { imagePreloadList } from "@/utils/imagePreloadList";
import { preloadImages } from "@/utils/preloadImages";

const App = () => {
    useEffect(() => {
        preloadImages(
            imagePreloadList,
        );
    }, []);

    return (
        <AppFrame>
            <Router />
        </AppFrame>
    );
};

export default App;