import { useAudio } from "../context/AudioProvider"; // get global audio data
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function MiniPlayer() {

  // get audio related values from context
  const {
    audio,            // current audio URL
    title,            // current title
    isPlaying,        // playing state
    setIsPlaying,     // update playing state
    audioRef,         // reference to <audio> element
    setAudio,         // change audio
    setIsExpanded     // open full player
  } = useAudio();

  // state for progress bar %
  const [progress, setProgress] = useState(0);

  // current time of audio
  const [currentTime, setCurrentTime] = useState(0);

  // total duration of audio
  const [duration, setDuration] = useState(0);

  // update time + progress every 500ms
  useEffect(() => {
    const interval = setInterval(() => {

      // check if audio exists
      if (audioRef.current) {

        const current = audioRef.current.currentTime; // current time
        const dur = audioRef.current.duration || 1;   // total duration

        // calculate progress %
        setProgress((current / dur) * 100);

        // update states
        setCurrentTime(current);
        setDuration(dur);
      }

    }, 500);

    // cleanup interval
    return () => clearInterval(interval);

  }, [audioRef]);

  // convert seconds → mm:ss format
  const formatTime = (t: number) => {
    const m = Math.floor(t / 60); // minutes
    const s = Math.floor(t % 60); // seconds
    return `${m}:${s < 10 ? "0" : ""}${s}`; // formatted string
  };

  // when user clicks progress bar → jump audio
  const handleSeek = (e: any) => {

    if (!audioRef.current) return;

    // get bar position
    const rect = e.currentTarget.getBoundingClientRect();

    // click position inside bar
    const clickX = e.clientX - rect.left;

    const width = rect.width;

    // calculate new time
    const newTime = (clickX / width) * duration;

    // set audio time
    audioRef.current.currentTime = newTime;
  };

  // if no audio → don't show player
  if (!audio) return null;

  return (
    <motion.div
      drag // makes player draggable
      onClick={() => setIsExpanded(true)} // click → open full player
      className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/95 backdrop-blur border shadow-lg rounded-xl z-50 cursor-pointer"
    >
      <div className="p-3">

        {/* hidden audio element */}
        <audio
          ref={audioRef} // connect ref
          src={audio}    // audio source
          autoPlay       // play automatically
          onPlay={() => setIsPlaying(true)}  // when playing
          onPause={() => setIsPlaying(false)} // when paused
        />

        {/* top section */}
        <div className="flex justify-between items-center">

          {/* title */}
          <p className="text-sm truncate w-1/2">
            {title}
          </p>

          {/* controls */}
          <div className="flex gap-3">

            {/* play / pause button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent opening full player

                // toggle play/pause
                isPlaying
                  ? audioRef.current?.pause()
                  : audioRef.current?.play();
              }}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>

            {/* close player */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent expand
                setAudio(null); // remove audio → player hide
              }}
            >
              ✕
            </button>

          </div>
        </div>

        {/* time display */}
        <div className="flex justify-between text-xs">

          {/* current time */}
          <span>{formatTime(currentTime)}</span>

          {/* total duration */}
          <span>{formatTime(duration)}</span>

        </div>

        {/* progress bar */}
        <div
          onClick={(e) => {
            e.stopPropagation(); // prevent expand
            handleSeek(e);       // jump audio
          }}
          className="h-1 bg-gray-200 mt-1 cursor-pointer"
        >

          {/* progress fill */}
          <div
            className="h-1 bg-orange-500"
            style={{ width: `${progress}%` }} // dynamic width
          />

        </div>

      </div>
    </motion.div>
  );
}