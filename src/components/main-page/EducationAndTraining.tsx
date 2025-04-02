import React from "react";
import {useTranslation} from "react-i18next";

const EducationCard: React.FC = () => {
    const {t} = useTranslation();

    return (
        <div className="shadow-md p-3 m-3 card">
            <h2 className="text-xl font-semibold">
                {t("educationCard.title")}
            </h2>

            <div className="mt-2">
                <h3 className="text-lg font-semibold">
                    {t("educationCard.highSchool.title")}
                </h3>
                <p className="text-sm text-gray-500">
                    {t("educationCard.highSchool.institution")}
                </p>
            </div>

            <div className="mt-2">
                <h3 className="text-lg font-semibold">
                    {t("educationCard.bachelorCSM.title")}
                </h3>
                <p className="text-sm text-gray-500">
                    {t("educationCard.bachelorCSM.institution")}
                </p>
                <p className="text-sm mt-2">
                    {t("educationCard.bachelorCSM.description")}
                </p>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-semibold">
                    {t("educationCard.bachelorCIT.title")}
                </h3>
                <p className="text-sm text-gray-500">
                    {t("educationCard.bachelorCIT.institution")}
                </p>
            </div>
        </div>
    );
};

export default EducationCard;
