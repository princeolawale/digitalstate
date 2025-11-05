"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MobileSettingsSheet } from "@/components/MobileSettingsSheet";
import { DesktopSettingsSidebar } from "@/components/DesktopSettingsSidebar";
import { SettingsProps } from "@/types/settings";

// Динамический импорт для избежания SSR проблем с Three.js
const GlobeCanvas = dynamic(() => import("@/components/Globe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <div className="text-muted-foreground text-xl">Загрузка глобуса...</div>
    </div>
  ),
});

export default function Home() {
  // Основные настройки
  const [showBackHemisphere, setShowBackHemisphere] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [backgroundColor, setBackgroundColor] = useState<string>("#000000");
  const [showStats, setShowStats] = useState<boolean>(true);
  const [interactiveEffect, setInteractiveEffect] = useState<boolean>(true);
  const [effectStrength, setEffectStrength] = useState<number>(4.4);
  const [returnSpeed, setReturnSpeed] = useState<number>(0.92);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.002);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Настройки материалов
  const [cloudsOpacity, setCloudsOpacity] = useState<number>(0.25);
  const [cloudsSpeed, setCloudsSpeed] = useState<number>(3); // Множитель к rotationSpeed (может быть отрицательным)
  const [earthOpacity, setEarthOpacity] = useState<number>(1);
  const [earthTransparency, setEarthTransparency] = useState<number>(0.5); // Непрозрачность (видимость задней стороны)
  const [earthMaskIntensity, setEarthMaskIntensity] = useState<number>(1);
  const [earthTextureIntensity, setEarthTextureIntensity] = useState<number>(1);
  const [nightLightsColor, setNightLightsColor] = useState<string>("#ffaa44"); // Теплый оранжево-желтый
  const [nightLightsIntensity, setNightLightsIntensity] = useState<number>(1);
  const [nightLightsBrightness, setNightLightsBrightness] = useState<number>(3);
  const [pointsColor, setPointsColor] = useState<string>("#ffffff"); // Белый цвет точек
  const [landPointsOpacity, setLandPointsOpacity] = useState<number>(0.8);
  const [landPointsSize, setLandPointsSize] = useState<number>(0.008);
  const [oceanPointsOpacity, setOceanPointsOpacity] = useState<number>(0.5);
  const [oceanPointsSize, setOceanPointsSize] = useState<number>(0.006);

  // Функция сброса к дефолтным значениям
  const resetToDefaults = () => {
    setShowBackHemisphere(true);
    setAutoRotate(true);
    setBackgroundColor("#000000");
    setShowStats(true);
    setInteractiveEffect(true);
    setEffectStrength(4.4);
    setReturnSpeed(0.92);
    setRotationSpeed(0.002);
    setCloudsOpacity(0.25);
    setCloudsSpeed(3);
    setEarthOpacity(1);
    setEarthTransparency(0.5);
    setEarthMaskIntensity(1);
    setEarthTextureIntensity(1);
    setNightLightsColor("#ffaa44");
    setNightLightsIntensity(1);
    setNightLightsBrightness(3);
    setPointsColor("#ffffff");
    setLandPointsOpacity(0.8);
    setLandPointsSize(0.008);
    setOceanPointsOpacity(0.5);
    setOceanPointsSize(0.006);
  };

  const settingsProps: SettingsProps = {
    showBackHemisphere,
    setShowBackHemisphere,
    autoRotate,
    setAutoRotate,
    rotationSpeed,
    setRotationSpeed,
    backgroundColor,
    setBackgroundColor,
    interactiveEffect,
    setInteractiveEffect,
    effectStrength,
    setEffectStrength,
    returnSpeed,
    setReturnSpeed,
    showStats,
    setShowStats,
    cloudsOpacity,
    setCloudsOpacity,
    cloudsSpeed,
    setCloudsSpeed,
    earthOpacity,
    setEarthOpacity,
    earthTransparency,
    setEarthTransparency,
    earthMaskIntensity,
    setEarthMaskIntensity,
    earthTextureIntensity,
    setEarthTextureIntensity,
    nightLightsColor,
    setNightLightsColor,
    nightLightsIntensity,
    setNightLightsIntensity,
    nightLightsBrightness,
    setNightLightsBrightness,
    pointsColor,
    setPointsColor,
    landPointsOpacity,
    setLandPointsOpacity,
    landPointsSize,
    setLandPointsSize,
    oceanPointsOpacity,
    setOceanPointsOpacity,
    oceanPointsSize,
    setOceanPointsSize,
    resetToDefaults,
  };

  return (
    <main className="h-screen w-screen overflow-hidden flex relative">
      {/* 3D Глобус - основная область */}
      <div className="flex-1 relative min-w-0">
        <div className="absolute inset-0 w-full h-full">
          <GlobeCanvas
            showBackHemisphere={showBackHemisphere}
            autoRotate={autoRotate}
            backgroundColor={backgroundColor}
            showStats={showStats}
            interactiveEffect={interactiveEffect}
            effectStrength={effectStrength}
            returnSpeed={returnSpeed}
            rotationSpeed={rotationSpeed}
            cloudsOpacity={cloudsOpacity}
            cloudsSpeed={cloudsSpeed}
            earthOpacity={earthOpacity}
            earthTransparency={earthTransparency}
            earthMaskIntensity={earthMaskIntensity}
            earthTextureIntensity={earthTextureIntensity}
            nightLightsColor={nightLightsColor}
            nightLightsIntensity={nightLightsIntensity}
            nightLightsBrightness={nightLightsBrightness}
            pointsColor={pointsColor}
            landPointsOpacity={landPointsOpacity}
            landPointsSize={landPointsSize}
            oceanPointsOpacity={oceanPointsOpacity}
            oceanPointsSize={oceanPointsSize}
          />
        </div>

        {/* Кнопка меню для мобильных - снизу по центру */}
        <MobileSettingsSheet
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          settingsProps={settingsProps}
        />
      </div>

      {/* Правый сайдбар с настройками - только на десктопе */}
      <DesktopSettingsSidebar settingsProps={settingsProps} />
    </main>
  );
}
