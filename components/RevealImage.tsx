"use client";

import Image, { type ImageProps } from "next/image";
import Reveal from "./Reveal";

export default function RevealImage(props: ImageProps) {
  return <Reveal variant="image" style={{ position: "absolute", inset: 0 }}>
    <Image {...props} alt={props.alt ?? ""} />
  </Reveal>;
}
