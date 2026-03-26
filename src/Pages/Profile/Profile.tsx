import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Profile() {

  const navigate = useNavigate();

  // 🔥 dummy data (later replace with real API)
  const user = {
    name: "Inbarasan K",
    email: "inbainbarasan43@email.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    mantras: '-',
    stories: '-',
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#1e293b] to-black text-white px-4 py-20">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >

        {/* 🔥 PROFILE CARD */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-6 flex flex-col md:flex-row items-center gap-6">

          {/* AVATAR */}
          <div className="flex flex-col items-center">
            <img
              src={user.avatar}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-orange-400"
            />

            <button className="mt-3 text-xs text-orange-400 hover:underline">
              Change Photo
            </button>
          </div>

          {/* INFO */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-orange-400">
              {user.name}
            </h2>
            <p className="text-gray-300 text-sm mt-1">
              {user.email}
            </p>

            {/* ACTIONS */}
            <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">

              <button
                onClick={() => navigate("/create-mantra")}
                className="bg-linear-to-r from-orange-500 to-yellow-500 px-4 py-1.5 rounded-full text-sm shadow hover:scale-105 transition"
              >
                + Add Mantra
              </button>

              <button
                onClick={() => navigate("/create-Story")}
                className="border border-orange-400 px-4 py-1.5 rounded-full text-sm hover:bg-orange-500/20 transition"
              >
                + Add Story
              </button>

            </div>
          </div>

        </div>

        {/* 🔥 STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg border border-white/10 p-4 rounded-xl text-center"
          >
            <p className="text-lg font-bold text-orange-400">{user.mantras}</p>
            <p className="text-xs text-gray-300">Mantras</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg border border-white/10 p-4 rounded-xl text-center"
          >
            <p className="text-lg font-bold text-orange-400">{user.stories}</p>
            <p className="text-xs text-gray-300">Stories</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg border border-white/10 p-4 rounded-xl text-center"
          >
            <p className="text-lg font-bold text-orange-400">🔥</p>
            <p className="text-xs text-gray-300">Streak</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg border border-white/10 p-4 rounded-xl text-center"
          >
            <p className="text-lg font-bold text-orange-400">⭐</p>
            <p className="text-xs text-gray-300">Favorites</p>
          </motion.div>

        </div>

        {/* 🔥 EXTRA SECTION */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-5">

          <h3 className="text-orange-400 font-semibold mb-3">
            Devotional Journey ✨
          </h3>

          <p className="text-sm text-gray-300 leading-relaxed">
            Stay consistent in your spiritual practice. Explore mantras,
            listen to calming audio, and read inspiring stories daily.
          </p>

        </div>

      </motion.div>
    </div>
  );
}