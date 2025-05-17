import React, { useEffect, useRef, useState } from "react";

const ReviewsCarousel = ({
  reviews,
}: {
  reviews: { username: string; flag: string; text: string }[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start from the first real slide
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Clone first and last slide
  const slides = [reviews[reviews.length - 1], ...reviews, reviews[0]];

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const transitionEnd = () => {
      setIsTransitioning(false);
      // Instant jump to real slide without animation
      if (currentIndex === slides.length - 1) {
        carousel.style.transition = "none";
        setCurrentIndex(1);
        carousel.style.transform = `translateX(-100%)`;
      } else if (currentIndex === 0) {
        carousel.style.transition = "none";
        setCurrentIndex(slides.length - 2);
        carousel.style.transform = `translateX(-${(slides.length - 2) * 100}%)`;
      }
    };

    carousel.addEventListener("transitionend", transitionEnd);
    return () => carousel.removeEventListener("transitionend", transitionEnd);
  }, [currentIndex, slides.length]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    if (!isTransitioning) {
      carousel.style.transition = "none";
    } else {
      carousel.style.transition = "transform 0.5s ease";
    }

    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
  }, [currentIndex, isTransitioning]);

  return (
    <div className="relative overflow-hidden">
      <div className="flex w-full">
        <div
          ref={carouselRef}
          className="flex"
          style={{ width: `${slides.length * 100}%` }}
        >
          {slides.map((review, i) => (
            <div
              key={i}
              className="w-1/2 flex-shrink-0 p-4"
              style={{ flexBasis: "50%" }}
            >
              <div className="relative flex flex-col items-center gap-4 rounded-lg bg-white p-6 pt-16 text-center shadow-lg">
                <div className="absolute left-1/2 top-0 z-10 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500"></div>
                <p className="text-sm">{review.text}</p>
                <h4 className="font-semibold uppercase text-accent-orange-2">
                  {review.username}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-gray-800 p-2 text-white"
      >
        ‹
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-gray-800 p-2 text-white"
      >
        ›
      </button>
    </div>
  );
};

export default ReviewsCarousel;
