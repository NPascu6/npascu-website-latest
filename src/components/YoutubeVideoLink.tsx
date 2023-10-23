import * as React from "react";
import useWindowSize from "../hooks/useWindowSize";

const videos = [
    { title: 'Youtube1', src: 'https://www.youtube.com/embed/isTUIKnZl_0' },
    { title: 'Youtube2', src: 'https://www.youtube.com/embed/jGah_U_GBuI' },
    { title: 'Youtube3', src: 'https://www.youtube.com/embed/edBKGax80RE' },
    { title: 'Youtube4', src: 'https://www.youtube.com/embed/--opZa6s0Ws' },
    { title: 'Youtube5', src: 'https://www.youtube.com/embed/865Lo-wLeE8' },
];

const YoutubeVideoLink = () => {
    const windowSize = useWindowSize();

    return (
        <div className="text-center border">
            <p className="text-2xl font-semibold m-4">
                Explore a Crypto Trading Platform Created with Electron and React
            </p>
            <hr className="border-t-2 border-solid p-1 mt-3" />
            <p className="text-xl font-semibold m-4">
                Click on the video to watch it on Youtube.
            </p>
            <div className="flex flex-wrap justify-center items-center">
                {videos.map((video, index) => (
                    <div
                        className="m-1"
                        key={index}
                        style={{
                            minWidth: windowSize.innerWidth < 500 ? '18em' : '20em',
                        }}
                    >
                        <iframe
                            data-cookiescript="accepted"
                            data-cookiecategory="functionality"
                            title={video.title}
                            loading="lazy"
                            width="100%"
                            height="320"
                            src={video.src}
                            allowFullScreen
                        />
                        <hr className="border-t-2 border-solid p-1 mt-3" />
                    </div>

                ))}
            </div>
        </div>
    );
};

export default YoutubeVideoLink;
