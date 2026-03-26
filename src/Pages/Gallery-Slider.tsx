import { useState } from "react";
import { motion } from "framer-motion";

const images = [
  "https://i.pinimg.com/736x/ae/37/5e/ae375ecde47f60d069fd41d9a778ee88.jpg",
  "https://i.pinimg.com/1200x/0f/38/cf/0f38cffa724cd4d400c3b8276d9fbcf1.jpg",
  "https://i.pinimg.com/736x/9b/8b/98/9b8b9843004f467353086a4420e545ce.jpg",
  "https://i.pinimg.com/736x/b3/4a/9c/b34a9cf50fccb7011e06c1e5c4d93a3e.jpg",
  "https://i.pinimg.com/1200x/88/8f/db/888fdb79ea6f0bc4b8d8aa04af02bc19.jpg",
  "https://i.pinimg.com/1200x/8e/ab/5e/8eab5ee7620c643643a4728ca5809cca.jpg",
  "https://i.pinimg.com/1200x/0f/83/ac/0f83ac4c09cba7e3e1d3951355a34453.jpg",
  "https://i.pinimg.com/736x/b8/15/a2/b815a2e212c14ffa3430184ec3a99f2a.jpg",
  "https://i.pinimg.com/736x/23/d3/30/23d330bb539515722b81d3960638e785.jpg",
  "https://i.pinimg.com/736x/33/23/ce/3323ce82a10acdcf94a13b5d53219562.jpg",
  "https://i.pinimg.com/736x/11/4f/19/114f19d5bd74808a6e8b04f128be2ad5.jpg"
];

export default function GalleryCarousel() {

  const [index, setIndex] = useState(0);

  const visibleCount = 4; // 👈 show 4 images

  const nextSlide = () => {
    if (index < images.length - visibleCount) {
      setIndex(index + 1);
    }
  };

  const prevSlide = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <section className="px-4 pb-10 max-w-6xl mx-auto">

      <h2 className="text-xl font-bold text-orange-400 mb-4 text-center">
        Divine Gallery ✨
      </h2>

      <div className="relative">

        {/* 🔥 SLIDER */}
        <div className="overflow-hidden">
          <motion.div
            animate={{ x: `-${index * 25}%` }} // 👈 move by 1 card
            transition={{ duration: 0.4 }}
            className="flex gap-4"
          >
            {images.map((img, i) => (
              <div
                key={i}
                className="min-w-[25%] aspect-2/3 rounded-xl overflow-hidden shadow-lg"
              >
                <img
                  src={img}
                  className="w-full h-full object-cover hover:scale-110 transition"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* 🔥 PREV */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/40 px-3 py-2 rounded-full text-white hover:bg-black/70"
        >
          ◀
        </button>

        {/* 🔥 NEXT */}
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/40 px-3 py-2 rounded-full text-white hover:bg-black/70"
        >
          ▶
        </button>

      </div>

    </section>
  );
}