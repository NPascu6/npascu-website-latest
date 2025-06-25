import React, {lazy, Suspense, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import {workImages as images} from "../components/_constant";
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
import {useTranslation} from "react-i18next";
import GithubProfileCard from "../components/main-page/GithubProfileCard";

// --- Lazy Imports ---
const EducationCard = lazy(() => import("../components/main-page/EducationAndTraining"));
const YoutubeVideoLink = lazy(() => import("../components/main-page/YoutubeVideoLink"));
const CollapsibleSection = lazy(() => import("../components/common/CollapsableSection"));
const HighlightedRepos = lazy(() => import("../components/main-page/HighlightedRepos"));
const ImageGrid = lazy(() => import("../components/common/ImageGrid"));

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
const QuotesComponent = lazy(() => import("../components/quote/QuoteComponent"));

// --- MainPage Component ---
const MainPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [loadedImages, setLoadedImages] = useState<string[]>([]);
    const workImages = useSelector((state: RootState) => state.app.workPhotos);
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const location = useLocation();
    const {t} = useTranslation();
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
                <GithubProfileCard/>
            </div>
            {/* NEW: Live Quotes Section */}
            <Suspense fallback={<Loading/>}>
                <CollapsibleSection
                    icon={<FaChartLineIcon className="text-2xl"/>}
                    isCollapsed={true}
                    title={t("marketData.title")}
                    subTitle={t("marketData.subtitle")}
                >
                    <Suspense fallback={<Loading/>}>
                        <QuotesComponent/>
                    </Suspense>
                </CollapsibleSection>
            </Suspense>
            {/* Interactive Sections */}
            <div className="mb-1 mt-1 grid grid-cols-1 md:grid-cols-2 gap-1 text-center">
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
                        <div style={{width: "3rem"}} className="mr-2 flex items-center justify-center">
                            ⚙️
                        </div>
                        <div
                            style={{color: isDarkTheme ? "#f3f4f6" : "#374151"}}
                            className="text-sm text-start group-hover:underline"
                        >
                            <div className="text-xl font-semibold">
                                {t("dynamicComponents.title")}
                            </div>
                            {t("dynamicComponents.subtitle")}
                        </div>
                    </div>
                </Link>

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
                        <div style={{width: "3rem"}} className="mr-2 flex items-center justify-center">
                            🎮
                        </div>
                        <div
                            style={{color: isDarkTheme ? "#f3f4f6" : "#374151"}}
                            className="text-sm text-start group-hover:underline"
                        >
                            <div className="text-xl font-semibold">
                                {t("browserGames.title")}
                            </div>
                            {t("browserGames.subtitle")}
                        </div>
                    </div>
                </Link>
            </div>
            <div className="mt-1 space-y-1">
                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection
                        icon={<MavxIcon/>}
                        isCollapsed={true}
                        title={t("employment.maverix.title")}
                        subTitle={t("employment.maverix.subtitle")}
                    >
                        <Suspense fallback={<Loading/>}>
                            <MavXCard/>
                        </Suspense>
                    </CollapsibleSection>
                </Suspense>

                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection
                        icon={<FintamaIcon/>}
                        isCollapsed={true}
                        title={t("employment.fintama.title")}
                        subTitle={t("employment.fintama.subtitle")}
                    >
                        <Suspense fallback={<Loading/>}>
                            <FintamaCard/>
                        </Suspense>
                    </CollapsibleSection>
                </Suspense>

                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection
                        icon={<CovarioIcon/>}
                        isCollapsed={true}
                        title={t("employment.covario.title")}
                        subTitle={t("employment.covario.subtitle")}
                    >
                        <Suspense fallback={<Loading/>}>
                            <CovarioCard/>
                        </Suspense>
                    </CollapsibleSection>
                </Suspense>

                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection
                        icon={<AmarisIcon height={70} width={44}/>}
                        isCollapsed={true}
                        title={t("employment.amaris.title")}
                        subTitle={t("employment.amaris.subtitle")}
                    >
                        <Suspense fallback={<Loading/>}>
                            <AmarisCard/>
                        </Suspense>
                    </CollapsibleSection>
                </Suspense>

                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection
                        icon={<CognizantIcon/>}
                        isCollapsed={true}
                        title={t("employment.cognizant.title")}
                        subTitle={t("employment.cognizant.subtitle")}
                    >
                        <Suspense fallback={<Loading/>}>
                            <CognizantCard/>
                        </Suspense>
                    </CollapsibleSection>
                </Suspense>

                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection
                        icon={<BoschIcon/>}
                        isCollapsed={true}
                        title={t("employment.bosch.title")}
                        subTitle={t("employment.bosch.subtitle")}
                    >
                        <Suspense fallback={<Loading/>}>
                            <BoschCard/>
                        </Suspense>
                    </CollapsibleSection>
                </Suspense>

                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection
                        icon={<TopmotiveIcon/>}
                        isCollapsed={true}
                        title={t("employment.topmotive.title")}
                        subTitle={t("employment.topmotive.subtitle")}
                    >
                        <Suspense fallback={<Loading/>}>
                            <DVSECard/>
                        </Suspense>
                    </CollapsibleSection>
                </Suspense>

                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection
                        icon={<NewVTech/>}
                        isCollapsed={true}
                        title={t("employment.newvtech.title")}
                        subTitle={t("employment.newvtech.subtitle")}
                    >
                        <Suspense fallback={<Loading/>}>
                            <ItSupportTechnicianCard/>
                        </Suspense>
                    </CollapsibleSection>
                </Suspense>

                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection
                        icon={<EducationIcon/>}
                        isCollapsed={true}
                        title={t("education.title")}
                        subTitle={t("education.subtitle")}
                    >
                        <Suspense fallback={<Loading/>}>
                            <EducationCard/>
                        </Suspense>
                    </CollapsibleSection>
                </Suspense>

                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection
                        icon={<GitHub width={32} height={32}/>}
                        isCollapsed={true}
                        title={t("githubRepos.title")}
                        subTitle={t("githubRepos.subtitle")}
                    >
                        <Suspense fallback={<Loading/>}>
                            <HighlightedRepos/>
                        </Suspense>
                    </CollapsibleSection>
                </Suspense>

                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection title={t("sampleScreens")}>
                        {!!workImages?.length && (
                            <Suspense fallback={<Loading/>}>
                                <ImageGrid images={workImages}/>
                            </Suspense>
                        )}
                    </CollapsibleSection>
                </Suspense>

                <Suspense fallback={<Loading/>}>
                    <CollapsibleSection title={t("tradingApp")}>
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
