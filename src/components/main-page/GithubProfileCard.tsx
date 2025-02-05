import { RootState } from "../../store/store";
import { _githubAvatarUrl } from "../../_constant";
import { useSelector } from "react-redux";

import Email from "../../assets/icons/Email";
import Phone from "../../assets/icons/Phone";

const GithubProfileCard = () => {
  const { githubProfile } = useSelector((state: RootState) => state.app);

  return (
    <div
      id="github-profile-card"
      className={`shadow-xl text-start flex flex-col items-center justify-center`}
    >
      <div className="text-start flex items-center justify-evenly w-full">
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
          className="mt-4"
        />
      </div>
    </div>
  );
};

export default GithubProfileCard;
