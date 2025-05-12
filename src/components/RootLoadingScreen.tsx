import Lottie from "react-lottie";
import animationData from "@/lotties/sports-animation.json";

export default function RootLoadingScreen() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex h-dvh flex-col items-center justify-center bg-white">
      <div className="flex -translate-y-4 flex-col items-center justify-center">
        <Lottie options={defaultOptions} height={180} width={180} />
        <h1 className="-translate-y-12 animate-pulse text-3xl font-bold text-accent-orange">
          REC LiiGA
        </h1>
      </div>
    </div>
  );
}
