import {RootState} from "../../store/store";
import {_githubAvatarUrl} from "../../_constant";
import {useSelector} from "react-redux";

import Email from "../../assets/icons/Email";
import Phone from "../../assets/icons/Phone";

const GithubProfileCard = () => {
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);

    // Define dynamic colors based on the theme
    const bgColor = isDarkTheme ? "bg-gray-800" : "bg-white";
    const textColor = isDarkTheme ? "text-gray-100" : "text-gray-900";
    const secondaryTextColor = isDarkTheme ? "text-gray-400" : "text-gray-800";
    const accentColor = isDarkTheme ? "text-green-400" : "text-green-600";
    const borderColor = isDarkTheme ? "border-gray-700" : "border-gray-300";
    const hoverBgColor = "hover:bg-blue-500";
    const hoverTextColor = "hover:text-white";

    return (
        <div
            id="github-profile-card"
            className={`max-w-md mx-auto ${bgColor} shadow-md  overflow-hidden p-1 transition-transform duration-300 hover:scale-105`}
        >
            <div className="flex flex-col items-center">
                {/* Profile Avatar */}
                <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-green-700 shadow-md">
                    <img
                        src={_githubAvatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>

                {/* Profile Details */}
                <h2 className={`mt-2 text-2xl font-bold ${textColor}`}>
                    {"Norbert Pascu"}
                </h2>
                <p className={`mt-1 text-sm ${secondaryTextColor}`}>
                    Zurich, Switzerland
                </p>

                {/* Additional Info */}
                <div className="mt-2 text-center px-2">
                    <p className={`text-base ${textColor}`}>
                        Specializing in{" "}
                        <span className={`font-semibold ${accentColor}`}>
              .NET, React, and F#
            </span>
                    </p>
                    <p className={`mt-1 text-sm ${textColor}`}>
                        <span className="font-semibold">Full-Stack Engineer</span> |{" "}
                        <span className="font-semibold">Tech Enthusiast</span> | 9+ years of
                        experience in{" "}
                        <span className="font-semibold">
              Fintech, Retail, Automobile, and Chemical Industry
            </span>
                    </p>
                </div>
            </div>

            {/* Contact Links */}
            <div className="mt-2 grid grid-cols-1 gap-2">
                <a
                    href="mailto:norbipascu92@gmail.com"
                    className={`flex items-center justify-center gap-2 px-2 py-2 border ${borderColor}  text-green-500 ${hoverBgColor} ${hoverTextColor} transition-colors duration-300`}
                >
                    <Email/>
                    <span>norbipascu92@gmail.com</span>
                </a>
                <a
                    href="tel:+41765951562"
                    className={`flex items-center justify-center gap-2 px-2 py-2 border ${borderColor}  text-green-500 ${hoverBgColor} ${hoverTextColor} transition-colors duration-300`}
                >
                    <Phone/>
                    <span>+41765951562</span>
                </a>
            </div>
        </div>
    );
};

export default GithubProfileCard;
