import GlobeCanvas from "@/components/Globe";

export default function GlobePage() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <GlobeCanvas />
    </div>
  );
}