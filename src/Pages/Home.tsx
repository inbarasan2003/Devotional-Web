import { useNavigate } from "react-router-dom";

export default function Home() {

  const navigate = useNavigate();

  return (
    <div className="mt-16 bg-orange-50 min-h-screen flex flex-col">

      {/* 🔥 HERO SECTION */}
      <section className="text-center px-4 py-10 md:py-16 bg-linear-to-b from-orange-100 to-orange-50">

        <h1 className="text-2xl md:text-4xl font-bold text-orange-600">
          🪔 Welcome to Devotional World
        </h1>

        <p className="mt-3 text-gray-600 max-w-xl mx-auto text-sm md:text-base">
          Explore divine mantras, spiritual stories, and peaceful audio experiences.
          Connect with devotion anytime, anywhere.
        </p>

        <div className="mt-5 flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate("/mantra")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm"
          >
            Explore Mantras
          </button>

          <button
            onClick={() => navigate("/stories")}
            className="border border-orange-500 text-orange-600 px-5 py-2 rounded-lg text-sm"
          >
            Read Stories
          </button>
        </div>

      </section>

      {/* 🔥 FEATURES */}
      <section className="px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

        <div className="bg-white p-5 rounded-xl shadow text-center">
          <h2 className="text-orange-600 font-semibold">🕉 Mantras</h2>
          <p className="text-xs text-gray-500 mt-2">
            Listen to powerful mantras with audio support
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow text-center">
          <h2 className="text-orange-600 font-semibold">📖 Stories</h2>
          <p className="text-xs text-gray-500 mt-2">
            Read inspiring spiritual stories from scriptures
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow text-center">
          <h2 className="text-orange-600 font-semibold">🎧 Audio</h2>
          <p className="text-xs text-gray-500 mt-2">
            Calm your mind with devotional audio tracks
          </p>
        </div>

      </section>

      {/* 🔥 IMAGE SECTION */}
      <section className="px-4 pb-10 max-w-6xl mx-auto">

        <h2 className="text-lg font-bold text-orange-600 mb-4 text-center">
          Divine Gallery ✨
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {[
            "https://i.pinimg.com/564x/f4/b4/b9/f4b4b95dd8e1b48588ba08f51a887c24.jpg",
            "https://e1.pxfuel.com/desktop-wallpaper/869/945/desktop-wallpaper-hindu-god-hindu-god-thumbnail.jpg",
            "https://i.pinimg.com/474x/a8/9f/67/a89f67592990ba7f6854fc54669f6255.jpg",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSj-l7KcV1oBIr9KgVEQPgrzozkgKbrwkHbA&s",
          ].map((img, i) => (
            <div key={i} className="aspect-4/3 overflow-hidden rounded-xl shadow">
              <img
                src={img}
                alt="god"
                className="w-full h-full object-cover object-[center_top] hover:scale-105 transition"
              />
            </div>
          ))}

        </div>

      </section>
 
      {/* 🔥 FOOTER */}
      <footer className="bg-white border-t mt-auto py-6 px-4">

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">

          <p>© 2026 Devotional App. All rights reserved.</p>

          <div className="flex gap-4">
            <button onClick={() => navigate("/mantra")} className="hover:text-orange-600">
              Mantra
            </button>
            <button onClick={() => navigate("/stories")} className="hover:text-orange-600">
              Stories
            </button>
            <button onClick={() => navigate("/profile")} className="hover:text-orange-600">
              Profile
            </button>
          </div>

        </div>

      </footer>

    </div>
  );
}