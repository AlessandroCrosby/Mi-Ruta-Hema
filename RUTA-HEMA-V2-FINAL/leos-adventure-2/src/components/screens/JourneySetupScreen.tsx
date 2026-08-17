import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSharedGameState } from "@/contexts/GameStateContext";
import { journeyTemplates } from "@/data/journey-templates";
import { JourneyTemplate } from "@/types";
import {
  ArrowLeftIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  UsersIcon,
} from "@phosphor-icons/react/ssr";
import { useState } from "react";

export function JourneySetupScreen() {
  const { setCurrentScreen, setSelectedJourneyTemplate, gameState } =
    useSharedGameState();
  const [selectedTemplate, setSelectedTemplate] =
    useState<JourneyTemplate | null>(null);
  const [patientName, setPatientName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = journeyTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartJourney = () => {
    if (selectedTemplate && patientName.trim()) {
      setSelectedJourneyTemplate(selectedTemplate, patientName.trim());
      setCurrentScreen("welcome");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentScreen("staff-dashboard")}
            className="touch-target"
          >
            <ArrowLeftIcon size={24} />
          </Button>
          <div>
            <h1 className="font-fredoka text-3xl font-bold text-foreground">
              Setup Patient Journey
            </h1>
            <p className="text-muted-foreground font-inter">
              Select the appropriate journey template for your patient
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Journey Templates */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search journey templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Template Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover-lift hover:scale-[1.02] ${
                    selectedTemplate?.id === template.id
                      ? "ring-2 ring-primary bg-primary/5"
                      : "hover:shadow-lg"
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="font-fredoka text-lg text-foreground">
                          {template.name}
                        </CardTitle>
                        <CardDescription className="font-inter text-sm">
                          {template.description}
                        </CardDescription>
                      </div>
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                        style={{ backgroundColor: template.color }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPinIcon size={16} />
                          {template.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon size={16} />
                          {template.estimatedDuration}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <UsersIcon size={16} />
                        <span>{template.steps.length} steps in journey</span>
                      </div>

                      {/* Steps Preview */}
                      <div className="flex flex-wrap gap-1">
                        {template.steps.slice(0, 4).map((step, index) => (
                          <Badge
                            key={step.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {step.icon} {step.title}
                          </Badge>
                        ))}
                        {template.steps.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.steps.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <MagnifyingGlassIcon
                  size={48}
                  className="mx-auto text-muted-foreground mb-4"
                />
                <h3 className="font-fredoka text-lg font-semibold text-foreground mb-2">
                  No templates found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms
                </p>
              </div>
            )}
          </div>

          {/* Patient Setup */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-fredoka text-lg">
                  Patient Information
                </CardTitle>
                <CardDescription>
                  Enter the patient's name to personalize their journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label
                    htmlFor="patient-name"
                    className="font-inter font-medium"
                  >
                    Patient Name
                  </Label>
                  <Input
                    id="patient-name"
                    placeholder="Enter patient's name..."
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Selected Template Preview */}
            {selectedTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-fredoka text-lg">
                    Selected Journey
                  </CardTitle>
                  <CardDescription>{selectedTemplate.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPinIcon size={16} className="text-muted-foreground" />
                      <span>{selectedTemplate.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ClockIcon size={16} className="text-muted-foreground" />
                      <span>{selectedTemplate.estimatedDuration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <UsersIcon size={16} className="text-muted-foreground" />
                      <span>{selectedTemplate.steps.length} steps</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h4 className="font-inter font-medium text-sm mb-2">
                      Journey Steps:
                    </h4>
                    <div className="space-y-1">
                      {selectedTemplate.steps.map((step, index) => (
                        <div
                          key={step.id}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm">{step.icon}</span>
                          <span className="flex-1">{step.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Start Journey Button */}
            <Button
              onClick={handleStartJourney}
              disabled={!selectedTemplate || !patientName.trim()}
              className="w-full touch-target font-fredoka font-semibold text-lg h-14"
              size="lg"
            >
              Start {patientName.trim() ? `${patientName}'s` : ""} Journey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
