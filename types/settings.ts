export interface SettingsProps {
  // Основные настройки
  showBackHemisphere: boolean;
  setShowBackHemisphere: (value: boolean) => void;
  autoRotate: boolean;
  setAutoRotate: (value: boolean) => void;
  rotationSpeed: number;
  setRotationSpeed: (value: number) => void;
  backgroundColor: string;
  setBackgroundColor: (value: string) => void;
  interactiveEffect: boolean;
  setInteractiveEffect: (value: boolean) => void;
  effectStrength: number;
  setEffectStrength: (value: number) => void;
  returnSpeed: number;
  setReturnSpeed: (value: number) => void;
  showStats: boolean;
  setShowStats: (value: boolean) => void;
  
  // Настройки материалов
  cloudsOpacity: number;
  setCloudsOpacity: (value: number) => void;
  cloudsSpeed: number;
  setCloudsSpeed: (value: number) => void;
  earthOpacity: number;
  setEarthOpacity: (value: number) => void;
  earthTransparency: number;
  setEarthTransparency: (value: number) => void;
  earthMaskIntensity: number;
  setEarthMaskIntensity: (value: number) => void;
  earthTextureIntensity: number;
  setEarthTextureIntensity: (value: number) => void;
  nightLightsColor: string;
  setNightLightsColor: (value: string) => void;
  nightLightsIntensity: number;
  setNightLightsIntensity: (value: number) => void;
  nightLightsBrightness: number;
  setNightLightsBrightness: (value: number) => void;
  pointsColor: string;
  setPointsColor: (value: string) => void;
  landPointsOpacity: number;
  setLandPointsOpacity: (value: number) => void;
  landPointsSize: number;
  setLandPointsSize: (value: number) => void;
  oceanPointsOpacity: number;
  setOceanPointsOpacity: (value: number) => void;
  oceanPointsSize: number;
  setOceanPointsSize: (value: number) => void;
  
  resetToDefaults: () => void;
}

