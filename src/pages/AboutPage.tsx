import React from "react";
import InstagramImage from "../assets/instagram_1.jpg";
import CloseIcon from "../assets/icons/CloseIcon";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const AboutPage = () => {
  const nav = useNavigate();
  const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);

  return (
    <div
      className={`flex items-center justify-center min-h-screen transition-colors ${
        isDarkTheme ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`max-w-3xl mx-auto p-6 shadow-xl rounded-2xl transition-colors ${
          isDarkTheme ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <div className="cursor-pointer" onClick={() => nav("/")}>
            <CloseIcon />
          </div>
        </div>
        <div className="mb-4 flex justify-center">
          <img
            loading="lazy"
            id="about-image"
            src={InstagramImage}
            className="rounded-xl shadow-lg"
            style={{ height: "15em" }}
            alt="instagram-alt"
          />
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          <h1
            className={`text-3xl font-bold ${
              isDarkTheme ? "text-indigo-400" : "text-indigo-600"
            }`}
          >
            Norbert Pascu
          </h1>
          <p
            className={`text-lg ${
              isDarkTheme ? "text-gray-300" : "text-gray-700"
            }`}
          >
            🚀 Senior Software Engineer | Full-Stack Engineer | Tech Enthusiast
          </p>
          <p className={isDarkTheme ? "text-gray-400" : "text-gray-600"}>
            I specialize in crafting high-performance applications using React,
            .NET, and modern web technologies. Whether it's designing robust UI
            components, optimizing real-time data flows, or architecting
            scalable back-end solutions, I'm all about clean, efficient code.
          </p>
          <p className={isDarkTheme ? "text-gray-400" : "text-gray-600"}>
            With over 9 years of experience across fintech, trading platforms,
            and enterprise solutions, I've built products that push the
            boundaries of what's possible.
          </p>
          <p className={isDarkTheme ? "text-gray-400" : "text-gray-600"}>
            Away from the keyboard, I thrive on challenges—whether it's hitting
            the slopes, conquering mountain trails, or strategizing over a game
            of basketball. 🚴⛷️🏀
          </p>
          <p
            className={`text-lg font-semibold ${
              isDarkTheme ? "text-indigo-400" : "text-indigo-600"
            }`}
          >
            Let’s build something amazing.
          </p>
          <div className="flex space-x-4 mt-4">
            <a
              href="https://github.com/NPascu6"
              target="_blank"
              className={`transition ${
                isDarkTheme
                  ? "text-gray-400 hover:text-indigo-400"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              GitHub
            </a>
            <a
              href="https://pascu.io"
              target="_blank"
              className={`transition ${
                isDarkTheme
                  ? "text-gray-400 hover:text-indigo-400"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              Portfolio
            </a>
            <a
              href="https://www.linkedin.com/in/norbert-pascu-5b1857116/"
              target="_blank"
              className={`transition ${
                isDarkTheme
                  ? "text-gray-400 hover:text-indigo-400"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com/norbipascu/?hl=en"
              target="_blank"
              className={`transition ${
                isDarkTheme
                  ? "text-gray-400 hover:text-indigo-400"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
