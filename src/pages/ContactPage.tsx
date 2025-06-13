import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useTranslation } from "react-i18next";

const ContactPage: React.FC = () => {
    const { t } = useTranslation();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const mailtoLink = `mailto:norbipascu92@gmail.com?subject=Portfolio%20Contact%20from%20${encodeURIComponent(
            formData.name
        )}&body=${encodeURIComponent(formData.message)}%0A%0A${formData.email}`;
        window.location.href = mailtoLink;
    };

    return (
        <div
            style={{ height: "calc(100vh - 5.5rem)", overflow: "auto" }}
            className={`flex items-center justify-center transition-colors ${
                isDarkTheme ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
            }`}
        >
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 p-4 shadow-xl bg-white dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-center">{t("contact.title")}</h2>
                <p className="text-sm text-center mb-2">{t("contact.subtitle")}</p>
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder={t("contact.name") || "Name"}
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder={t("contact.email") || "Email"}
                />
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
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
