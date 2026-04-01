import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, useCurrentFrame, staticFile } from "remotion";

export interface Slide {
  name: string;
  subtitle: string;
  image: string;
  accentColor: string;
  appearAt: number;
  disappearAt: number;
}

export interface ImageSlideshowProps extends Record<string, unknown> {
  slides: Slide[];
  audioSrc: string;
}

const FADE = 0.5;

export const ImageSlideshow: React.FC<ImageSlideshowProps> = ({ slides, audioSrc }) => {
  const frame = useCurrentFrame();
  const currentTime = frame / 25;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <Audio src={audioSrc} />
      {slides.map((slide, i) => {
        const fadeIn = interpolate(currentTime, [slide.appearAt, slide.appearAt + FADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fadeOut = interpolate(currentTime, [slide.disappearAt - FADE, slide.disappearAt], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const opacity = Math.min(fadeIn, fadeOut);
        if (opacity <= 0) return null;
        return (
          <AbsoluteFill key={i} style={{ opacity }}>
            <Img src={staticFile(slide.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(15, 23, 42, 0.95))", padding: "60px 80px 40px" }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: slide.accentColor, fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif", marginBottom: 8 }}>{slide.name}</div>
              <div style={{ fontSize: 28, color: "#94a3b8", fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif" }}>{slide.subtitle}</div>
            </div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
