import { useCamera } from "@hakit/core";
import { PreloadImage } from "@hakit/components";

export function RenderCamera() {
  const camera = useCamera("camera.some_camera");
  return (
    camera.poster.url &&
    !camera.poster.loading && (
      <PreloadImage
        lazy
        src={camera.poster.url}
        style={{
          width: "100%",
          aspectRatio: 16 / 9,
        }}
      />
    )
  );
}
