import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {

  const navigate = useNavigate();

  return (
    <div className="mt-16 min-h-screen flex flex-col bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#020617] text-white">

      {/* 🔥 HERO */}
      <section className="text-center px-4 py-16 relative overflow-hidden">

        {/* glow */}
        <div className="absolute w-72 h-72 bg-orange-500/20 blur-3xl rounded-full top-10 left-10"></div>
        <div className="absolute w-72 h-72 bg-yellow-500/10 blur-3xl rounded-full bottom-10 right-10"></div>

        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold text-orange-400"
        >
          🪔 Devotional World
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-gray-300 max-w-xl mx-auto"
        >
          Experience peace through mantras, stories, and divine sounds.
        </motion.p>

        <div className="mt-6 flex justify-center gap-4 flex-wrap">

          <button
            onClick={() => navigate("/mantra")}
            className="bg-linear-to-r from-orange-500 to-yellow-500 px-6 py-2 rounded-full shadow-lg hover:scale-105 transition"
          >
            Explore Mantras
          </button>

          <button
            onClick={() => navigate("/stories")}
            className="border border-orange-400 px-6 py-2 rounded-full hover:bg-orange-500/20 transition"
          >
            Read Stories
          </button>

        </div>

      </section>

      {/* 🔥 FEATURES */}
      <section className="px-4 py-10 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {["🕉 Mantras", "📖 Stories", "🎧 Audio"].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg text-center border border-white/10"
          >
            <h2 className="text-orange-400 font-semibold">{item}</h2>
            <p className="text-gray-300 text-sm mt-2">
              Spiritual content for peace & focus
            </p>
          </motion.div>
        ))}

      </section>

      {/* 🔥 GALLERY */}
      <section className="px-4 pb-10 max-w-6xl mx-auto">

        <h2 className="text-xl font-bold text-orange-400 mb-4 text-center">
          Divine Gallery ✨
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {[
            "https://i.pinimg.com/564x/f4/b4/b9/f4b4b95dd8e1b48588ba08f51a887c24.jpg",
            "https://e1.pxfuel.com/desktop-wallpaper/869/945/desktop-wallpaper-hindu-god-hindu-god-thumbnail.jpg",
            "https://i.pinimg.com/474x/a8/9f/67/a89f67592990ba7f6854fc54669f6255.jpg",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSj-l7KcV1oBIr9KgVEQPgrzozkgKbrwkHbA&s",
          ].map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.08 }}
              className="aspect-4/3 overflow-hidden rounded-xl shadow-lg"
            >
              <img
                src={img}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}

        </div>

      </section>

      {/* 🔥 FOOTER */}
      <footer className="bg-black/40 backdrop-blur text-center py-6 text-gray-400 text-sm">
        © 2026 Devotional App
      </footer>

    </div>
  );
}