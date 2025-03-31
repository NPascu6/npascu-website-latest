import LinkedInIcon from "../../assets/icons/LinkedIn";
import Facebook from "../../assets/icons/Facebook";
import Instagram from "../../assets/icons/Instagram";
import GitHub from "../../assets/icons/Github";
import {RootState} from "../../store/store";
import {useSelector} from "react-redux";
import Email from "../../assets/icons/Email";
import Phone from "../../assets/icons/Phone";

const BottomBar = () => {
    const {githubProfile} = useSelector((state: RootState) => state.app);

    return (
        <div className="text-start flex items-center justify-evenly w-full pt-3">
            <div className="flex justify-evenly w-full">
                <div className="text-center w-full">
                    <a
                        href="mailto:norbipascu92@gmail.com"
                        className={`cursor-pointer flex justify-center items-center w-full`}
                    >
                        <span style={{color: "green", marginLeft: 10}}>
                <Email/>
              </span>
                    </a>
                </div>
                <div className="text-center w-full">
                    <a
                        href="tel:+41765951562"
                        className={`cursor-pointer flex justify-center items-center w-full`}
                    >
                        <span style={{color: "green", marginLeft: 10}}>
                <Phone/>
              </span>
                    </a>
                </div>
            </div>
            <div className="flex justify-evenly w-full">
                <div className="text-center w-full">
                    <a
                        href="https://www.linkedin.com/in/norbert-pascu-5b1857116/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`cursor-pointer flex justify-center items-center w-full`}
                    >
                        <div>
                            <LinkedInIcon height={32} width={32}/>
                        </div>
                    </a>
                </div>
                <div className="text-center w-full">
                    <a
                        href={githubProfile?.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`cursor-pointer flex justify-center items-center w-full`}
                    >
                        <div>
                            <GitHub height={32} width={32}/>
                        </div>
                    </a>
                </div>
            </div>
            <div className="flex justify-evenly w-full">
                <div className="text-center w-full">
                    <a
                        href="https://www.facebook.com/norbi.pascu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`cursor-pointer mt-1 flex justify-center items-center w-full`}
                    >
                        <div>
                            <Facebook height={32} width={32}/>
                        </div>
                    </a>
                </div>
                <div className="text-center w-full">
                    <a
                        href="https://www.instagram.com/norbipascu/?hl=en"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`cursor-pointer flex justify-center items-center w-full mt-1`}
                    >
                        <div>
                            <Instagram height={32} width={32}/>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default BottomBar;
