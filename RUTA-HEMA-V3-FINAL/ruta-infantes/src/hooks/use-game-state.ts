import { useProfiles } from '@/contexts/ProfilesContext';
import { journeyTemplates } from '@/data/journey-templates';
import { ChildProfile, GameState, JourneyStep, JourneyTemplate } from '@/types';
import { useEffect, useState } from 'react';
import { getPatientPassport, recordChildEvent, selectPatientAvatar } from '@/lib/ruta-hema-sync';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    currentScreen: 'welcome',
    journeySteps: [], // Will be set by template
    showStaffAccess: false,
  });

  const { addOrUpdateProfile } = useProfiles();

  // Initialize journey steps if empty and no template selected
  useEffect(() => {
    if (!gameState) return;
    if (gameState.journeySteps?.length === 0 && !gameState.selectedJourneyTemplate) {
      // Use the first template as default (basic emergency visit)
      const defaultTemplate = journeyTemplates[0];
      setSelectedJourneyTemplate(defaultTemplate);
    }
  }, [gameState.journeySteps.length, gameState.selectedJourneyTemplate]);

  const updateCurrentScreen = (screen: GameState['currentScreen']) => {
    console.log('Updating screen to:', screen);
    setGameState(current => {
      const safeCurrent = current ?? {
        currentScreen: 'welcome',
        journeySteps: [],
        showStaffAccess: false,
      };
      const newState: GameState = {
        ...safeCurrent,
        currentScreen: screen
      };
      console.log('New state:', newState);
      return newState;
    });
  };

  const createChildProfile = (profile: ChildProfile) => {
    console.log('Creating child profile:', profile);
    setGameState(current => {
      const safeCurrent = current ?? {
        currentScreen: 'welcome',
        journeySteps: [],
        showStaffAccess: false,
      };
      const newState: GameState = {
        ...safeCurrent,
        childProfile: profile,
        currentScreen: 'journey'
      };
      console.log('New state with profile:', newState);
      return newState;
    });
    addOrUpdateProfile(profile);
    if (gameState.patientId) selectPatientAvatar(gameState.patientId, profile.avatar.type);
  };

  const updateJourneyStep = (stepId: string, completed: boolean = true) => {
    console.log('updateJourneyStep called with:', stepId, completed);
    setGameState(current => {
      const safeCurrent = current ?? {
        currentScreen: 'welcome',
        journeySteps: [],
        showStaffAccess: false,
      };
      const journeySteps = safeCurrent.journeySteps ?? [];
      const stepIndex = journeySteps.findIndex(s => s.id === stepId);
      console.log('Found step index:', stepIndex);
      if (stepIndex === -1) {
        console.error('Step not found:', stepId);
        return safeCurrent;
      }
      const updatedSteps = journeySteps.map((step, index) => {
        if (step.id === stepId) {
          return { ...step, completed, current: false };
        }
        return step;
      });
      // Mark next step as current if we completed this step
      if (completed && stepIndex < updatedSteps.length - 1) {
        updatedSteps[stepIndex + 1].current = true;
      }
      const childProfile = safeCurrent.childProfile;
      const updatedProfile = childProfile ? {
        ...childProfile,
        currentStep: completed ? Math.min(childProfile.currentStep + 1, updatedSteps.length - 1) : childProfile.currentStep,
        completedSteps: completed
          ? [...childProfile.completedSteps.filter(id => id !== stepId), stepId]
          : childProfile.completedSteps.filter(id => id !== stepId)
      } : childProfile;
      if (updatedProfile) {
        addOrUpdateProfile(updatedProfile);
      }
      if (completed && safeCurrent.patientId) {
        const step = updatedSteps[stepIndex];
        recordChildEvent(safeCurrent.patientId, 'child_journey_progress', { stepId, stepTitle: step.title });
      }
      const newState: GameState = {
        ...safeCurrent,
        journeySteps: updatedSteps,
        childProfile: updatedProfile
      };
      console.log('New state:', newState);
      return newState;
    });
  };

  const addEmotionEntry = (emotion: ChildProfile['emotions'][0]) => {
    setGameState(current => {
      const safeCurrent = current ?? {
        currentScreen: 'welcome',
        journeySteps: [],
        showStaffAccess: false,
      };
      const childProfile = safeCurrent.childProfile;
      const updatedProfile = childProfile ? {
        ...childProfile,
        emotions: [...childProfile.emotions, emotion]
      } : childProfile;
      if (updatedProfile) {
        addOrUpdateProfile(updatedProfile);
      }
      if (safeCurrent.patientId) {
        const label = emotion.emotion === 'need-help' ? 'Necesito ayuda' : emotion.emotion;
        recordChildEvent(safeCurrent.patientId, emotion.emotion === 'need-help' ? 'child_help_request' : 'child_checkin', { emotion: emotion.emotion, label, journeyStep: emotion.journeyStep });
      }
      const newState: GameState = {
        ...safeCurrent,
        childProfile: updatedProfile
      };
      return newState;
    });
  };

  const addPainEntry = (pain: ChildProfile['painLevels'][0]) => {
    setGameState(current => {
      const safeCurrent = current ?? {
        currentScreen: 'welcome',
        journeySteps: [],
        showStaffAccess: false,
      };
      const childProfile = safeCurrent.childProfile;
      const updatedProfile = childProfile ? {
        ...childProfile,
        painLevels: [...childProfile.painLevels, pain]
      } : childProfile;
      if (updatedProfile) {
        addOrUpdateProfile(updatedProfile);
      }
      if (safeCurrent.patientId) {
        const messages = ['Estoy bien', 'Me duele un poco', 'Estoy cansado', 'Tengo náuseas', 'Necesito que me ayuden', 'Necesito hablar con alguien'];
        recordChildEvent(safeCurrent.patientId, pain.level >= 4 ? 'child_help_request' : 'child_symptom_report', { level: pain.level, label: messages[pain.level], journeyStep: pain.journeyStep });
      }
      const newState: GameState = {
        ...safeCurrent,
        childProfile: updatedProfile
      };
      return newState;
    });
  };

  const awardBadge = (badgeId: string) => {
    setGameState(current => {
      const safeCurrent = current ?? {
        currentScreen: 'welcome',
        journeySteps: [],
        showStaffAccess: false,
      };
      const childProfile = safeCurrent.childProfile;
      const updatedProfile = childProfile ? {
        ...childProfile,
        badges: childProfile.badges.includes(badgeId)
          ? childProfile.badges
          : [...childProfile.badges, badgeId]
      } : childProfile;
      if (updatedProfile) {
        addOrUpdateProfile(updatedProfile);
      }
      const newState: GameState = {
        ...safeCurrent,
        childProfile: updatedProfile
      };
      return newState;
    });
  };

  const toggleStaffAccess = () => {
    console.log('Toggling staff access, current:', gameState?.showStaffAccess);
    setGameState(current => {
      const safeCurrent = current ?? {
        currentScreen: 'welcome',
        journeySteps: [],
        showStaffAccess: false,
      };
      const newState: GameState = {
        ...safeCurrent,
        showStaffAccess: !safeCurrent.showStaffAccess
      };
      console.log('New staff access state:', newState.showStaffAccess);
      return newState;
    });
  };

  const setSelectedJourneyTemplate = (template: JourneyTemplate, patientName?: string) => {
    console.log('Setting journey template:', template);
    // Convert template steps to journey steps
    const journeySteps: JourneyStep[] = template.steps.map((step, index) => ({
      ...step,
      completed: false,
      current: index === 0 // First step is current
    }));
    setGameState(current => {
      const safeCurrent = current ?? {
        currentScreen: 'welcome',
        journeySteps: [],
        showStaffAccess: false,
      };
      const newState: GameState = {
        ...safeCurrent,
        selectedJourneyTemplate: template,
        journeySteps: journeySteps,
        patientName: patientName || safeCurrent.patientName
      };
      return newState;
    });
  };

  const setCurrentScreen = (screen: GameState['currentScreen']) => {
    updateCurrentScreen(screen);
  };

  const setPatientId = (patientId: string) => {
    const passport = getPatientPassport(patientId);
    setGameState(current => ({
      ...current,
      patientId,
      patientName: patientId,
      patientAge: passport?.age,
      ageBand: passport?.ageBand,
    }));
  };

  const equipAvatar = (avatar: ChildProfile['avatar']) => {
    setGameState(current => {
      const updatedProfile = current.childProfile ? { ...current.childProfile, avatar } : current.childProfile;
      if (updatedProfile) addOrUpdateProfile(updatedProfile);
      if (current.patientId) selectPatientAvatar(current.patientId, avatar.type);
      return { ...current, childProfile: updatedProfile };
    });
  };

  const resetGame = () => {
    console.log('Resetting game to welcome screen');
    setGameState(() => {
      const newState: GameState = {
        currentScreen: 'welcome',
        journeySteps: [], // Will be set by template
        showStaffAccess: false,
      };
      console.log('Reset state:', newState);
      return newState;
    });
  };

  const createTestProfile = () => {
    const testProfile = {
      id: 'test-profile-' + Date.now(),
      name: 'Test Hero',
      avatar: {
        id: 'test-avatar',
        name: 'Test Lion',
        type: 'lion' as const,
        color: '#FFD700'
      },
      emotions: [],
      painLevels: [],
      currentStep: 5,
      completedSteps: ['arrival', 'triage', 'examination', 'treatment', 'recovery'],
      badges: ['brave-hero', 'step-completed', 'health-champion'],
      visitStartTime: new Date()
    };
    setGameState(current => {
      const safeCurrent = current ?? {
        currentScreen: 'welcome',
        journeySteps: [],
        showStaffAccess: false,
      };
      const newState: GameState = {
        ...safeCurrent,
        childProfile: testProfile
      };
      return newState;
    });
    addOrUpdateProfile(testProfile);
    return testProfile;
  };

  const createTestProfiles = () => {
    const testProfiles = [
      {
        id: 'emma-profile',
        name: 'Emma',
        avatar: {
          id: 'emma-avatar',
          name: 'Emma the Elephant',
          type: 'elephant' as const,
          color: '#87CEEB'
        },
        emotions: [
          { id: 'emma-e1', emotion: 'worried' as const, timestamp: new Date(Date.now() - 30000), journeyStep: 'arrival' },
          { id: 'emma-e2', emotion: 'happy' as const, timestamp: new Date(), journeyStep: 'triage' }
        ],
        painLevels: [
          { id: 'emma-p1', level: 3 as const, timestamp: new Date(Date.now() - 20000), journeyStep: 'arrival' },
          { id: 'emma-p2', level: 1 as const, timestamp: new Date(), journeyStep: 'triage' }
        ],
        currentStep: 2,
        completedSteps: ['arrival', 'triage'],
        badges: ['brave-start', 'emotion-sharer'],
        visitStartTime: new Date(Date.now() - 60000)
      },
      {
        id: 'alex-profile',
        name: 'Alex',
        avatar: {
          id: 'alex-avatar',
          name: 'Alex the Panda',
          type: 'panda' as const,
          color: '#90EE90'
        },
        emotions: [
          { id: 'alex-e1', emotion: 'excited' as const, timestamp: new Date(Date.now() - 45000), journeyStep: 'arrival' }
        ],
        painLevels: [
          { id: 'alex-p1', level: 0 as const, timestamp: new Date(Date.now() - 40000), journeyStep: 'arrival' }
        ],
        currentStep: 0,
        completedSteps: [],
        badges: ['brave-start'],
        visitStartTime: new Date(Date.now() - 90000)
      }
    ];

    testProfiles.forEach(profile => addOrUpdateProfile(profile));
    return testProfiles;
  };

  return {
    gameState,
    updateCurrentScreen,
    setCurrentScreen,
    setPatientId,
    equipAvatar,
    setSelectedJourneyTemplate,
    createChildProfile,
    updateJourneyStep,
    addEmotionEntry,
    addPainEntry,
    awardBadge,
    toggleStaffAccess,
    resetGame,
    createTestProfile,
    createTestProfiles
  };
}
