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
                <CollapsibleSection title={'Highlighted Repos'}>
                    <div className="m-2 mx-4 border-2 p-4 text-center">
                        <p>
                            <a
                                rel="noopener noreferrer"
                                href="https://github.com/NPascu6/react-app-starter-with-drawer-typescript"
                                className={` font-bold`}
                            >
                                This web app.
                            </a>
                        </p>
                        <p>
                            <a
                                rel="noopener noreferrer"
                                href="https://github.com/NPascu6/ASP_.NET_Starter_API"
                                className={` font-bold`}
                            >
                                .NET Core 6 API
                            </a>
                        </p>
                        <p>
                            <a
                                rel="noopener noreferrer"
                                href="https://github.com/NPascu6/npascu_net_api_v2"
                                className={` font-bold`}
                            >
                                .NET Core API (npascu_api_v2)
                            </a>
                        </p>
                    </div>
                </CollapsibleSection>
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