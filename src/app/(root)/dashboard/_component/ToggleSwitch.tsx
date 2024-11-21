'use client';
import React, { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const DarkModeSwitch = () => {
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (savedTheme === "dark" || (!savedTheme && prefersDarkMode)) {
            document.documentElement.classList.add("dark");
            setIsDarkMode(true);
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);

        if (newMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    return (
        <button
            type="button"
            onClick={toggleDarkMode}
            className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full
                transition-colors duration-200 ease-in-out
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75
                ${isDarkMode ? 'bg-blue-600' : 'bg-gray-200'}
                dark:bg-blue-600 dark:border-gray-700
            `}
        >
            <span className="sr-only">Toggle dark mode</span>
            
            {/* Toggle knob with icon */}
            <span
                className={`
                    ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}
                    pointer-events-none inline-flex h-4 w-4 transform items-center justify-center rounded-full
                    bg-white shadow-lg ring-0 transition duration-200 ease-in-out
                    my-1
                `}
            >
                {isDarkMode ? (
                    <Moon size={12} className="text-blue-600" />
                ) : (
                    <Sun size={12} className="text-yellow-500" />
                )}
            </span>
        </button>
    );
};

export default DarkModeSwitch;