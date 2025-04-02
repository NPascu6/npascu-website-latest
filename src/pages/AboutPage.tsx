import React from "react";
import InstagramImage from "../assets/instagram_1.jpg";
import CloseIcon from "../assets/icons/CloseIcon";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../store/store";
import {useTranslation} from "react-i18next";

const AboutPage = () => {
    const nav = useNavigate();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const {t} = useTranslation();

    return (
        <div
            style={{height: "calc(100vh - 5.5rem)", overflow: "auto"}}
            className={`flex items-center justify-center transition-colors ${
                isDarkTheme ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
            }`}
        >
            <div
                className={`max-w-xl shadow-xl p-2 transition-colors ${
                    isDarkTheme ? "bg-gray-800" : "bg-white"
                }`}
            >
                <div className="flex justify-between items-center">
                    <div></div>
                    <div className="cursor-pointer" onClick={() => nav("/")}>
                        <CloseIcon/>
                    </div>
                </div>
                <div className="mb-2 flex justify-center">
                    <img
                        loading="lazy"
                        id="about-image"
                        src={InstagramImage}
                        className="rounded-xl shadow-lg"
                        style={{height: "15em"}}
                        alt={t("about.imageAlt")}
                    />
                </div>
                <div className="flex flex-col items-center text-center space-y-3">
                    <p className={`text-lg ${isDarkTheme ? "text-gray-300" : "text-gray-700"}`}>
                        {t("about.role")}
                    </p>
                    <p className={isDarkTheme ? "text-gray-400" : "text-gray-600"}>
                        {t("about.intro")}
                    </p>
                    <p className={isDarkTheme ? "text-gray-400" : "text-gray-600"}>
                        {t("about.experience")}
                    </p>
                    <p className={isDarkTheme ? "text-gray-400" : "text-gray-600"}>
                        {t("about.hobbies")}
                    </p>
                    <p
                        className={`text-lg font-semibold ${
                            isDarkTheme ? "text-indigo-400" : "text-indigo-600"
                        }`}
                    >
                        {t("about.callToAction")}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
