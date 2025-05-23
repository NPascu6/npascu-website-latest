import * as React from "react";
import useWindowSize from "../../hooks/useWindowSize";

const videos = [
    {
        title: "Youtube1",
        src: "https://www.youtube-nocookie.com/embed/isTUIKnZl_0",
    },
    // {
    //     title: "Youtube2",
    //     src: "https://www.youtube-nocookie.com/embed/jGah_U_GBuI",
    // },
    {
        title: "Youtube3",
        src: "https://www.youtube-nocookie.com/embed/edBKGax80RE",
    },
    {
        title: "Youtube4",
        src: "https://www.youtube-nocookie.com/embed/--opZa6s0Ws",
    },
    {
        title: "Youtube5",
        src: "https://www.youtube-nocookie.com/embed/865Lo-wLeE8",
    },
];

const YoutubeVideoLink = () => {
    const windowSize = useWindowSize();

    return (
        <div className="text-center shadow-xl card">
            <p className="text-xl font-semibold m-2">
                Explore a Crypto Trading Platform Created with Electron and React
            </p>
            <div className="flex flex-wrap justify-center items-center">
                {videos.map((video, index) => (
                    <div
                        className="m-1 shadow-xl p-2 "
                        key={index}
                        style={{
                            minWidth: windowSize.innerWidth < 500 ? "22em" : "25em",
                        }}
                    >
                        <iframe
                            title={video.title}
                            loading="lazy"
                            width="100%"
                            height="320"
                            src={video.src}
                            allowFullScreen
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default YoutubeVideoLink;
