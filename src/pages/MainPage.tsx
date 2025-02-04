import React, { useEffect, useState, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchGithubUserProfile } from "../store/thunks/appThunk";
import { workImages as images } from "../_constant";
import { setWorkPhotos } from "../store/reducers/appReducer";

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

const GamesCardPage = lazy(
  () => import("../components/main-page/GamesContainer")
);

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
    <div className="p-1" id="main-page">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
        {/* Wrap each lazy component in Suspense */}
        <Suspense fallback={<div>Loading profile...</div>}>
          <GithubProfileCard />
        </Suspense>

        <Suspense fallback={<div>Loading games...</div>}>
          <GamesCardPage />
        </Suspense>
      </div>

      <div className="mt-4 space-y-4">
        {/* Example: Wrap CollapsibleSection in Suspense or only the card inside */}
        <Suspense fallback={<div>Loading section...</div>}>
          <CollapsibleSection
            title="Education"
            subTitle="Diploma, courses and specialization"
          >
            <Suspense fallback={<div>Loading education card...</div>}>
              <EducationCard />
            </Suspense>
          </CollapsibleSection>
        </Suspense>

        <Suspense fallback={<div>Loading repos...</div>}>
          <CollapsibleSection
            title="Highlighted Github Repos"
            subTitle="Github"
          >
            <Suspense fallback={<div>Loading highlighted repos...</div>}>
              <HighlightedRepos />
            </Suspense>
          </CollapsibleSection>
        </Suspense>

        {/* Fintama */}
        <Suspense fallback={<div>Loading Fintama card...</div>}>
          <CollapsibleSection
            title="Current employment (Fintama)"
            subTitle="02/2023 - current"
          >
            <Suspense fallback={<div>Loading card...</div>}>
              <FintamaCard />
            </Suspense>
          </CollapsibleSection>
        </Suspense>

        {/* Covario */}
        <Suspense fallback={<div>Loading Covario card...</div>}>
          <CollapsibleSection
            title="TL / Senior Developer (Covario)"
            subTitle="03/2021 - 01/2023"
          >
            <Suspense fallback={<div>Loading card...</div>}>
              <CovarioCard />
            </Suspense>
          </CollapsibleSection>
        </Suspense>

        {/* Amaris */}
        <Suspense fallback={<div>Loading Amaris card...</div>}>
          <CollapsibleSection
            title="IT Consultant (Amaris)"
            subTitle="04/2020 - 03/2021"
          >
            <Suspense fallback={<div>Loading card...</div>}>
              <AmarisCard />
            </Suspense>
          </CollapsibleSection>
        </Suspense>

        {/* Cognizant */}
        <Suspense fallback={<div>Loading Cognizant card...</div>}>
          <CollapsibleSection
            title="Mobile / BE Developer (Cognizant)"
            subTitle="06/2019 - 04/2020"
          >
            <Suspense fallback={<div>Loading card...</div>}>
              <CognizantCard />
            </Suspense>
          </CollapsibleSection>
        </Suspense>

        {/* Bosch */}
        <Suspense fallback={<div>Loading Bosch card...</div>}>
          <CollapsibleSection
            title="Software Development Engineer (BOSCH)"
            subTitle="07/2018 - 06/2019"
          >
            <Suspense fallback={<div>Loading card...</div>}>
              <BoschCard />
            </Suspense>
          </CollapsibleSection>
        </Suspense>

        {/* DVSE */}
        <Suspense fallback={<div>Loading DVSE card...</div>}>
          <CollapsibleSection
            title="First Developer Job (DVSE.ro)"
            subTitle="06/2016 - 07/2018"
          >
            <Suspense fallback={<div>Loading card...</div>}>
              <DVSECard />
            </Suspense>
          </CollapsibleSection>
        </Suspense>

        {/* IT Support */}
        <Suspense fallback={<div>Loading IT Support Technician card...</div>}>
          <CollapsibleSection
            title="Support Technician (NewV Technologies)"
            subTitle="06/2015 - 06/2016"
          >
            <Suspense fallback={<div>Loading card...</div>}>
              <ItSupportTechnicianCard />
            </Suspense>
          </CollapsibleSection>
        </Suspense>

        {/* Sample Screens */}
        <Suspense fallback={<div>Loading image slider...</div>}>
          <CollapsibleSection title="Sample screens from previous work.">
            {!!workImages?.length && (
              <Suspense fallback={<div>Loading slider...</div>}>
                <ImageSlider images={workImages} />
              </Suspense>
            )}
          </CollapsibleSection>
        </Suspense>

        {/* Trading App */}
        <Suspense fallback={<div>Loading trading app video...</div>}>
          <CollapsibleSection title="Trading App (Crypto trading platform)">
            <Suspense fallback={<div>Loading video link...</div>}>
              <YoutubeVideoLink />
            </Suspense>
          </CollapsibleSection>
        </Suspense>
      </div>
    </div>
  );
};

export default MainPage;
