import { useState } from "react";
import { Wind, Droplets, Thermometer, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HyderabadMap } from "@/components/map/HyderabadMap";
import { AQISection } from "@/components/sections/AQISection";
import { FloodSection } from "@/components/sections/FloodSection";
import { HeatwaveSection } from "@/components/sections/HeatwaveSection";
import { useZoneData, DataType } from "@/hooks/useZoneData";
import { Switch } from "@/components/ui/switch";

export default function Index() {
  const [activeTab, setActiveTab] = useState<DataType>("aqi");
  const {
    zones,
    aqiData,
    floodData,
    heatwaveData,
    selectedZone,
    setSelectedZone,
    isLoading,
    refreshData,
    useMockData,
    setUseMockData,
  } = useZoneData();

  const handleTabChange = (value: string) => {
    setActiveTab(value as DataType);
  };

  const handleRefresh = () => {
    refreshData(activeTab);
  };

  const getSelectedZoneData = () => {
    if (!selectedZone) return null;
    if (activeTab === "aqi") return aqiData[selectedZone.id];
    if (activeTab === "flood") return floodData[selectedZone.id];
    return heatwaveData[selectedZone.id];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">Urban Watch</h1>
                <p className="text-xs text-muted-foreground">Real-time Environmental Intelligence</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Mock Data Toggle */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Mock Data</span>
                <Switch
                  checked={useMockData}
                  onCheckedChange={setUseMockData}
                />
              </div>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        {/* Hide tab buttons but keep tab content structure */}
        <div className="hidden">
          <TabsList>
            <TabsTrigger value="aqi">AQI</TabsTrigger>
            <TabsTrigger value="flood">Floods</TabsTrigger>
            <TabsTrigger value="heatwave">Heatwave</TabsTrigger>
          </TabsList>
        </div>

        {/* Content Area */}
        <main className="max-w-[1800px] mx-auto px-4 md:px-6 py-6">
          <div className="grid lg:grid-cols-[1fr_500px] gap-6">
            {/* Map */}
            <div className="h-[500px] lg:h-[calc(100vh-200px)] lg:sticky lg:top-[140px]">
              <HyderabadMap
                zones={zones}
                aqiData={aqiData}
                floodData={floodData}
                heatwaveData={heatwaveData}
                mode={activeTab}
                selectedZone={selectedZone}
                onZoneSelect={setSelectedZone}
                useMockData={useMockData}
              />
            </div>

            {/* Data Panel */}
            <div className="space-y-4 overflow-hidden">
              {/* Zone Selector */}
              <div className="glass-card rounded-xl p-3">
                <h3 className="text-xs font-medium text-muted-foreground mb-2">Select Zone</h3>
                <div className="flex flex-wrap gap-1.5">
                  {zones.map((zone) => (
                    <Button
                      key={zone.id}
                      variant={selectedZone?.id === zone.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedZone(zone)}
                      className="text-[11px] px-2 py-1 h-7"
                    >
                      {zone.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <TabsContent value="aqi" className="mt-0">
                <AQISection
                  data={selectedZone ? aqiData[selectedZone.id] : null}
                  zoneName={selectedZone?.name || ""}
                />
              </TabsContent>

              <TabsContent value="flood" className="mt-0">
                <FloodSection
                  data={selectedZone ? floodData[selectedZone.id] : null}
                  zoneName={selectedZone?.name || ""}
                />
              </TabsContent>

              <TabsContent value="heatwave" className="mt-0">
                <HeatwaveSection
                  data={selectedZone ? heatwaveData[selectedZone.id] : null}
                  zoneName={selectedZone?.name || ""}
                />
              </TabsContent>
            </div>
          </div>
        </main>
      </Tabs>

      {/* Footer */}
      <footer className="py-6 px-4 md:px-6 border-t border-border mt-8">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
              <span className="text-white font-bold">U</span>
            </div>
            <span className="font-semibold">Urban Watch - Environmental Intelligence</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring for AQI, Floods & Heatwave | Hyderabad, India
          </p>
        </div>
      </footer>
    </div>
  );
}
