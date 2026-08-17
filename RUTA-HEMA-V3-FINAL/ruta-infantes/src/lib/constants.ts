import { JourneyStep } from '@/types';

export const DEFAULT_JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'arrival',
    title: 'Welcome to the Hospital!',
    description: 'You made it! Time to start your adventure.',
    icon: '🏥',
    completed: false,
    current: true,
  },
  {
    id: 'triage',
    title: 'Meet the Nurse',
    description: 'A friendly nurse will check how you\'re feeling.',
    icon: '👩‍⚕️',
    completed: false,
    current: false,
  },
  {
    id: 'waiting',
    title: 'Adventure Waiting Room',
    description: 'Rest and play while we prepare your next step.',
    icon: '🎮',
    completed: false,
    current: false,
  },
  {
    id: 'examination',
    title: 'Doctor Visit',
    description: 'Meet the doctor who will help you feel better.',
    icon: '👨‍⚕️',
    completed: false,
    current: false,
  },
  {
    id: 'treatment',
    title: 'Getting Better',
    description: 'Time for your special treatment to help you heal.',
    icon: '💊',
    completed: false,
    current: false,
  },
  {
    id: 'completion',
    title: 'Health Hero!',
    description: 'You did amazing! Collect your hero badge.',
    icon: '🏆',
    completed: false,
    current: false,
  },
];

export const AVATAR_TYPES = [
  { id: 'lion', name: 'Leo León', emoji: '🦁' },
  { id: 'elephant', name: 'Eli Elefante', emoji: '🐘' },
  { id: 'giraffe', name: 'Gina Jirafa', emoji: '🦒' },
  { id: 'panda', name: 'Pandi', emoji: '🐼' },
  { id: 'tuntung', name: 'Tuntung Sajur', emoji: '🪵' },
  { id: 'astronaut', name: 'Explorador Estelar', emoji: '🧑‍🚀' },
  { id: 'guardian', name: 'Guardián Hema', emoji: '🦸' },
] as const;

export const AVATAR_COLORS = [
  { id: 'blue', name: 'Ocean Blue', color: 'oklch(0.7 0.15 220)' },
  { id: 'green', name: 'Forest Green', color: 'oklch(0.8 0.12 150)' },
  { id: 'yellow', name: 'Sunshine Yellow', color: 'oklch(0.85 0.15 85)' },
  { id: 'coral', name: 'Coral Pink', color: 'oklch(0.75 0.18 30)' },
  { id: 'purple', name: 'Royal Purple', color: 'oklch(0.65 0.2 280)' },
] as const;

export const EMOTIONS = [
  { id: 'calm', name: 'Tranquilo', emoji: '😊', color: 'oklch(0.85 0.15 85)' },
  { id: 'good', name: 'Bien', emoji: '🙂', color: 'oklch(0.75 0.18 30)' },
  { id: 'so-so', name: 'Más o menos', emoji: '😐', color: 'oklch(0.7 0.15 220)' },
  { id: 'worried', name: 'Preocupado', emoji: '😟', color: 'oklch(0.65 0.2 280)' },
  { id: 'need-help', name: 'Necesito ayuda', emoji: '😣', color: 'oklch(0.6 0.25 15)' },
] as const;

export const PAIN_LEVELS = [
  { level: 0, emoji: '🙂', description: 'Estoy bien' },
  { level: 1, emoji: '😣', description: 'Me duele un poco' },
  { level: 2, emoji: '😴', description: 'Estoy cansado' },
  { level: 3, emoji: '🤢', description: 'Tengo náuseas' },
  { level: 4, emoji: '🙋', description: 'Necesito que me ayuden' },
  { level: 5, emoji: '💬', description: 'Necesito hablar con alguien' },
] as const;

export const BADGES = [
  { id: 'brave-start', name: 'Brave Beginner', emoji: '🌟', description: 'Started your hospital adventure!' },
  { id: 'emotion-sharer', name: 'Feeling Friend', emoji: '💝', description: 'Shared how you feel!' },
  { id: 'pain-reporter', name: 'Comfort Communicator', emoji: '🗣️', description: 'Told us about your comfort!' },
  { id: 'step-completed', name: 'Step Hero', emoji: '👣', description: 'Completed an adventure step!' },
  { id: 'journey-walker', name: 'Adventure Walker', emoji: '👣', description: 'Moved through your journey!' },
  { id: 'treatment-hero', name: 'Treatment Hero', emoji: '⚡', description: 'Completed your treatment!' },
  { id: 'health-champion', name: 'Health Champion', emoji: '🏆', description: 'Finished your hospital adventure!' },
] as const;
