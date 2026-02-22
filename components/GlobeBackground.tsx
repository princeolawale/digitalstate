"use client"

export default function GlobeBackground() {
  console.log("GlobeBackground mounted")

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "green",
        zIndex: 0,
      }}
    />
  )
}