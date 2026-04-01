import React from "react";
import { Composition } from "remotion";
import { BrandIntro } from "./compositions/BrandIntro";

export const Root: React.FC = () => {
  return (
    <Composition
      id="BrandIntro"
      component={BrandIntro}
      durationInFrames={Math.round(1.5 * 25)}
      fps={25}
      width={1920}
      height={1080}
    />
  );
};
