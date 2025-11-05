import { SettingsProps } from "@/types/settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HemisphereVisibility,
  AutoRotation,
  InteractiveEffect,
  PerformanceStats,
  MaterialSettings,
} from "./sections";

export function SettingsContent(props: SettingsProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Заголовок */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">FUI Globe ;)</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Управление отображением глобуса
          </p>
        </div>
        <button
          onClick={props.resetToDefaults}
          className="px-3 py-1.5 text-xs font-medium rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
          title="Сбросить все настройки к дефолтным значениям"
        >
          Сбросить
        </button>
      </div>

      {/* Вкладки */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">Общие</TabsTrigger>
          <TabsTrigger value="materials">Материалы</TabsTrigger>
        </TabsList>

        {/* Вкладка: Общие настройки */}
        <TabsContent value="general" className="space-y-6 mt-4">
          <HemisphereVisibility
            showBackHemisphere={props.showBackHemisphere}
            setShowBackHemisphere={props.setShowBackHemisphere}
          />

          <AutoRotation
            autoRotate={props.autoRotate}
            setAutoRotate={props.setAutoRotate}
            rotationSpeed={props.rotationSpeed}
            setRotationSpeed={props.setRotationSpeed}
          />

          <InteractiveEffect
            interactiveEffect={props.interactiveEffect}
            setInteractiveEffect={props.setInteractiveEffect}
            effectStrength={props.effectStrength}
            setEffectStrength={props.setEffectStrength}
            returnSpeed={props.returnSpeed}
            setReturnSpeed={props.setReturnSpeed}
          />

          <PerformanceStats
            showStats={props.showStats}
            setShowStats={props.setShowStats}
          />
        </TabsContent>

        {/* Вкладка: Настройки материалов */}
        <TabsContent value="materials" className="space-y-6 mt-4">
          <MaterialSettings
            cloudsOpacity={props.cloudsOpacity}
            setCloudsOpacity={props.setCloudsOpacity}
            cloudsSpeed={props.cloudsSpeed}
            setCloudsSpeed={props.setCloudsSpeed}
            earthOpacity={props.earthOpacity}
            setEarthOpacity={props.setEarthOpacity}
            earthTransparency={props.earthTransparency}
            setEarthTransparency={props.setEarthTransparency}
            earthMaskIntensity={props.earthMaskIntensity}
            setEarthMaskIntensity={props.setEarthMaskIntensity}
            earthTextureIntensity={props.earthTextureIntensity}
            setEarthTextureIntensity={props.setEarthTextureIntensity}
            nightLightsColor={props.nightLightsColor}
            setNightLightsColor={props.setNightLightsColor}
            nightLightsIntensity={props.nightLightsIntensity}
            setNightLightsIntensity={props.setNightLightsIntensity}
            nightLightsBrightness={props.nightLightsBrightness}
            setNightLightsBrightness={props.setNightLightsBrightness}
            pointsColor={props.pointsColor}
            setPointsColor={props.setPointsColor}
            landPointsOpacity={props.landPointsOpacity}
            setLandPointsOpacity={props.setLandPointsOpacity}
            landPointsSize={props.landPointsSize}
            setLandPointsSize={props.setLandPointsSize}
            oceanPointsOpacity={props.oceanPointsOpacity}
            setOceanPointsOpacity={props.setOceanPointsOpacity}
            oceanPointsSize={props.oceanPointsSize}
            setOceanPointsSize={props.setOceanPointsSize}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
