"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  const [showBackHemisphere, setShowBackHemisphere] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [backgroundColor, setBackgroundColor] = useState<string>("#000000");
  const [showStats, setShowStats] = useState<boolean>(true);
  const [interactiveEffect, setInteractiveEffect] = useState<boolean>(true);
  const [effectStrength, setEffectStrength] = useState<number>(1);
  const [returnSpeed, setReturnSpeed] = useState<number>(0.92); // 0.7-0.99, ближе к 1 = медленнее
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.002); // 0-0.01

  // Функция сброса к дефолтным значениям
  const resetToDefaults = () => {
    setShowBackHemisphere(false);
    setAutoRotate(true);
    setBackgroundColor("#000000");
    setShowStats(true);
    setInteractiveEffect(true);
    setEffectStrength(1);
    setReturnSpeed(0.92);
    setRotationSpeed(0.002);
  };

  return (
    <main className="h-screen overflow-hidden flex">
      {/* 3D Глобус - основная область */}
      <div className="flex-1">
        <GlobeCanvas
          showBackHemisphere={showBackHemisphere}
          autoRotate={autoRotate}
          backgroundColor={backgroundColor}
          showStats={showStats}
          interactiveEffect={interactiveEffect}
          effectStrength={effectStrength}
          returnSpeed={returnSpeed}
          rotationSpeed={rotationSpeed}
        />
      </div>

      {/* Правый сайдбар с настройками */}
      <aside className="w-80 border-l bg-card flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-8">
            {/* Заголовок */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">Sexy Globy ;)</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Управление отображением глобуса
                </p>
              </div>
              <button
                onClick={resetToDefaults}
                className="px-3 py-1.5 text-xs font-medium rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                title="Сбросить все настройки к дефолтным значениям"
              >
                Сбросить
              </button>
            </div>

            {/* Видимость задней полусферы */}
            <div className="space-y-3">
              <Label className="text-base">Видимость задней полусферы</Label>
              <RadioGroup
                value={showBackHemisphere ? "visible" : "hidden"}
                onValueChange={(value) =>
                  setShowBackHemisphere(value === "visible")
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="visible" id="visible" />
                  <Label
                    htmlFor="visible"
                    className="font-normal cursor-pointer"
                  >
                    видна
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hidden" id="hidden" />
                  <Label
                    htmlFor="hidden"
                    className="font-normal cursor-pointer"
                  >
                    не видна
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Автовращение */}
            <div className="space-y-3">
              <Label className="text-base">Автоматическое вращение</Label>
              <RadioGroup
                value={autoRotate ? "enabled" : "disabled"}
                onValueChange={(value) => setAutoRotate(value === "enabled")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="enabled" id="enabled" />
                  <Label
                    htmlFor="enabled"
                    className="font-normal cursor-pointer"
                  >
                    включено
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="disabled" id="disabled" />
                  <Label
                    htmlFor="disabled"
                    className="font-normal cursor-pointer"
                  >
                    выключено
                  </Label>
                </div>
              </RadioGroup>

              {/* Слайдер скорости вращения */}
              {autoRotate && (
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">
                      Скорость вращения
                    </Label>
                    <span className="text-sm font-medium">
                      {(rotationSpeed * 500).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.01"
                    step="0.0001"
                    value={rotationSpeed}
                    onChange={(e) =>
                      setRotationSpeed(parseFloat(e.target.value))
                    }
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>медленнее</span>
                    <span>быстрее</span>
                  </div>
                </div>
              )}
            </div>

            {/* Цвет фона сцены */}
            <div className="space-y-3">
              <Label className="text-base">Цвет фона сцены</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-16 h-10 rounded border border-input cursor-pointer bg-background"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    placeholder="#000000"
                    className="w-full px-3 py-2 text-sm rounded border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {["#000000", "#ffffff", "#1a1a1a", "#2d3748", "#1e3a5f"].map(
                  (color) => (
                    <button
                      key={color}
                      onClick={() => setBackgroundColor(color)}
                      className="w-8 h-8 rounded border-2 border-border hover:border-ring transition-colors"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  )
                )}
              </div>
            </div>

            {/* Интерактивный эффект */}
            <div className="space-y-3">
              <Label className="text-base">Интерактивный разлеташки</Label>
              <RadioGroup
                value={interactiveEffect ? "enabled" : "disabled"}
                onValueChange={(value) =>
                  setInteractiveEffect(value === "enabled")
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="enabled" id="effect-enabled" />
                  <Label
                    htmlFor="effect-enabled"
                    className="font-normal cursor-pointer"
                  >
                    включено
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="disabled" id="effect-disabled" />
                  <Label
                    htmlFor="effect-disabled"
                    className="font-normal cursor-pointer"
                  >
                    выключено
                  </Label>
                </div>
              </RadioGroup>

              {/* Слайдер силы эффекта */}
              {interactiveEffect && (
                <div className="pt-2 space-y-4">
                  {/* Сила разлета */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-muted-foreground">
                        Сила эффекта
                      </Label>
                      <span className="text-sm font-medium">
                        {effectStrength.toFixed(1)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="6"
                      step="0.1"
                      value={effectStrength}
                      onChange={(e) =>
                        setEffectStrength(parseFloat(e.target.value))
                      }
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>слабее</span>
                      <span>сильнее</span>
                    </div>
                  </div>

                  {/* Скорость возврата */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-muted-foreground">
                        Скорость возврата
                      </Label>
                      <span className="text-sm font-medium">
                        {((1 - returnSpeed) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.7"
                      max="0.99"
                      step="0.01"
                      value={returnSpeed}
                      onChange={(e) =>
                        setReturnSpeed(parseFloat(e.target.value))
                      }
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>быстрее</span>
                      <span>медленнее</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Показывать статистику */}
            <div className="space-y-3">
              <Label className="text-base">Статистика производительности</Label>
              <RadioGroup
                value={showStats ? "enabled" : "disabled"}
                onValueChange={(value) => setShowStats(value === "enabled")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="enabled" id="stats-enabled" />
                  <Label
                    htmlFor="stats-enabled"
                    className="font-normal cursor-pointer"
                  >
                    показывать FPS
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="disabled" id="stats-disabled" />
                  <Label
                    htmlFor="stats-disabled"
                    className="font-normal cursor-pointer"
                  >
                    скрыть
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
