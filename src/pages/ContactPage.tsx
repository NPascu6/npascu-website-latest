import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { setShowToaster, setToasterMessage } from "../store/reducers/appReducer";
import { EmailService } from "../services/EmailService";

const ContactPage: React.FC = () => {
    const { t } = useTranslation();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            dispatch(setToasterMessage(t("contact.invalidEmail")));
            dispatch(setShowToaster(true));
            return;
        }

        const service = new EmailService();
        try {
            await service.sendContactEmail(formData.name, formData.email, formData.message);
            dispatch(setToasterMessage(t("contact.success")));
            dispatch(setShowToaster(true));
            setFormData({ name: "", email: "", message: "" });
        } catch (err: any) {
            if (typeof err === 'string' && err.includes('not configured')) {
                dispatch(setToasterMessage(t('contact.serviceError')));
            } else {
                dispatch(setToasterMessage(t('contact.error')));
            }
            dispatch(setShowToaster(true));
        }
    };

    return (
        <div
            style={{ height: "calc(100vh - 5.5rem)", overflow: "auto" }}
            className={`relative flex items-center justify-center transition-colors ${
                isDarkTheme ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
            }`}
        >
            <button
                onClick={() => navigate("/")}
                className="absolute right-2 top-2 px-2 py-1 bg-green-800 text-white hover:bg-green-900 transition-colors rounded text-sm border border-gray-600"
            >
                X
            </button>
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 p-4 shadow-xl bg-white dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-center">{t("contact.title")}</h2>
                <p className="text-sm text-center mb-2">{t("contact.subtitle")}</p>
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
                    placeholder={t("contact.name") || "Name"}
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
                    placeholder={t("contact.email") || "Email"}
                />
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    required
                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
                    placeholder={t("contact.message") || "Message"}
                />
                <button type="submit" className="w-full bg-green-800 text-white py-2 hover:bg-green-900 transition-colors">
                    {t("contact.send")}
                </button>
            </form>
        </div>
    );
};

export default ContactPage;
