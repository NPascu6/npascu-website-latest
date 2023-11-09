import React from 'react';
import InstagramImage from '../assets/instagram_1.jpg';

const AboutPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="max-w-3xl mx-auto p-6 shadow-xl">
                <div className="mb-4">
                    <img id="about-image" src={InstagramImage} className="mx-auto" alt="" />
                </div>
                <div className="flex flex-col items-center">
                    <p>
                        Hi there! I'm Norbert Pascu, a passionate software developer with a strong background in
                        web and mobile app development. I'm dedicated to delivering high-quality software
                        solutions and continuously improving my skills. My journey in the world of software
                        development started several years ago when I discovered my love for coding.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
