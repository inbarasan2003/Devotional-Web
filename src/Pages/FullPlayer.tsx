import { motion } from "framer-motion"; // for animation (slide up/down)
import { useAudio } from "../context/AudioProvider"; // get global audio data
import { useEffect, useState } from "react";

export default function FullPlayer() {

  const {
    title,        // current song title
    image,        // current song image
    isPlaying,    // playing state (true/false)
    // setIsPlaying,
    audioRef,     // reference to audio element
    setIsExpanded, // close full player
    // playlist,
    // currentIndex,
    // setCurrentIndex,
    // setAudio,
    // setTitle,
    // setImage
  } = useAudio();

  const [currentTime, setCurrentTime] = useState(0); // store current time
  const [duration, setDuration] = useState(0);       // store total duration

  const [progress, setProgress] = useState(0); // store progress %

  useEffect(() => {
    const interval = setInterval(() => {

      // check audio exists
      if (audioRef.current) {

        const current = audioRef.current.currentTime; // current playing time
        const dur = audioRef.current.duration || 1;   // total duration

        setCurrentTime(current); // update current time
        setDuration(dur);        // update duration

        setProgress((current / dur) * 100); // 🔥 calculate % progress
      }

    }, 500); // runs every 500ms

    return () => clearInterval(interval); // cleanup interval
  }, []);

  const handleSeek = (e: any) => {
    if (!audioRef.current) return; // safety check

    const rect = e.currentTarget.getBoundingClientRect(); // get bar position
    const clickX = e.clientX - rect.left; // where user clicked
    const width = rect.width; // total width of bar

    const newTime = (clickX / width) * duration; // calculate new time
    audioRef.current.currentTime = newTime; // jump audio
  };

  const format = (t: number) => {
    const m = Math.floor(t / 60); // minutes
    const s = Math.floor(t % 60); // seconds
    return `${m}:${s < 10 ? "0" : ""}${s}`; // format mm:ss
  };

  // next
  //   const handleNext = () => {
  //     if (currentIndex < playlist.length - 1) {
  //       const next = playlist[currentIndex + 1];

  //       setCurrentIndex(currentIndex + 1);
  //       setAudio(next.audio);
  //       setTitle(next.title);
  //       setImage(next.photos?.[0] || next.titlePhoto);
  //     }
  //   };

  // prev
  //   const handlePrev = () => {
  //     if (currentIndex > 0) {
  //       const prev = playlist[currentIndex - 1];

  //       setCurrentIndex(currentIndex - 1);
  //       setAudio(prev.audio);
  //       setTitle(prev.title);
  //       setImage(prev.photos?.[0] || prev.titlePhoto);
  //     }
  //   };

  return (
    <motion.div
      initial={{ y: "100%" }} // start from bottom
      animate={{ y: 0 }}      // slide to top
      exit={{ y: "100%" }}    // exit to bottom
      transition={{ duration: 0.3 }} // animation speed
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-white"
    >

      {/* 🔥 BLUR BG */}
      {image && (
        <div className="absolute inset-0 -z-10">

          <img
            src={image}
            className="w-full h-full object-cover blur-2xl scale-110"
          /> {/* blurred background image */}

          <div className="absolute inset-0 bg-black/50" /> {/* dark overlay */}

        </div>
      )}

      <button
        onClick={() => setIsExpanded(false)} // close full player
        className="absolute top-5 right-5"
      >
        ✕
      </button>

      {/* image */}
      {image && (
        <img
          src={image}
          className="w-60 h-60 rounded-xl mb-6 object-cover"
        /> // main album image
      )}

      <h2 className="mb-2">{title}</h2> {/* song title */}

      <div className="flex justify-between w-full max-w-xs text-sm mb-2">

        <span>{format(currentTime)}</span> {/* current time */}

        <span>{format(duration)}</span> {/* total duration */}

      </div>

      <div
        onClick={handleSeek} // click → seek audio
        className="w-full max-w-xs h-1 bg-gray-300 mt-2 rounded cursor-pointer"
      >
        <div
          className="h-1 bg-orange-500 rounded"
          style={{ width: `${progress}%` }} // dynamic progress width
        />
      </div>

      {/* waveform */}
      {isPlaying && (
        <div className="flex gap-1 mb-4 mt-4">

          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-orange-400 animate-wave"
              style={{ animationDelay: `${i * 0.1}s` }} // delay animation
            />
          ))}

        </div>
      )}

      {/* controls */}
      <div className="flex gap-6 mt-4">
        {/* <button onClick={handlePrev}>⏮</button> */}

        <button
          onClick={() => {

            // toggle play/pause
            isPlaying
              ? audioRef.current?.pause()
              : audioRef.current?.play();

          }}
          className="text-2xl bg-orange-500 px-5 py-2 rounded-full"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        {/* <button onClick={handleNext}>⏭</button> */}
      </div>

    </motion.div>
  );
}