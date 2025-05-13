import { ImageType } from "@/types/message";
import ModalContainer from "../ModalContainer";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ChatImagesModal({
  open,
  closeModal,
  images,
}: {
  open: boolean;
  closeModal: () => void;
  images: ImageType[];
}) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth } = sliderRef.current;
        const imageWidth = scrollWidth / images.length; // Calculate width per image
        const index = Math.floor(scrollLeft / imageWidth); // Calculate the current image index
        setCurrentIndex(index);
      }
    };

    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", handleScroll);
      return () => slider.removeEventListener("scroll", handleScroll);
    }
  }, [images.length]);

  const scroll = (direction: "prev" | "next") => {
    if (sliderRef.current) {
      const { scrollWidth } = sliderRef.current;
      const imageWidth = scrollWidth / images.length;
      sliderRef.current.scrollBy({
        left: direction === "next" ? imageWidth : -imageWidth,
        behavior: "smooth",
      });
    }
  };

  function handleDownloadImage() {
    const imageToDownload = images[currentIndex];

    if (imageToDownload) {
      const link = document.createElement("a");
      link.href = imageToDownload.url;
      link.download = imageToDownload.filename;
      link.target = "_blank";
      link.click();
    }
  }

  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <div className="relative h-[90%] w-[90%] max-w-4xl rounded-lg bg-black/50">
        <div
          ref={sliderRef}
          className="hide-scrollbar h-full snap-x snap-mandatory overflow-hidden overflow-x-auto"
        >
          <div
            className="flex h-full w-full transition-transform duration-500 ease-in-out"
            // style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((img) => (
              <div
                key={img.id}
                className="relative h-full w-full flex-shrink-0 snap-center"
              >
                <img
                  key={img.filename}
                  src={img.url}
                  alt={img.filename}
                  className="absolute left-0 top-0 h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => scroll("prev")}
          className="absolute top-1/2 -translate-y-1/2 transform rounded p-2 text-neutral-400 duration-200 hover:text-white sm:left-2"
        >
          <ChevronLeftIcon />
        </button>
        <button
          onClick={() => scroll("next")}
          className="absolute right-0 top-1/2 -translate-y-1/2 transform rounded p-2 text-neutral-400 duration-200 hover:text-white sm:right-2"
        >
          <ChevronRightIcon />
        </button>

        <button onClick={closeModal} className="absolute right-2 top-2 p-2">
          <XIcon className="h-4 w-4 text-neutral-400 duration-200 hover:text-white" />
        </button>

        <button
          onClick={handleDownloadImage}
          className="absolute bottom-4 right-4 rounded-md bg-accent-orange p-2 px-4 text-sm font-medium text-white duration-200 hover:bg-accent-orange/85"
        >
          Download
        </button>
      </div>
    </ModalContainer>
  );
}
