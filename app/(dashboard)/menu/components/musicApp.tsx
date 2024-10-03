'use client'

import { motion } from "framer-motion";
import { songs } from "../data/songList";
import { useState, useRef, useEffect } from "react";
import { useThemeContext } from "@/providers/ThemeProvider";
import { FaPlay, FaPause, FaForward, FaBackward, FaRedo, FaRandom } from "react-icons/fa";

const MusicApp = () => {
    const { theme } = useThemeContext()
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState<number>(0);
    const [isLooping, setIsLooping] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isShuffling, setIsShuffling] = useState<boolean>(false);
    const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);

    const currentSong = songs[currentSongIndex];

    const handleToggleShuffle = () => {
        setIsShuffling(!isShuffling);
    };

    const handlePreviousSong = () => {
        setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1));
    };

    const handleToggleLoop = () => {
        setIsLooping(!isLooping);
        if (audioRef.current) {
            audioRef.current.loop = !isLooping;
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const currentTime = audioRef.current.currentTime;
            const duration = audioRef.current.duration;
            setProgress((currentTime / duration) * 100 || 0);
        }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            const duration = audioRef.current.duration;
            audioRef.current.currentTime = (Number(e.target.value) / 100) * duration;
            setProgress(Number(e.target.value));
        }
    };

    const handleNextSong = () => {
        if (isShuffling) {
            const randomIndex = Math.floor(Math.random() * songs.length);
            setCurrentSongIndex(randomIndex);
        } else {
            setCurrentSongIndex((prev) => (prev === songs.length - 1 ? 0 : prev + 1));
        }
    };

    const handlePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }

        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.load();
        }
    }, [currentSongIndex]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const playAudio = () => {
                if (isPlaying) {
                    audio.play();
                }
            };
            audio.addEventListener('canplaythrough', playAudio);

            return () => {
                audio.removeEventListener('canplaythrough', playAudio);
            };
        }
    }, [isPlaying, currentSongIndex]);

    return (
        <motion.div
            className="flex lg:flex-col items-center justify-between w-full h-full py-4"
            initial={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="hidden sm:flex  justify-center place-items-center h-full px-4">
                <motion.div
                    className="flex w-32 h-32 sm:w-44 sm:h-44 xl:w-52 xl:h-52 2xl:h-60 2xl:w-60 rounded-full overflow-hidden shadow-lg justify-center place-items-center mt-1"
                    style={{
                        backgroundImage: `url(${currentSong.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ repeat: isPlaying ? Infinity : 0, duration: 10, ease: "linear" }}
                >
                    <div className="bg-[#000000] h-10 w-10 sm:h-16 sm:w-16 rounded-full flex justify-center place-items-center">
                        <div className="bg-white h-6 w-6 sm:h-10 sm:w-10 rounded-full" />
                    </div>
                </motion.div>
            </div>

            <div className="rounded-lg text-center w-full flex flex-col place-items-center px-4">
                <h2 className="text-xl font-bold text-blue-700 dark:text-white mt-1">{currentSong.title}</h2>
                <p className="text-sm text-blue-800 dark:text-gray-500">{currentSong.author}</p>

                <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} src={currentSong.audio} onEnded={handleNextSong} />

                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleProgressChange}
                    className="w-full h-2 bg-gray-300 rounded-full appearance-none mb-4 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500 transition-all"
                    style={{
                        background: `linear-gradient(to right, ${theme == "dark" ? "#3b82f6" : "#1b254b"} ${progress + 0.2}%, #d1d5db ${progress + 0.2}%)`,
                    }}
                />

                <div className="flex items-center justify-center space-x-4">
                    <button
                        className={`p-3 pt-2 rounded-full text-blue-700 dark:text-white hover:text-blue-500 focus:outline-none ${isShuffling ? "text-blue-500" : "dark:text-gray-400 text-blue-700"}`}
                        onClick={handleToggleShuffle}
                    >
                        <FaRandom />
                    </button>
                    <button
                        className="p-3 pt-2 rounded-full text-blue-700 dark:text-white hover:text-blue-500 focus:outline-none"
                        onClick={handlePreviousSong}
                    >
                        <FaBackward />
                    </button>
                    <button
                        className="p-3 pt-2 rounded-full text-blue-700 dark:text-white hover:text-blue-500 focus:outline-none"
                        onClick={handlePlayPause}
                    >
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <button
                        className="p-3 pt-2 rounded-full text-blue-700 dark:text-white hover:text-blue-500 focus:outline-none"
                        onClick={handleNextSong}
                    >
                        <FaForward />
                    </button>
                    <button
                        className={`p-3 pt-2 rounded-full text-blue-700 hover:text-blue-500 focus:outline-none ${isLooping ? "text-blue-500" : "dark:text-gray-400 text-blue-700"}`}
                        onClick={handleToggleLoop}
                    >
                        <FaRedo />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default MusicApp;
