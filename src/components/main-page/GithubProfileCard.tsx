import { RootState } from "../../store/store";
import { _githubAvatarUrl } from "../../_constant";
import { useSelector } from "react-redux";
import LinkedInIcon from "../../assets/icons/LinkedIn";
import Facebook from "../../assets/icons/Facebook";
import Instagram from "../../assets/icons/Instagram";
import GitHub from "../../assets/icons/Github";
import Email from "../../assets/icons/Email";
import Phone from "../../assets/icons/Phone";

const GithubProfileCard = () => {
  const { githubProfile } = useSelector((state: RootState) => state.app);

  return (
    <div id="github-profile-card" className={`p-2 shadow-xl`}>
      <div className="text-start flex items-center justify-center">
        <div className="mt-2">
          <div className="pl-3">
            <p className={`text-md font-bold`}>{githubProfile?.name}</p>
            <p className={`text-sm`}>{`${githubProfile?.bio}Zurich`}</p>
          </div>
          <p className="text-md  mt-2 p-1 ">
            <a
              href="mailto:norbipascu92@gmail.com"
              className={`font-bold flex justify-between p-1 border border-gray-600 p-2 hover:text-white hover:bg-green-700 transition-colors duration-300 ease-in-out`}
            >
              norbipascu92@gmail.com
              <span style={{ color: "green", marginLeft: 10 }}>
                <Email />
              </span>
            </a>
          </p>
          <p className="text-md mt-2 p-1">
            <a
              href="tel:+41765951562"
              className={`font-bold flex justify-between p-1 border border-gray-600 p-2 hover:text-white hover:bg-green-700 transition-colors duration-300 ease-in-out`}
            >
              +41765951562
              <span style={{ color: "green", marginLeft: 10 }}>
                <Phone />
              </span>
            </a>
          </p>
        </div>
        <img
          loading="lazy"
          src={_githubAvatarUrl}
          alt="Profile"
          style={{
            width: "6rem",
            height: "10.2rem",
            objectFit: "cover",
          }}
          className="mx-auto mt-4 mr-13"
        />
      </div>
      <div className="mb-4 mt-2">
        <div className="flex justify-center items-center w-full mt-2">
          <div className="text-center w-full">
            <a
              href="https://www.linkedin.com/in/norbert-pascu-5b1857116/"
              target="_blank"
              rel="noopener noreferrer"
              className={`cursor-pointer flex justify-center items-center w-full`}
            >
              <div>
                <LinkedInIcon height={32} width={32} />
              </div>
              <div className="text-md text-center">Linkedin</div>
            </a>
          </div>
          <div className="text-center w-full mr-4">
            <a
              href={githubProfile?.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`cursor-pointer flex justify-center items-center w-full`}
            >
              <div>
                <GitHub height={32} width={32} />
              </div>
              <div className="text-md text-center">GitHub</div>
            </a>
          </div>
        </div>
        <div className="flex justify-center items-center w-full mt-2">
          <div className="text-center w-full">
            <a
              href="https://www.facebook.com/norbi.pascu"
              target="_blank"
              rel="noopener noreferrer"
              className={`cursor-pointer flex justify-center items-center w-full`}
            >
              <div>
                <Facebook height={32} width={32} />
              </div>
              <div className="text-md text-center">Facebook</div>
            </a>
          </div>
          <div className="text-center w-full">
            <a
              href="https://www.instagram.com/norbipascu/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className={`cursor-pointer flex justify-center items-center w-full`}
            >
              <div>
                <Instagram height={32} width={32} />
              </div>
              <div className="text-md text-center">Instagram</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GithubProfileCard;
