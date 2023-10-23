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
        <div className={`p-2`}>
            <div className="text-start flex items-center justify-center">
                <div className="mt-2 mx-4">
                    <p className={`text-md font-bold`}>{githubProfile?.name}</p>
                    <p className={`text-sm`}>{`${githubProfile?.bio}Zurich`}</p>
                    <hr className="p-2 border-b-1" />
                    <p className="text-md">
                        <a href="mailto:norbipascu92@gmail.com" className={`font-bold`}>
                            norbipascu92@gmail.com
                        </a>
                    </p>
                    <p className="text-md">
                        <a href="tel:+41765951562" className={`font-bold`}>
                            +41765951562
                        </a>
                    </p>
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
            <div className="text-center flex justify-between border border-green-600 m-2 p-2" onClick={onDownload}>
                <div className="text-xl text-green-600">Download CV</div>
                <div><DownloadIcon color={'green'} /></div>
            </div>
            <div>
                <div className="flex justify-center items-center w-full">
                    <div className="text-center w-full">
                        <a
                            href="https://www.linkedin.com/in/norbert-pascu-5b1857116/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`cursor-pointer flex justify-center items-center p-1`}>
                            <div>
                                <LinkedInIcon />
                            </div>
                            <div className="text-md text-center">
                                Linkedin
                            </div>
                        </a>
                    </div>
                    <div className="text-center w-full">
                        <a href={githubProfile?.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`cursor-pointer flex justify-center items-center p-1 mr-4`}>
                            <div>
                                <img alt="githu-icon" className="h-11 w-11 mr-1" src={githubIcon} />
                            </div>
                            <div className="text-md text-center">
                                GitHub
                            </div>
                        </a>
                    </div>
                </div>
                <div className="flex justify-center items-center w-full">
                    <div className="text-center w-full">
                        <a
                            href="https://www.facebook.com/norbi.pascu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`cursor-pointer flex justify-center items-center p-1`}>
                            <div>
                                <Facebook height={40} width={40} />
                            </div>
                            <div className="text-md text-center">
                                Facebook
                            </div>
                        </a>
                    </div>
                    <div className="text-center w-full">
                        <a
                            href="https://www.instagram.com/norbipascu/?hl=en"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`cursor-pointer flex justify-center items-center p-1`}>
                            <div>
                                <Instagram height={40} width={40} />
                            </div>
                            <div className="text-md text-center">
                                Instagram
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GithubProfileCard;
