import { AvatarDisplay } from "@/components/avatar/AvatarDisplay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSharedGameState } from "@/contexts/GameStateContext";
import { useProfiles } from "@/contexts/ProfilesContext";
import { EMOTIONS, PAIN_LEVELS } from "@/lib/constants";
import { ChildProfile } from "@/types";
import {
  ArrowLeftIcon,
  ClockIcon,
  DownloadIcon,
  PlusIcon,
  TrendUpIcon,
  UsersIcon,
} from "@phosphor-icons/react/ssr";
import { useState } from "react";

export function StaffDashboard() {
  const { updateCurrentScreen, setCurrentScreen } = useSharedGameState();
  const { allProfiles: profiles, addOrUpdateProfile } = useProfiles();
  const [selectedProfile, setSelectedProfile] = useState<ChildProfile | null>(
    null
  );

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getLatestEmotion = (profile: ChildProfile) => {
    const latest = profile.emotions[profile.emotions.length - 1];
    if (!latest) return null;
    const emotion = EMOTIONS.find((e) => e.id === latest.emotion);
    return { ...latest, emotion: emotion };
  };

  const getLatestPain = (profile: ChildProfile) => {
    const latest = profile.painLevels[profile.painLevels.length - 1];
    if (!latest) return null;
    const painLevel = PAIN_LEVELS.find((p) => p.level === latest.level);
    return { ...latest, painLevel: painLevel };
  };

  const getPainTrend = (profile: ChildProfile) => {
    if (profile.painLevels.length < 2) return "stable";
    const recent = profile.painLevels.slice(-2);
    if (recent[1].level > recent[0].level) return "increasing";
    if (recent[1].level < recent[0].level) return "decreasing";
    return "stable";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                console.log("Back to App clicked in staff dashboard");
                updateCurrentScreen("welcome");
              }}
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to App
            </Button>
            <div>
              <h1 className="text-2xl font-inter font-bold text-foreground">
                Leo's Adventure - Staff Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Real-time patient emotional state and comfort monitoring
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setCurrentScreen("journey-setup")}
              className="touch-target"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Setup New Journey
            </Button>
            <Button variant="outline" size="sm">
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Active Patients</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <Card className="p-6">
                <div className="flex items-center space-x-2">
                  <UsersIcon className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">
                      {profiles?.length ?? 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Active Patients
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-8 h-8 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">
                      {profiles?.filter((p) => p.emotions.length > 0).length ??
                        0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Recent Check-ins
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendUpIcon className="w-8 h-8 text-secondary" />
                  <div>
                    <p className="text-2xl font-bold">
                      {profiles?.filter((p) => {
                        const latest = getLatestPain(p);
                        return latest && latest.level <= 2;
                      }).length ?? 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Comfortable Patients
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Recent Patient Activity
              </h3>
              <div className="space-y-4">
                {(profiles ?? []).slice(-5).map((profile) => {
                  const latestEmotion = getLatestEmotion(profile);
                  const latestPain = getLatestPain(profile);

                  return (
                    <div
                      key={profile.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <AvatarDisplay avatar={profile.avatar} size="sm" />
                        <div>
                          <p className="font-medium">{profile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Started: {formatTime(profile.visitStartTime)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {latestEmotion && (
                          <div className="flex items-center space-x-1">
                            <span>{latestEmotion.emotion?.emoji}</span>
                            <span className="text-sm">
                              {latestEmotion.emotion?.name}
                            </span>
                          </div>
                        )}
                        {latestPain && (
                          <Badge
                            variant={
                              latestPain.level > 3 ? "destructive" : "secondary"
                            }
                          >
                            Pain: {latestPain.level}/5
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patient List */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Select Patient</h3>
                <div className="space-y-3">
                  {(profiles ?? []).map((profile) => {
                    const latestEmotion = getLatestEmotion(profile);
                    const latestPain = getLatestPain(profile);
                    const painTrend = getPainTrend(profile);

                    return (
                      <div
                        key={profile.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedProfile?.id === profile.id
                            ? "bg-primary/10 ring-2 ring-primary/20"
                            : "bg-muted/30 hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedProfile(profile)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <AvatarDisplay avatar={profile.avatar} size="sm" />
                            <div>
                              <p className="font-medium">{profile.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Step {profile.currentStep + 1} •{" "}
                                {formatTime(profile.visitStartTime)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {latestPain && (
                              <Badge
                                variant={
                                  latestPain.level > 3
                                    ? "destructive"
                                    : latestPain.level > 1
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {latestPain.painLevel?.emoji} {latestPain.level}
                              </Badge>
                            )}
                            {painTrend === "increasing" && (
                              <span className="text-red-500">↑</span>
                            )}
                            {painTrend === "decreasing" && (
                              <span className="text-green-500">↓</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Patient Details */}
              {selectedProfile && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Patient Details
                  </h3>
                  <div className="space-y-4">
                    {/* Patient Info */}
                    <div className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg">
                      <AvatarDisplay
                        avatar={selectedProfile.avatar}
                        size="md"
                        showName
                      />
                      <div>
                        <p className="text-lg font-semibold">
                          {selectedProfile.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Visit started:{" "}
                          {formatDate(selectedProfile.visitStartTime)} at{" "}
                          {formatTime(selectedProfile.visitStartTime)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Current step: {selectedProfile.currentStep + 1} of 6
                        </p>
                      </div>
                    </div>

                    {/* Recent Emotions */}
                    <div>
                      <h4 className="font-medium mb-2">Recent Emotions</h4>
                      <div className="space-y-2">
                        {selectedProfile.emotions.slice(-3).map((emotion) => {
                          const emotionData = EMOTIONS.find(
                            (e) => e.id === emotion.emotion
                          );
                          return (
                            <div
                              key={emotion.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center space-x-2">
                                <span>{emotionData?.emoji}</span>
                                <span>{emotionData?.name}</span>
                              </div>
                              <span className="text-muted-foreground">
                                {formatTime(emotion.timestamp)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recent Pain Levels */}
                    <div>
                      <h4 className="font-medium mb-2">Pain History</h4>
                      <div className="space-y-2">
                        {selectedProfile.painLevels.slice(-3).map((pain) => {
                          const painData = PAIN_LEVELS.find(
                            (p) => p.level === pain.level
                          );
                          return (
                            <div
                              key={pain.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center space-x-2">
                                <span>{painData?.emoji}</span>
                                <span>Level {pain.level}/5</span>
                                <Badge
                                  variant={
                                    pain.level > 3
                                      ? "destructive"
                                      : pain.level > 1
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {pain.level > 3
                                    ? "High"
                                    : pain.level > 1
                                    ? "Moderate"
                                    : "Low"}
                                </Badge>
                              </div>
                              <span className="text-muted-foreground">
                                {formatTime(pain.timestamp)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Badges */}
                    <div>
                      <h4 className="font-medium mb-2">Earned Badges</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfile.badges.map((badgeId) => (
                          <Badge key={badgeId} variant="secondary">
                            🏆{" "}
                            {badgeId
                              .split("-")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Patient Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Emotion Distribution</h4>
                  <div className="space-y-2">
                    {EMOTIONS.map((emotion) => {
                      const count = (profiles ?? []).reduce(
                        (acc, profile) =>
                          acc +
                          profile.emotions.filter(
                            (e) => e.emotion === emotion.id
                          ).length,
                        0
                      );
                      return (
                        <div
                          key={emotion.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center space-x-2">
                            <span>{emotion.emoji}</span>
                            <span>{emotion.name}</span>
                          </div>
                          <span className="font-medium">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Pain Level Distribution</h4>
                  <div className="space-y-2">
                    {PAIN_LEVELS.map((level) => {
                      const count = (profiles ?? []).reduce(
                        (acc, profile) =>
                          acc +
                          profile.painLevels.filter(
                            (p) => p.level === level.level
                          ).length,
                        0
                      );
                      return (
                        <div
                          key={level.level}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center space-x-2">
                            <span>{level.emoji}</span>
                            <span>Level {level.level}</span>
                          </div>
                          <span className="font-medium">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
