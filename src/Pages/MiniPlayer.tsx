// Import global audio context (shared audio state)
import { useAudio } from "../context/AudioProvider";

// React hooks
import { useEffect, useRef, useState } from "react";

// Animation library
import { motion } from "framer-motion";

export default function MiniPlayer() {

  // Get audio related values from context
  const {
    audio,          // audio URL
    title,          // current song title
    isPlaying,      // play/pause state
    setIsPlaying,   // update play state
    audioRef,       // reference to <audio> element
    setAudio,       // change audio (or stop)
    setIsExpanded,  // open full player
    image           // song image (thumbnail)
  } = useAudio();

  // Reference for full screen container (used for drag limits)
  const containerRef = useRef<HTMLDivElement>(null);

  // State for progress percentage (0–100)
  const [progress, setProgress] = useState(0);

  // Current playback time
  const [currentTime, setCurrentTime] = useState(0);

  // Total audio duration
  const [duration, setDuration] = useState(0);

  // Update progress every 500ms
  useEffect(() => {

    const interval = setInterval(() => {

      // Check if audio exists
      if (audioRef.current) {

        const current = audioRef.current.currentTime; // current time
        const dur = audioRef.current.duration || 1;   // total duration

        // Convert to percentage
        setProgress((current / dur) * 100);

        setCurrentTime(current); // update current time
        setDuration(dur);        // update duration
      }

    }, 500);

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);

  }, [audioRef]);

  // Convert seconds → mm:ss format
  const formatTime = (t: number) => {
    const m = Math.floor(t / 60); // minutes
    const s = Math.floor(t % 60); // seconds
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Handle user click on progress bar (seek)
  const handleSeek = (e: any) => {

    if (!audioRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect(); // bar size
    const clickX = e.clientX - rect.left; // click position
    const width = rect.width; // total width

    // Set new audio time based on click position
    audioRef.current.currentTime = (clickX / width) * duration;
  };

  // If no audio → don't show player
  if (!audio) return null;

  return (

    // Full screen invisible container (for drag boundaries)
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-50"
    >

      {/* Draggable mini player */}
      <motion.div
        drag // enable drag
        dragConstraints={containerRef} // limit inside screen
        dragElastic={0.2} // smooth drag feel

        initial={{ y: 100, opacity: 0 }} // animation start
        animate={{ y: 0, opacity: 1 }}   // animation end

        whileTap={{ scale: 0.98 }} // press effect

        onClick={() => setIsExpanded(true)} // open full player

        className="pointer-events-auto absolute bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-md cursor-pointer"
      >

        {/* Main player container */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

          {/* Background blurred image */}
          {image && (
            <div className="absolute inset-0 -z-10">
              <img
                src={image}
                className="w-full h-full object-cover blur-xl opacity-30"
              />
            </div>
          )}

          <div className="p-4">

            {/* Audio element (actual player) */}
            <audio
              ref={audioRef} // connect ref
              src={audio}    // audio source
              autoPlay       // play automatically

              // update play state
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Top section */}
            <div className="flex justify-between items-center">

              {/* Left: image + title */}
              <div className="flex items-center gap-3 w-[70%]">

                {/* Thumbnail */}
                {image && (
                  <img
                    src={image}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                )}

                {/* Title */}
                <p className="text-sm truncate text-white font-medium">
                  {title}
                </p>

              </div>

              {/* Right: controls */}
              <div className="flex gap-3 items-center">

                {/* Play / Pause button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent opening full player

                    isPlaying
                      ? audioRef.current?.pause() // pause
                      : audioRef.current?.play(); // play
                  }}
                  className="text-lg hover:scale-110 transition"
                >
                  {isPlaying ? "⏸" : "▶"}
                </button>

                {/* Close button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAudio(null); // remove audio (stop player)
                  }}
                  className="text-sm text-red-400 hover:scale-110 transition"
                >
                  ✕
                </button>

              </div>

            </div>

            {/* Time display */}
            <div className="flex justify-between text-xs mt-2 text-gray-300">
              <span>{formatTime(currentTime)}</span> {/* current */}
              <span>{formatTime(duration)}</span>    {/* total */}
            </div>

            {/* Progress bar */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleSeek(e); // seek audio
              }}
              className="h-1.5 bg-white/20 mt-1 rounded-full cursor-pointer overflow-hidden"
            >
              {/* Progress fill */}
              <div
                className="h-full bg-linear-to-r from-orange-500 to-yellow-400"
                style={{ width: `${progress}%` }} // dynamic width
              />
            </div>

          </div>
        </div>

      </motion.div>
    </div>
  );
}