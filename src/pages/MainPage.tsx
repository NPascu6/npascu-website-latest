import { useEffect } from "react";
import EducationCard from "../components/EducationAndTraining";
import { AmarisCard, BoschCard, CognizantCard, CovarioCard, DVSECard, FintamaCard, ItSupportTechnicianCard } from "../components/ExperienceCards";
import GithubProfileCard from "../components/GithubProfileCard";
import YoutubeVideoLink from "../components/YoutubeVideoLink";
import CollapsibleSection from "../components/common/CollapsableSection";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { fetchGithubUserProfile } from "../store/thunks/appThunk";
import HighlightedRepos from "../components/HighlightedRepos";

const MainPage = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        let active = true;

        if (active)
            dispatch(fetchGithubUserProfile());

        return () => {
            active = false;
        }
    }, [dispatch])

    return (
        <div className="p-4 md:p-10" id="main-page">
            <div className="flex justify-center items-center">
                <GithubProfileCard />
            </div>
            <div className="space-y-2 mt-2" >
                <CollapsibleSection title="Education ">
                    <EducationCard />
                </CollapsibleSection>
                <CollapsibleSection title={'Highlighted Github Repos'}>
                    <HighlightedRepos />
                </CollapsibleSection>
                <CollapsibleSection title="Current employment (Fintama)" subTitle="02/2023 - current">
                    <FintamaCard />
                </CollapsibleSection>
                <CollapsibleSection title={"TL / Senior Developer (Covario)"} subTitle="03/2021 - 01/2023">
                    <CovarioCard />
                </CollapsibleSection>
                <CollapsibleSection title="IT Consultant (Amaris)" subTitle="04/2020 - 03/2021">
                    <AmarisCard />
                </CollapsibleSection>
                <CollapsibleSection title="Mobile / BE Developer (Cognizant)" subTitle="06/2019 - 04/2020">
                    <CognizantCard />
                </CollapsibleSection>
                <CollapsibleSection title="Software Development Engineer (BOSCH)" subTitle="07/2018 - 06/2019">
                    <BoschCard />
                </CollapsibleSection>
                <CollapsibleSection title="First Developer Job (DVSE.ro)" subTitle="06/2016 - 07/2018">
                    <DVSECard />
                </CollapsibleSection>
                <CollapsibleSection title="Support Technician (NewV Technologies)" subTitle="06/2015 - 06/2016">
                    <ItSupportTechnicianCard />
                </CollapsibleSection>
                <CollapsibleSection title="Trading App (Crypto trading platform)">
                    <YoutubeVideoLink />
                </CollapsibleSection>
            </div>
        </div>
    );
}

export default MainPage;
