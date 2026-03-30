import { createContext, useContext, useRef, useState } from "react";

// create global audio context
const AudioContext = createContext<any>(null);

export const AudioProvider = ({ children }: any) => {

  // reference to <audio> element (used to control play/pause/seek)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // current audio URL
  const [audio, setAudio] = useState<string | null>(null);

  // current title of song
  const [title, setTitle] = useState("");

  // current image (cover / thumbnail)
  const [image, setImage] = useState("");

  // is audio playing or not
  const [isPlaying, setIsPlaying] = useState(false);

  // full player open or not
  const [isExpanded, setIsExpanded] = useState(false);
 
  // 🔥 playlist system

  // store full list of songs (mantra / story)
  const [playlist, setPlaylist] = useState<any[]>([]);

  // current playing index in playlist
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <AudioContext.Provider
      value={{

        // current audio + setter
        audio,
        setAudio,

        // title + setter
        title,
        setTitle,

        // image + setter
        image,
        setImage,

        // playing state + setter
        isPlaying,
        setIsPlaying,

        // audio reference (control element)
        audioRef,

        // full player expand state
        isExpanded,
        setIsExpanded,

        // playlist data
        playlist,
        setPlaylist,

        // current index
        currentIndex,
        setCurrentIndex
      }}
    >
      {children} {/* all components inside can use this context */}
    </AudioContext.Provider>
  );
};

// custom hook to use audio context
export const useAudio = () => useContext(AudioContext);