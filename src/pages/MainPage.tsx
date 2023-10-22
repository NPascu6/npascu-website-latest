import EducationCard from "../components/EducationAndTraining";
import { AmarisCard, CognizantCard, CovarioCard, DVSECard, FintamaCard, ItSupportTechnicianCard } from "../components/ExperienceCards";
import GithubProfileCard from "../components/GithubProfileCard";
import YoutubeVideoLink from "../components/YoutubeVideoLink";
import CollapsibleSection from "../components/common/CollapsableSection";

const MainPage = () => {
    return (
        <div>
            <GithubProfileCard />
            <div>
                <CollapsibleSection title="Current job">
                    <FintamaCard />
                </CollapsibleSection>

                <CollapsibleSection title={"TL / Senior Dev - React / .NET / Azure"}>
                    <CovarioCard />
                </CollapsibleSection>
                <CollapsibleSection title="Consultant .NET / Vue">
                    <AmarisCard />

                </CollapsibleSection>
                <CollapsibleSection title="Mobile / BE Dev">
                    <CognizantCard />

                </CollapsibleSection>
                <CollapsibleSection title="First Dev Job">
                    <DVSECard />

                </CollapsibleSection>
                <CollapsibleSection title="Support Techinician">
                    <ItSupportTechnicianCard />

                </CollapsibleSection>

                <CollapsibleSection title="Education">
                    <EducationCard />
                </CollapsibleSection>

                <CollapsibleSection title="Trading App">
                    <YoutubeVideoLink />
                </CollapsibleSection>
            </div>
        </div>
    );
}

export default MainPage;