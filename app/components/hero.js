"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HeroSlider() {
  const images = [
    "https://res.cloudinary.com/dfzaefrkt/image/upload/v1787929375/WhatsApp_Image_2026-08-28_at_8.59.37_PM_1_keha9t.jpg",
    "https://res.cloudinary.com/dfzaefrkt/image/upload/v1787929388/WhatsApp_Image_2026-08-28_at_8.59.37_PM_2_jyabcf.jpg",
    "https://res.cloudinary.com/dfzaefrkt/image/upload/v1787929397/WhatsApp_Image_2026-08-28_at_8.59.37_PM_fi4w2d.jpg",
    "https://res.cloudinary.com/dfzaefrkt/image/upload/v1787929358/WhatsApp_Image_2026-08-28_at_8.59.36_PM_o8fnvy.jpg",
  ];

  return (
    <div className="w-full max-w-6xl mx-auto my-4 rounded-2xl overflow-hidden shadow-lg">
      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        navigation={true} // ডানে-বামে arrow keys (< >) দেখাবে
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="h-[250px] sm:h-[400px] md:h-[500px]"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}