import React from "react";
import {useTranslation} from "react-i18next";

export const MavXCard: React.FC = () => {
    const {t} = useTranslation();
    return (
        <div className="shadow-xl p-3 m-2 card">
            <h2 className="text-xl font-semibold">{t("mavxCard.title")}</h2>
            <p>{t("mavxCard.institution")}</p>
            <p>{t("mavxCard.location")}</p>
            <ul className="list-disc ml-6 mt-4">
                <li>{t("mavxCard.responsibilities.0")}</li>
                <li>{t("mavxCard.responsibilities.1")}</li>
                <li>{t("mavxCard.responsibilities.2")}</li>
                <li>{t("mavxCard.responsibilities.3")}</li>
                <li>{t("mavxCard.responsibilities.4")}</li>
                <li>{t("mavxCard.responsibilities.5")}</li>
                <li>{t("mavxCard.responsibilities.6")}</li>
                <li>{t("mavxCard.responsibilities.7")}</li>
            </ul>
            <p className="mt-4">
                <strong>{t("mavxCard.techStackLabel")}</strong> {t("mavxCard.techStack")}
            </p>
            <p>
                <strong>{t("mavxCard.workflowLabel")}</strong> {t("mavxCard.workflow")}
            </p>
            <p>
                <strong>{t("mavxCard.cicdLabel")}</strong> {t("mavxCard.cicd")}
            </p>
        </div>
    );
};

export const FintamaCard: React.FC = () => {
    const {t} = useTranslation();
    return (
        <div className="shadow-xl p-3 m-2 card">
            <h2 className="text-xl font-semibold">{t("fintamaCard.title")}</h2>
            <p>{t("fintamaCard.institution")}</p>
            <p>{t("fintamaCard.employmentType")}</p>
            <ul className="list-disc ml-6 mt-4">
                <li>{t("fintamaCard.responsibilities.0")}</li>
                <li>{t("fintamaCard.responsibilities.1")}</li>
                <li>{t("fintamaCard.responsibilities.2")}</li>
                <li>{t("fintamaCard.responsibilities.3")}</li>
                <li>{t("fintamaCard.responsibilities.4")}</li>
                <li>{t("fintamaCard.responsibilities.5")}</li>
                <li>{t("fintamaCard.responsibilities.6")}</li>
                <li>{t("fintamaCard.responsibilities.7")}</li>
            </ul>
            <p className="mt-4">
                <strong>{t("fintamaCard.techStackLabel")}</strong> {t("fintamaCard.techStack")}
            </p>
            <p>
                <strong>{t("fintamaCard.sprintLabel")}</strong> {t("fintamaCard.sprint")}
            </p>
            <p>
                <strong>{t("fintamaCard.cicdLabel")}</strong> {t("fintamaCard.cicd")}
            </p>
            <p>
                <strong>{t("fintamaCard.backendLabel")}</strong> {t("fintamaCard.backend")}
            </p>
        </div>
    );
};

export const CovarioCard: React.FC = () => {
    const {t} = useTranslation();
    return (
        <div className="shadow-xl p-3 m-2 card">
            <h2 className="text-xl font-semibold">{t("covarioCard.title")}</h2>
            <p>{t("covarioCard.institution")}</p>
            <ul className="list-disc ml-6 mt-4">
                <li>{t("covarioCard.responsibilities.0")}</li>
                <li>{t("covarioCard.responsibilities.1")}</li>
                <li>{t("covarioCard.responsibilities.2")}</li>
                <li>{t("covarioCard.responsibilities.3")}</li>
                <li>{t("covarioCard.responsibilities.4")}</li>
                <li>{t("covarioCard.responsibilities.5")}</li>
                <li>{t("covarioCard.responsibilities.6")}</li>
                <li>{t("covarioCard.responsibilities.7")}</li>
                <li>{t("covarioCard.responsibilities.8")}</li>
            </ul>
            <p className="mt-4">
                <strong>{t("covarioCard.techStackLabel")}</strong> {t("covarioCard.techStack")}
            </p>
            <p>
                <strong>{t("covarioCard.devOpsLabel")}</strong> {t("covarioCard.devOps")}
            </p>
            <p>
                <strong>{t("covarioCard.cicdLabel")}</strong> {t("covarioCard.cicd")}
            </p>
        </div>
    );
};

export const AmarisCard: React.FC = () => {
    const {t} = useTranslation();
    return (
        <div className="shadow-xl p-3 m-2 card">
            <h2 className="text-xl font-semibold">{t("amarisCard.title")}</h2>
            <p>{t("amarisCard.institution")}</p>
            <ul className="list-disc ml-6 mt-4">
                <li>{t("amarisCard.responsibilities.0")}</li>
                <li>{t("amarisCard.responsibilities.1")}</li>
                <li>{t("amarisCard.responsibilities.2")}</li>
                <li>{t("amarisCard.responsibilities.3")}</li>
                <li>{t("amarisCard.responsibilities.4")}</li>
                <li>{t("amarisCard.responsibilities.5")}</li>
                <li>{t("amarisCard.responsibilities.6")}</li>
                <li>{t("amarisCard.responsibilities.7")}</li>
                <li>{t("amarisCard.responsibilities.8")}</li>
            </ul>
            <p className="mt-4">
                <strong>{t("amarisCard.techStackLabel")}</strong> {t("amarisCard.techStack")}
            </p>
        </div>
    );
};

export const CognizantCard: React.FC = () => {
    const {t} = useTranslation();
    return (
        <div className="shadow-xl p-3 m-2 card">
            <h2 className="text-xl font-semibold">{t("cognizantCard.title")}</h2>
            <p>{t("cognizantCard.institution")}</p>
            <ul className="list-disc ml-6 mt-4">
                <li>{t("cognizantCard.responsibilities.0")}</li>
                <li>{t("cognizantCard.responsibilities.1")}</li>
                <li>{t("cognizantCard.responsibilities.2")}</li>
                <li>{t("cognizantCard.responsibilities.3")}</li>
                <li>{t("cognizantCard.responsibilities.4")}</li>
                <li>{t("cognizantCard.responsibilities.5")}</li>
                <li>{t("cognizantCard.responsibilities.6")}</li>
                <li>{t("cognizantCard.responsibilities.7")}</li>
                <li>{t("cognizantCard.responsibilities.8")}</li>
            </ul>
            <p className="mt-4">
                <strong>{t("cognizantCard.techStackLabel")}</strong> {t("cognizantCard.techStack")}
            </p>
        </div>
    );
};

export const BoschCard: React.FC = () => {
    const {t} = useTranslation();
    return (
        <div className="shadow-xl p-3 m-2 card">
            <h2 className="text-xl font-semibold">{t("boschCard.title")}</h2>
            <p className="text-sm">{t("boschCard.institution")}</p>
            <ul className="text-sm mt-2">
                <span className="font-semibold">{t("boschCard.responsibilitiesLabel")}</span>
                <ul className="list-disc ml-8">
                    <li>{t("boschCard.responsibilities.0")}</li>
                    <li>{t("boschCard.responsibilities.1")}</li>
                    <li>{t("boschCard.responsibilities.2")}</li>
                    <li>{t("boschCard.responsibilities.3")}</li>
                    <li>{t("boschCard.responsibilities.4")}</li>
                    <li>{t("boschCard.responsibilities.5")}</li>
                </ul>
            </ul>
        </div>
    );
};

export const DVSECard: React.FC = () => {
    const {t} = useTranslation();
    return (
        <div className="shadow-xl p-3 m-2 card">
            <h2 className="text-xl font-semibold">{t("dvseCard.title")}</h2>
            <p className="text-sm">{t("dvseCard.institution")}</p>
            <div className="text-sm mt-2">
                <span className="font-semibold">{t("dvseCard.responsibilitiesLabel")}</span>
                <ul className="list-disc ml-8">
                    <li>{t("dvseCard.responsibilities.0")}</li>
                    <li>{t("dvseCard.responsibilities.1")}</li>
                    <li>{t("dvseCard.responsibilities.2")}</li>
                    <li>{t("dvseCard.responsibilities.3")}</li>
                </ul>
            </div>
        </div>
    );
};

export const ItSupportTechnicianCard: React.FC = () => {
    const {t} = useTranslation();
    return (
        <div className="shadow-xl p-3 m-2 card">
            <h2 className="text-xl font-semibold">{t("itSupportCard.title")}</h2>
            <p className="text-sm">{t("itSupportCard.institution")}</p>
            <div className="text-sm mt-2">
                <span className="font-semibold">{t("itSupportCard.responsibilitiesLabel")}</span>
                <ul className="list-disc ml-8">
                    <li>{t("itSupportCard.responsibilities.0")}</li>
                    <li>{t("itSupportCard.responsibilities.1")}</li>
                    <li>{t("itSupportCard.responsibilities.2")}</li>
                    <li>{t("itSupportCard.responsibilities.3")}</li>
                    <li>{t("itSupportCard.responsibilities.4")}</li>
                    <li>{t("itSupportCard.responsibilities.5")}</li>
                    <li>{t("itSupportCard.responsibilities.6")}</li>
                </ul>
            </div>
        </div>
    );
};
