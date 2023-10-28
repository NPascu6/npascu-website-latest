import React from "react";
import InstagramImage from "../assets/instagram_1.jpg";

const AboutPage = () => {
    return (
        <div className="min-h-screen p-4 text-center justify-center flex align-center">
            <div className="max-w-3xl mx-auto p-6 shadow-xl">
                <div className="mb-4 min-[400px]:hidden">
                    <img
                        id="about-image"
                        src={InstagramImage}
                        className="w-60 h-60 mx-auto"
                        alt=""
                    />
                </div>
                <div className="flex align-center">
                    <p>
                        Hi there! I'm Norbert Pascu, a passionate software developer with a
                        strong background in web and mobile app development. I'm dedicated to
                        delivering high-quality software solutions and continuously
                        improving my skills.
                        My journey in the world of software development started several years
                        ago when I discovered my love for coding.
                    </p>
                </div>
                <p>
                    Since then, I've worked on a
                    wide range of projects, from web applications to mobile apps,
                    contributing to the success of various teams and organizations.
                </p>
                <p>
                    I'm proficient in technologies such as React, React Native, .NET,
                    Java, and more. I enjoy tackling complex problems, and I'm always
                    eager to learn and adapt to new challenges.
                </p>
                <p>
                    When I'm not coding, you can find me exploring the latest tech trends,
                    enjoying outdoor activities, and connecting with fellow developers. I
                    believe in the power of collaboration and the endless possibilities
                    of the digital world.
                </p>
                <p>
                    Thanks for visiting my page! Feel free to reach out if you'd like to
                    connect or collaborate on exciting projects. Let's create something
                    amazing together.
                </p>
            </div>
        </div>
    );
};

export default AboutPage;
