import { useEffect, useState } from "react";
import EducationCard from "../components/main-page/EducationAndTraining";
import {
  AmarisCard,
  BoschCard,
  CognizantCard,
  CovarioCard,
  DVSECard,
  FintamaCard,
  ItSupportTechnicianCard,
} from "../components/main-page/ExperienceCards";
import GithubProfileCard from "../components/main-page/GithubProfileCard";
import YoutubeVideoLink from "../components/main-page/YoutubeVideoLink";
import CollapsibleSection from "../components/common/CollapsableSection";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchGithubUserProfile } from "../store/thunks/appThunk";
import HighlightedRepos from "../components/main-page/HighlightedRepos";
import { workImages as images } from "../_constant";
import { setWorkPhotos } from "../store/reducers/appReducer";
import ImageSlider from "../components/common/ImageSlider";
import GamesCardPage from "../components/main-page/GamesContainer";

const MainPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loadedImages, setLoadedImages] = useState<any>([]);
  const workImages = useSelector((state: RootState) => state.app.workPhotos);

  useEffect(() => {
    let active = true;

    if (!active) return;

    if (loadedImages.length > 0) return;

    Promise.all(images)
      .then((imgs) => {
        const mappedImages = imgs.map((img) => img.default);
        setLoadedImages(mappedImages);
        dispatch(setWorkPhotos(mappedImages));
      })
      .catch((error) => console.error("Error loading images", error))
      .finally(() => console.log("Images loaded"));

    return () => {
      active = false;
    };
  }, [dispatch, loadedImages]);

  useEffect(() => {
    let active = true;

    if (active) dispatch(fetchGithubUserProfile());

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="p-1 md:p-4" id="main-page">
      <div className="grid grid-cols-2 gap-1 xs:grid-cols-1 sm:grid-cols-2 justify-evenly items-center">
        <GithubProfileCard />
        <GamesCardPage />
      </div>

      <div className="mt-1">
        <CollapsibleSection
          title="Education"
          subTitle="Diploma, courses and specialization"
        >
          <EducationCard />
        </CollapsibleSection>
        <CollapsibleSection
          title={"Highlighted Github Repos"}
          subTitle="Github"
        >
          <HighlightedRepos />
        </CollapsibleSection>
        <CollapsibleSection
          title="Current employment (Fintama)"
          subTitle="02/2023 - current"
        >
          <FintamaCard />
        </CollapsibleSection>
        <CollapsibleSection
          title={"TL / Senior Developer (Covario)"}
          subTitle="03/2021 - 01/2023"
        >
          <CovarioCard />
        </CollapsibleSection>
        <CollapsibleSection
          title="IT Consultant (Amaris)"
          subTitle="04/2020 - 03/2021"
        >
          <AmarisCard />
        </CollapsibleSection>
        <CollapsibleSection
          title="Mobile / BE Developer (Cognizant)"
          subTitle="06/2019 - 04/2020"
        >
          <CognizantCard />
        </CollapsibleSection>
        <CollapsibleSection
          title="Software Development Engineer (BOSCH)"
          subTitle="07/2018 - 06/2019"
        >
          <BoschCard />
        </CollapsibleSection>
        <CollapsibleSection
          title="First Developer Job (DVSE.ro)"
          subTitle="06/2016 - 07/2018"
        >
          <DVSECard />
        </CollapsibleSection>
        <CollapsibleSection
          title="Support Technician (NewV Technologies)"
          subTitle="06/2015 - 06/2016"
        >
          <ItSupportTechnicianCard />
        </CollapsibleSection>
        <CollapsibleSection title={"Sample screens form previous work."}>
          {workImages?.length > 0 && <ImageSlider images={workImages} />}
        </CollapsibleSection>
        <CollapsibleSection
          isCollapsed
          title="Trading App (Crypto trading platform)"
        >
          <YoutubeVideoLink />
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default MainPage;
