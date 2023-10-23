import React from "react";
import { RootState } from "../store/store";
import { _githubAvatarUrl } from "../_constant";
import { useSelector } from 'react-redux';
import DownloadIcon from "../assets/icons/DownloadIcon";
import GithubDarkIcon from "../assets/png/github-mark.png";
import GithubLightIcon from "../assets/png/github-mark-white.png";
import LinkedInIcon from "../assets/icons/LinkedInDark";
import Facebook from "../assets/icons/Facebook";
import Instagram from "../assets/icons/Instagram";

const GithubProfileCard = () => {
    const { githubProfile } = useSelector((state: RootState) => state.app);
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const githubIcon = !isDarkTheme ? GithubDarkIcon : GithubLightIcon;

    const onDownload = () => {
        const link = document.createElement("a");
        link.download = `PascuNorbertResumeEN.pdf`;
        link.href = "./PascuNorbertresumeEN.pdf";
        link.click();
    };

    return (
        <div className={`p-2 m-2`}>
            <div className="text-start flex items-center justify-center">
                <div className="mt-2 mx-4">
                    <p className={`text-md`}>{githubProfile?.name}</p>
                    <p className={`text-md`}>[{githubProfile?.login}]</p>
                    <p className={`text-md`}>{`${githubProfile?.bio}Zurich`}</p>
                </div>
                <img
                    src={_githubAvatarUrl}
                    alt="Profile"
                    style={{
                        width: "6rem",
                        height: "6rem",
                        objectFit: "cover",
                    }}
                    className="rounded-full mx-auto mt-4 mr-4"
                />
            </div>

            <div className="text-center flex justify-between border-2 m-4 p-3" onClick={onDownload}>
                <div className="text-xl">Download CV</div>
                <div><DownloadIcon /></div>
            </div>
            <div className="mt-1 mx-4 text-center">
                <p className="text-md">
                    <a href="mailto:norbipascu92@gmail.com" className={`font-bold`}>
                        norbipascu92@gmail.com
                    </a>
                </p>
                <p className="text-lg mt-2">
                    <a href="tel:+41765951562" className={`font-bold`}>
                        +41765951562
                    </a>
                </p>
            </div>
            <div>
                <div>
                    <div className="flex justify-center items-center">
                        <div className="text-center mt-2">
                            <a
                                href="https://www.linkedin.com/in/norbert-pascu-5b1857116/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`cursor-pointer flex justify-center items-center p-2`}>
                                <div>
                                    <LinkedInIcon />
                                </div>
                                <div className="ml-4 text-md text-center">
                                    Linkedin
                                </div>
                            </a>
                        </div>
                        <div className="text-center mt-2">
                            <a href={githubProfile?.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`cursor-pointer flex justify-center items-center p-2`}>
                                <div>
                                    <img alt="githu-icon" className="h-10 w-10" src={githubIcon} />
                                </div>
                                <div className="ml-4 text-md text-center">
                                    GitHub
                                </div>
                            </a>
                        </div>

                    </div>
                    <div className="text-center mt-4 flex items-center justify-center">
                        <a href="https://www.facebook.com/norbi.pascu" target="_blank" rel="noopener noreferrer">
                            <Facebook height={42} width={42} />
                        </a>
                        <a className="ml-4" href="https://www.instagram.com/norbipascu/?hl=en" target="_blank" rel="noopener noreferrer">
                            <Instagram height={42} width={42} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GithubProfileCard;
