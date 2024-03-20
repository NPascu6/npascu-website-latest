import { RootState } from "../../store/store";
import { _githubAvatarUrl } from "../../_constant";
import { useSelector } from 'react-redux';
import DownloadIcon from "../../assets/icons/DownloadIcon";
import LinkedInIcon from "../../assets/icons/LinkedIn";
import Facebook from "../../assets/icons/Facebook";
import Instagram from "../../assets/icons/Instagram";
import GitHub from "../../assets/icons/Github";
import Email from "../../assets/icons/Email";
import Phone from "../../assets/icons/Phone";

const GithubProfileCard = () => {
    const { githubProfile } = useSelector((state: RootState) => state.app);

    return (
        <div id="github-profile-card" className={`p-1 lg:w-1/3 shadow-xl`}>
            <a href="./PascuNorbertresumeEN.pdf" download={'PascuNorbertresumeEN.pdf'} rel="_noreferer" className="text-center flex justify-between border border-green-600 p-1">
                Download CV
                <span><DownloadIcon color={'green'} /></span>
            </a>
            <div className="text-start flex items-center justify-center">
                <div className="mt-2 mx-2">
                    <p className={`text-md font-bold`}>{githubProfile?.name}</p>
                    <p className={`text-sm`}>{`${githubProfile?.bio}Zurich`}</p>
                    <p className="text-md  border mt-2 p-1 ">
                        <a href="mailto:norbipascu92@gmail.com" className={`font-bold flex justify-between p-1`}>
                            norbipascu92@gmail.com
                            <span style={{ color: 'green' }}>
                                <Email />
                            </span>
                        </a>

                    </p>
                    <p className="text-md border mt-2 p-1">
                        <a href="tel:+41765951562" className={`font-bold flex justify-between p-1`}>
                            +41765951562
                            <span style={{ color: 'green' }}>
                                <Phone />
                            </span>
                        </a>
                    </p>
                </div>
                <img
                    src={_githubAvatarUrl}
                    alt="Profile"
                    style={{
                        width: "6rem",
                        height: "10rem",
                        objectFit: "cover",
                    }}
                    className=" mx-auto mt-4 mr-13"
                />
            </div>
            <div className="mb-4 mt-2">
                <div className="flex justify-center items-center w-full mt-2">
                    <div className="text-center w-full">
                        <a
                            href="https://www.linkedin.com/in/norbert-pascu-5b1857116/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`cursor-pointer flex justify-center items-center w-full`}>
                            <div>
                                <LinkedInIcon height={32} width={32} />
                            </div>
                            <div className="text-md text-center">
                                Linkedin
                            </div>
                        </a>
                    </div>
                    <div className="text-center w-full mr-4">
                        <a href={githubProfile?.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`cursor-pointer flex justify-center items-center w-full`}>
                            <div>
                                <GitHub height={32} width={32} />
                            </div>
                            <div className="text-md text-center">
                                GitHub
                            </div>
                        </a>
                    </div>
                </div>
                <div className="flex justify-center items-center w-full mt-2">
                    <div className="text-center w-full">
                        <a
                            href="https://www.facebook.com/norbi.pascu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`cursor-pointer flex justify-center items-center w-full`}>
                            <div>
                                <Facebook height={32} width={32} />
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
                            className={`cursor-pointer flex justify-center items-center w-full`}>
                            <div>
                                <Instagram height={32} width={32} />
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
