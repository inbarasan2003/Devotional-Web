import { useAudio } from "../context/AudioProvider"; // global audio
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MiniPlayer() {

  const {
    audio,           // audio url
    title,           // song title
    isPlaying,       // playing state
    setIsPlaying,    // update play state
    audioRef,        // audio element ref
    setAudio,        // change audio
    setIsExpanded    // open full player
  } = useAudio();

  const containerRef = useRef<HTMLDivElement>(null); // full screen container

  const [progress, setProgress] = useState(0); // progress %
  const [currentTime, setCurrentTime] = useState(0); // current time
  const [duration, setDuration] = useState(0); // total duration

  useEffect(() => {
    const interval = setInterval(() => {

      if (audioRef.current) { // check audio

        const current = audioRef.current.currentTime; // current time
        const dur = audioRef.current.duration || 1;   // duration

        setProgress((current / dur) * 100); // update %
        setCurrentTime(current); // update current
        setDuration(dur); // update duration
      }

    }, 500); // every 500ms

    return () => clearInterval(interval); // cleanup
  }, [audioRef]);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60); // minutes
    const s = Math.floor(t % 60); // seconds
    return `${m}:${s < 10 ? "0" : ""}${s}`; // format
  };

  const handleSeek = (e: any) => {
    if (!audioRef.current) return; // safety

    const rect = e.currentTarget.getBoundingClientRect(); // bar size
    const clickX = e.clientX - rect.left; // click position
    const width = rect.width; // total width

    audioRef.current.currentTime = (clickX / width) * duration; // jump audio
  };

  if (!audio) return null; // hide if no audio

  return (
    <div
      ref={containerRef} // container ref
      className="fixed inset-0 pointer-events-none z-50" // full screen layer
    >

      <motion.div
        drag // enable drag
        dragConstraints={containerRef} // limit inside screen
        dragElastic={0.2} // smooth drag
        onClick={() => setIsExpanded(true)} // open full player
        className="pointer-events-auto absolute bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/95 backdrop-blur border shadow-lg rounded-xl cursor-pointer"
      >

        <div className="p-3">

          {/* audio element */}
          <audio
            ref={audioRef} // connect ref
            src={audio}    // audio source
            autoPlay       // auto play
            onPlay={() => setIsPlaying(true)}  // when playing
            onPause={() => setIsPlaying(false)} // when paused
          />

          {/* top section */}
          <div className="flex justify-between items-center">

            <p className="text-sm truncate w-1/2">{title}</p> {/* title */}

            <div className="flex gap-3">

              {/* play/pause */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // stop expand
                  isPlaying
                    ? audioRef.current?.pause()
                    : audioRef.current?.play();
                }}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>

              {/* close */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // stop expand
                  setAudio(null); // remove audio
                }}
              >
                ✕
              </button>

            </div>
          </div>

          {/* time */}
          <div className="flex justify-between text-xs">
            <span>{formatTime(currentTime)}</span> {/* current */}
            <span>{formatTime(duration)}</span> {/* total */}
          </div>

          {/* progress bar */}
          <div
            onClick={(e) => {
              e.stopPropagation(); // stop expand
              handleSeek(e); // seek audio
            }}
            className="h-1 bg-gray-200 mt-1 cursor-pointer"
          >
            <div
              className="h-1 bg-orange-500"
              style={{ width: `${progress}%` }} // progress fill
            />
          </div>

        </div>
      </motion.div>
    </div>
  );
}