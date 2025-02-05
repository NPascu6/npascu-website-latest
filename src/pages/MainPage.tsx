import React, { useEffect, useState, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchGithubUserProfile } from "../store/thunks/appThunk";
import { workImages as images } from "../_constant";
import { setWorkPhotos } from "../store/reducers/appReducer";
import Loading from "./generic/Loading";
import { Link } from "react-router-dom";

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

// Each experience card is a named export from ExperienceCards, so we can import them individually
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

// --- MainPage Component ---
const MainPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const workImages = useSelector((state: RootState) => state.app.workPhotos);

  // Load work images once
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

  // Fetch Github user profile on mount
  useEffect(() => {
    dispatch(fetchGithubUserProfile());
  }, [dispatch]);

  return (
    <div
      className="p-2"
      id="main-page"
      style={{ height: "calc(100vh - 6rem)", overflow: "auto" }}
    >
      <div className="flex items-center justify-center">
        {/* Wrap each lazy component in Suspense */}
        <Suspense fallback={<Loading />}>
          <GithubProfileCard />
        </Suspense>
      </div>
      {/* Interactive Sections */}
      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-center">
        {/* Dynamic Components */}
        <Link
          to="/dynamic-components"
          className="group block transform transition-all hover:scale-105"
        >
          <div className="shadow-lg p-3 flex flex-col items-center justify-center space-y-2">
            <div className="text-xl font-semibold">⚙️ Dynamic Components</div>
            <p className="text-sm text-gray-600 group-hover:underline">
              Explore dynamically generated UI elements
            </p>
          </div>
        </Link>

        {/* Browser Games */}
        <Link
          to="/games"
          className="group block transform transition-all hover:scale-105"
        >
          <div className="shadow-lg p-3 flex flex-col items-center justify-center space-y-2">
            <div className="text-xl font-semibold">🎮 Browser Games</div>
            <p className="text-sm text-gray-600 group-hover:underline">
              Play simple browser-based games
            </p>
          </div>
        </Link>
      </div>
      <div className="mt-1 space-y-1">
        {/* Example: Wrap CollapsibleSection in Suspense or only the card inside */}
        <Suspense fallback={<Loading />}>
          <CollapsibleSection
            isCollapsed={true}
            title="Education"
            subTitle="Diploma, courses and specialization"
          >
            <Suspense fallback={<Loading />}>
              <EducationCard />
            </Suspense>
          </CollapsibleSection>
        </Suspense>

        <Suspense fallback={<Loading />}>
          <CollapsibleSection
            isCollapsed={true}
            title="Highlighted Github Repos"
            subTitle="Github"
          >
            <Suspense fallback={<Loading />}>
              <HighlightedRepos />
            </Suspense>
          </CollapsibleSection>
        </Suspense>

        {/* Fintama */}
        <Suspense fallback={<Loading />}>
          <CollapsibleSection
            isCollapsed={true}
            title="Current employment (Fintama)"
            subTitle="02/2023 - current"
          >
            <Suspense fallback={<Loading />}>
              <FintamaCard />
            </Suspense>
          </CollapsibleSection>
        </Suspense>

        {/* Covario */}
        <Suspense fallback={<Loading />}>
          <CollapsibleSection
            isCollapsed={true}
            title="TL / Senior Developer (Covario)"
            subTitle="03/2021 - 01/2023"
          >
            <Suspense fallback={<Loading />}>
              <CovarioCard />
            </Suspense>
          </CollapsibleSection>
        </Suspense>

        {/* Amaris */}
        <Suspense fallback={<Loading />}>
          <CollapsibleSection
            isCollapsed={true}
            title="IT Consultant (Amaris)"
            subTitle="04/2020 - 03/2021"
          >
            <Suspense fallback={<Loading />}>
              <AmarisCard />
            </Suspense>
          </CollapsibleSection>
        </Suspense>

        {/* Cognizant */}
        <Suspense fallback={<Loading />}>
          <CollapsibleSection
            isCollapsed={true}
            title="Mobile / BE Developer (Cognizant)"
            subTitle="06/2019 - 04/2020"
          >
            <Suspense fallback={<Loading />}>
              <CognizantCard />
            </Suspense>
          </CollapsibleSection>
        </Suspense>

        {/* Bosch */}
        <Suspense fallback={<Loading />}>
          <CollapsibleSection
            isCollapsed={true}
            title="Software Development Engineer (BOSCH)"
            subTitle="07/2018 - 06/2019"
          >
            <Suspense fallback={<Loading />}>
              <BoschCard />
            </Suspense>
          </CollapsibleSection>
        </Suspense>

        {/* DVSE */}
        <Suspense fallback={<Loading />}>
          <CollapsibleSection
            isCollapsed={true}
            title="First Developer Job (DVSE.ro)"
            subTitle="06/2016 - 07/2018"
          >
            <Suspense fallback={<Loading />}>
              <DVSECard />
            </Suspense>
          </CollapsibleSection>
        </Suspense>

        {/* IT Support */}
        <Suspense fallback={<Loading />}>
          <CollapsibleSection
            isCollapsed={true}
            title="Support Technician (NewV Technologies)"
            subTitle="06/2015 - 06/2016"
          >
            <Suspense fallback={<Loading />}>
              <ItSupportTechnicianCard />
            </Suspense>
          </CollapsibleSection>
        </Suspense>

        {/* Sample Screens */}
        <Suspense fallback={<Loading />}>
          <CollapsibleSection title="Sample screens from previous work.">
            {!!workImages?.length && (
              <Suspense fallback={<Loading />}>
                <ImageSlider images={workImages} />
              </Suspense>
            )}
          </CollapsibleSection>
        </Suspense>

        {/* Trading App */}
        <Suspense fallback={<Loading />}>
          <CollapsibleSection title="Trading App (Crypto trading platform)">
            <Suspense fallback={<Loading />}>
              <YoutubeVideoLink />
            </Suspense>
          </CollapsibleSection>
        </Suspense>
      </div>
    </div>
  );
};

export default MainPage;
