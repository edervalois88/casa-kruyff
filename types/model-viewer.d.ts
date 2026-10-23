import type { DetailedHTMLProps, HTMLAttributes } from "react";
import type { ModelViewerElement } from "@google/model-viewer";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<HTMLAttributes<ModelViewerElement>, ModelViewerElement> & {
        src: string;
        "ios-src"?: string;
        poster?: string;
        alt: string;
        "camera-controls"?: boolean;
        "touch-action"?: string;
        ar?: boolean;
        "ar-modes"?: string;
        "ar-scale"?: string;
        "shadow-intensity"?: string;
      };
    }
  }
}
