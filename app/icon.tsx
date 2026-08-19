import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#efe6d4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid #1a1610",
        }}
      >
        <div
          style={{
            width: 18,
            height: 6,
            background: "#c24a18",
          }}
        />
      </div>
    ),
    size,
  );
}
