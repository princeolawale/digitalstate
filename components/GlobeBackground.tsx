"use client"

import Globe from "./Glbe"

export default function GlobeBackground() {
  return (
    <Globe
      showBackHemisphere={true}
      autoRotate={true}
      backgroundColor="#000000"
      showStats={false}
      showPointsLayer={true}
      showCloudsLayer={true}
      showEarthLayer={true}
      showInnerLayer={true}
      interactiveEffect={false}
    />
  )
}