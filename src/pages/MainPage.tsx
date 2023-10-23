import { useEffect } from "react";
import EducationCard from "../components/EducationAndTraining";
import { AmarisCard, CognizantCard, CovarioCard, DVSECard, FintamaCard, ItSupportTechnicianCard } from "../components/ExperienceCards";
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
        <div>
            <GithubProfileCard />
            <div>
                <CollapsibleSection title="Education">
                    <EducationCard />
                </CollapsibleSection>
                <CollapsibleSection title={'Highlighted Github Repos'}>
                    <HighlightedRepos />
                </CollapsibleSection>
                <CollapsibleSection title="Current employment (Fintama)">
                    <FintamaCard />
                </CollapsibleSection>
                <CollapsibleSection title={"TL / Senior Developer (Covario)"}>
                    <CovarioCard />
                </CollapsibleSection>
                <CollapsibleSection title="IT Consultant (Amaris)">
                    <AmarisCard />
                </CollapsibleSection>
                <CollapsibleSection title="Mobile / BE Developer (Cognizant)">
                    <CognizantCard />
                </CollapsibleSection>
                <CollapsibleSection title="First Developer Job (DVSE.ro)">
                    <DVSECard />
                </CollapsibleSection>
                <CollapsibleSection title="Support Techinician">
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