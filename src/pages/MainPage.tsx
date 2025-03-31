import React, {lazy, Suspense, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import {workImages as images} from "../_constant";
import {setWorkPhotos} from "../store/reducers/appReducer";
import Loading from "./generic/Loading";
import {Link, useLocation} from "react-router-dom";
import AmarisIcon from "../assets/icons/AmarisIcon";
import BoschIcon from "../assets/icons/BoschIcon";
import CognizantIcon from "../assets/icons/CognizantIcon";
import CovarioIcon from "../assets/icons/CovarioIcon";
import FintamaIcon from "../assets/icons/FintamaIcon";
import GitHub from "../assets/icons/Github";
import EducationIcon from "../assets/icons/EducationIcon";
import TopmotiveIcon from "../assets/icons/TopmotiveIcon";
import NewVTech from "../assets/icons/NewVTech";
import {FaChartLine} from "react-icons/fa";
import MavxIcon from "../assets/icons/MavXIcon";

// --- Lazy Imports ---
const EducationCard = lazy(
    () => import("../components/main-page/EducationAndTraining")
);
const GithubProfileCard = lazy(
    () => import("../components/main-page/GithubProfileCard")
);
const YoutubeVideoLink = lazy(
    () => import("../components/main-page/YoutubeVideoLink")
);
const CollapsibleSection = lazy(
    () => import("../components/common/CollapsableSection")
);
const HighlightedRepos = lazy(
    () => import("../components/main-page/HighlightedRepos")
);
const ImageSlider = lazy(() => import("../components/common/ImageSlider"));

// Each experience card is a named export from ExperienceCards.
const AmarisCard = lazy(() =>
    import("../components/main-page/ExperienceCards").then((mod) => ({
        default: mod.AmarisCard,
    }))
);
const BoschCard = lazy(() =>
    import("../components/main-page/ExperienceCards").then((mod) => ({
        default: mod.BoschCard,
    }))
);
const CognizantCard = lazy(() =>
    import("../components/main-page/ExperienceCards").then((mod) => ({
        default: mod.CognizantCard,
    }))
);
const CovarioCard = lazy(() =>
    import("../components/main-page/ExperienceCards").then((mod) => ({
        default: mod.CovarioCard,
    }))
);
const DVSECard = lazy(() =>
    import("../components/main-page/ExperienceCards").then((mod) => ({
        default: mod.DVSECard,
    }))
);
const FintamaCard = lazy(() =>
    import("../components/main-page/ExperienceCards").then((mod) => ({
        default: mod.FintamaCard,
    }))
);
const ItSupportTechnicianCard = lazy(() =>
    import("../components/main-page/ExperienceCards").then((mod) => ({
        default: mod.ItSupportTechnicianCard,
    }))
);
const MavXCard = lazy(() =>
    import("../components/main-page/ExperienceCards").then((mod) => ({
        default: mod.MavXCard,
    }))
);

// NEW: Lazy load the QuotesComponent.
const QuotesComponent = lazy(
    () => import("../components/quote/QuoteComponent")
);

// --- MainPage Component ---
const MainPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [loadedImages, setLoadedImages] = useState<string[]>([]);
    const workImages = useSelector((state: RootState) => state.app.workPhotos);
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const location = useLocation();
    const FaChartLineIcon: any = FaChartLine;
    // Load work images once.
    useEffect(() => {
        if (loadedImages.length > 0) return;
        let cancelled = false;
        Promise.all(images)
            .then((imgs) => {
                if (cancelled) return;
                const mappedImages = imgs.map((img) => img.default);
                setLoadedImages(mappedImages);
                dispatch(setWorkPhotos(mappedImages));
            })
            .catch((error) => console.error("Error loading images", error))
            .finally(() => console.log("Images loaded"));

        return () => {
            cancelled = true;
        };
    }, [dispatch, loadedImages]);

    return (
        <div
            className="p-2"
            id="main-page"
            style={{height: "calc(100vh - 6rem)", overflow: "auto"}}
        >
            <div className="flex items-center justify-center">
                {/* Wrap each lazy component in Suspense */}
                <Suspense fallback={<Loading/>}>
                    <GithubProfileCard/>
                </Suspense>
            </div>
            {/* NEW: Live Quotes Section */}
            <Suspense fallback={<Loading/>}>
                <CollapsibleSection
                    icon={<FaChartLineIcon className="text-2xl"/>}
                    isCollapsed={true}
                    title="Demo Real-time market data"
                    subTitle="Using my personal .net api hosted on render to get data from finnhub"
                >
                    <Suspense fallback={<Loading/>}>
                        <QuotesComponent/>
                    </Suspense>
                </CollapsibleSection>
            </Suspense>
            {/* Interactive Sections */}
            <div className="mb-1 mt-1 grid grid-cols-1 md:grid-cols-2 gap-1 text-center">
                {/* Dynamic Components */}
                <Link
                    to="/dynamic-components"
                    className="flex w-full transform transition-all hover:scale-x-100 hover:scale-y-110"
                >
                    <div
                        style={{
                            backgroundColor: isDarkTheme ? "#374151" : "#f3f4f6",
                            color: isDarkTheme ? "#f3f4f6" : "#374151",
                        }}
                        className="shadow-lg p-2 flex items-center justify-start w-full"
                    >
                        <div
                            style={{
                                width: "3rem",
                            }}
                            className="mr-2 flex items-center  justify-center"
                        >
                            ⚙️
                        </div>
                        <div
                            style={{
                                color: isDarkTheme ? "#f3f4f6" : "#374151",
                            }}
                            className="text-sm text-start group-hover:underline"
                        >
                            <div className="text-xl font-semibold"> Dynamic Components</div>
                            Explore dynamically generated UI elements
                        </div>
                    </div>
                </Link>

                {/* Browser Games */}
                <Link
                    to="/games"
                    className="flex full-width transform transition-all hover:scale-x-100 hover:scale-y-110"
                >
                    <div
                        style={{
                            backgroundColor: isDarkTheme ? "#374151" : "#f3f4f6",
                            color: isDarkTheme ? "#f3f4f6" : "#374151",
                        }}
                        className="shadow-lg p-2 flex items-center justify-start w-full"
                    >
                        <div
                            style={{
                                width: "3rem",
                            }}
                            className="mr-2 items-center justify-center"
                        >
                            🎮
                        </div>
                        <div
                            style={{
                                color: isDarkTheme ? "#f3f4f6" : "#374151",
                            }}
                            className="text-sm text-start group-hover:underline"
                        >
                            <div className="text-xl font-semibold"> Browser Games</div>
                            Play simple browser-based games
                        </div>
                    </div>
                </Link>
            </div>
            <div className="mt-1 space-y-1">
                {/* Education Section */}
                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection
                        icon={<EducationIcon/>}
                        isCollapsed={true}
                        title="Education"
                        subTitle="Diploma, courses and specialization"
                    >
                        <Suspense fallback={<Loading/>}>
                            <EducationCard/>
                        </Suspense>
                    </CollapsibleSection>
                </Suspense>

                {/* Github Repos Section */}
                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection
                        icon={<GitHub width={32} height={32}/>}
                        isCollapsed={true}
                        title="Highlighted Github Repos"
                        subTitle="Github"
                    >
                        <Suspense fallback={<Loading/>}>
                            <HighlightedRepos/>
                        </Suspense>
                    </CollapsibleSection>
                </Suspense>

                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection
                        icon={<MavxIcon/>}
                        isCollapsed={true}
                        title="Current employment (Maverix Securities AG)"
                        subTitle="10/2024 - current"
                    >
                        <Suspense fallback={<Loading/>}>
                            <MavXCard/>
                        </Suspense>
                    </CollapsibleSection>
                </Suspense>

                {/* Fintama Employment */}
                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection
                        icon={<FintamaIcon/>}
                        isCollapsed={true}
                        title="Senior Software Engineer (Fintama)"
                        subTitle="02/2023 - 10/2024"
                    >
                        <Suspense fallback={<Loading/>}>
                            <FintamaCard/>
                        </Suspense>
                    </CollapsibleSection>
                </Suspense>

                {/* Covario Employment */}
                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection
                        icon={<CovarioIcon/>}
                        isCollapsed={true}
                        title="TL / Senior Developer (Covario)"
                        subTitle="03/2021 - 01/2023"
                    >
                        <Suspense fallback={<Loading/>}>
                            <CovarioCard/>
                        </Suspense>
                    </CollapsibleSection>
                </Suspense>

                {/* Amaris Employment */}
                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection
                        icon={<AmarisIcon height={70} width={44}/>}
                        isCollapsed={true}
                        title="IT Consultant (Amaris)"
                        subTitle="04/2020 - 03/2021"
                    >
                        <Suspense fallback={<Loading/>}>
                            <AmarisCard/>
                        </Suspense>
                    </CollapsibleSection>
                </Suspense>

                {/* Cognizant Employment */}
                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection
                        icon={<CognizantIcon/>}
                        isCollapsed={true}
                        title="Mobile / BE Developer (Cognizant)"
                        subTitle="06/2019 - 04/2020"
                    >
                        <Suspense fallback={<Loading/>}>
                            <CognizantCard/>
                        </Suspense>
                    </CollapsibleSection>
                </Suspense>

                {/* Bosch Employment */}
                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection
                        icon={<BoschIcon/>}
                        isCollapsed={true}
                        title="Software Development Engineer (BOSCH)"
                        subTitle="07/2018 - 06/2019"
                    >
                        <Suspense fallback={<Loading/>}>
                            <BoschCard/>
                        </Suspense>
                    </CollapsibleSection>
                </Suspense>

                {/* DVSE / Topmotive Employment */}
                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection
                        icon={<TopmotiveIcon/>}
                        isCollapsed={true}
                        title="First Developer Job (TOPMOTIVE)"
                        subTitle="06/2016 - 07/2018"
                    >
                        <Suspense fallback={<Loading/>}>
                            <DVSECard/>
                        </Suspense>
                    </CollapsibleSection>
                </Suspense>

                {/* IT Support Employment */}
                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection
                        icon={<NewVTech/>}
                        isCollapsed={true}
                        title="Support Technician (NewV Technologies)"
                        subTitle="06/2015 - 06/2016"
                    >
                        <Suspense fallback={<Loading/>}>
                            <ItSupportTechnicianCard/>
                        </Suspense>
                    </CollapsibleSection>
                </Suspense>

                {/* Sample Screens */}
                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection title="Sample screens from previous work.">
                        {!!workImages?.length && (
                            <Suspense fallback={<Loading/>}>
                                <ImageSlider images={workImages}/>
                            </Suspense>
                        )}
                    </CollapsibleSection>
                </Suspense>

                {/* Trading App Section */}
                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection title="Trading App (Crypto trading platform)">
                        <Suspense fallback={<Loading/>}>
                            <YoutubeVideoLink/>
                        </Suspense>
                    </CollapsibleSection>
                </Suspense>
            </div>
        </div>
    );
};

export default MainPage;
