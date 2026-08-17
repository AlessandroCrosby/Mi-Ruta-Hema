import { JourneyTemplate } from '@/types';

export const journeyTemplates: JourneyTemplate[] = [
  {
    id: 'ruta-hema-pediatrica',
    name: 'Mi Ruta Hema',
    description: 'Una aventura paso a paso con tu equipo',
    department: 'Ruta Hematológica Pediátrica',
    estimatedDuration: 'A tu ritmo',
    color: '#4FC3F7',
    steps: [
      {
        id: 'arrival',
        title: 'Mi llegada',
        description: 'Llegaste: comienza tu aventura acompañado.',
        icon: '🏥'
      },
      {
        id: 'triage',
        title: 'Conozco al equipo',
        description: 'Saluda a las personas que te acompañan.',
        icon: '👋'
      },
      {
        id: 'waiting',
        title: 'Mi control',
        description: 'Cuéntanos cómo te sientes hoy.',
        icon: '😊'
      },
      {
        id: 'doctor-visit',
        title: 'Mi tratamiento',
        description: 'Un paso más con tu equipo.',
        icon: '✨'
      },
      {
        id: 'treatment',
        title: 'Descanso y recuperación',
        description: 'Tómate un momento para descansar.',
        icon: '🌈'
      },
      {
        id: 'discharge',
        title: 'Mi próximo paso',
        description: '¡Muy bien! Mira qué sigue en tu ruta.',
        icon: '🗺️'
      },
      {
        id: 'follow-up',
        title: 'Seguimiento',
        description: 'Tu equipo y tu familia siguen acompañándote.',
        icon: '🤝'
      }
    ]
  },
  /* Plantillas originales conservadas para el flujo de demostración del equipo. */
  {
    id: 'emergency-xray',
    name: 'Emergency Visit - X-Ray',
    description: 'Emergency visit requiring imaging',
    department: 'Emergency Department',
    estimatedDuration: '2-3 hours',
    color: '#81C784',
    steps: [
      {
        id: 'arrival',
        title: 'Welcome to the Hospital',
        description: 'Leo arrives at the Emergency Department',
        icon: '🏥'
      },
      {
        id: 'triage',
        title: 'Meet the Triage Nurse',
        description: 'Quick check to see how Leo is feeling',
        icon: '👩‍⚕️'
      },
      {
        id: 'doctor-initial',
        title: 'First Doctor Visit',
        description: 'The doctor examines Leo',
        icon: '👨‍⚕️'
      },
      {
        id: 'xray-prep',
        title: 'Getting Ready for X-Ray',
        description: 'Leo prepares for special pictures',
        icon: '📋'
      },
      {
        id: 'xray',
        title: 'Taking Special Pictures',
        description: 'Leo gets X-ray photos taken',
        icon: '📸'
      },
      {
        id: 'results-wait',
        title: 'Waiting for Results',
        description: 'Leo waits while doctors look at the pictures',
        icon: '⏰'
      },
      {
        id: 'doctor-results',
        title: 'Doctor Explains Results',
        description: 'The doctor shows Leo the X-ray pictures',
        icon: '👨‍⚕️'
      },
      {
        id: 'treatment',
        title: 'Getting Better',
        description: 'Leo gets the care needed',
        icon: '💊'
      },
      {
        id: 'discharge',
        title: 'Going Home',
        description: 'Leo is all better and ready to go!',
        icon: '🏠'
      }
    ]
  },
  {
    id: 'emergency-cast',
    name: 'Emergency Visit - Broken Bone',
    description: 'Emergency visit for fracture requiring cast',
    department: 'Emergency Department',
    estimatedDuration: '3-4 hours',
    color: '#FFB74D',
    steps: [
      {
        id: 'arrival',
        title: 'Welcome to the Hospital',
        description: 'Leo arrives at the Emergency Department',
        icon: '🏥'
      },
      {
        id: 'triage',
        title: 'Meet the Triage Nurse',
        description: 'Quick check to see how Leo is feeling',
        icon: '👩‍⚕️'
      },
      {
        id: 'pain-relief',
        title: 'Feeling Better',
        description: 'Leo gets medicine to feel more comfortable',
        icon: '💊'
      },
      {
        id: 'doctor-exam',
        title: 'Doctor Examination',
        description: 'The doctor carefully examines Leo',
        icon: '👨‍⚕️'
      },
      {
        id: 'xray',
        title: 'Taking Special Pictures',
        description: 'Leo gets X-ray photos of the hurt area',
        icon: '📸'
      },
      {
        id: 'cast-prep',
        title: 'Getting Ready for Cast',
        description: 'Leo prepares for a special bandage',
        icon: '🎨'
      },
      {
        id: 'cast-application',
        title: 'Getting a Cool Cast',
        description: 'Leo gets a colorful cast to help heal',
        icon: '🦴'
      },
      {
        id: 'cast-care',
        title: 'Learning Cast Care',
        description: 'Leo learns how to take care of the cast',
        icon: '📚'
      },
      {
        id: 'discharge',
        title: 'Going Home Strong',
        description: 'Leo is ready to heal at home!',
        icon: '🏠'
      }
    ]
  },
  {
    id: 'surgery-day',
    name: 'Day Surgery',
    description: 'Same-day surgery procedure',
    department: 'Surgery Department',
    estimatedDuration: '4-6 hours',
    color: '#BA68C8',
    steps: [
      {
        id: 'arrival',
        title: 'Welcome to Surgery',
        description: 'Leo arrives for a special procedure',
        icon: '🏥'
      },
      {
        id: 'registration',
        title: 'Check-In Time',
        description: 'Leo checks in and gets a special bracelet',
        icon: '📋'
      },
      {
        id: 'pre-op',
        title: 'Getting Ready',
        description: 'Leo changes into special clothes',
        icon: '👕'
      },
      {
        id: 'meet-team',
        title: 'Meet the Surgery Team',
        description: 'Leo meets all the helpers',
        icon: '👥'
      },
      {
        id: 'pre-med',
        title: 'Relaxation Medicine',
        description: 'Leo gets medicine to feel calm',
        icon: '💊'
      },
      {
        id: 'surgery',
        title: 'Having Surgery',
        description: 'Leo sleeps while doctors help',
        icon: '😴'
      },
      {
        id: 'recovery',
        title: 'Waking Up',
        description: 'Leo wakes up feeling better',
        icon: '😊'
      },
      {
        id: 'post-op',
        title: 'Getting Strong Again',
        description: 'Leo rests and gets better',
        icon: '💪'
      },
      {
        id: 'discharge',
        title: 'Going Home Healthy',
        description: 'Leo is all better and ready to go!',
        icon: '🏠'
      }
    ]
  },
  {
    id: 'outpatient-checkup',
    name: 'Routine Check-Up',
    description: 'Regular appointment with pediatrician',
    department: 'Outpatient Clinic',
    estimatedDuration: '1 hour',
    color: '#4DB6AC',
    steps: [
      {
        id: 'arrival',
        title: 'Welcome to the Clinic',
        description: 'Leo arrives for a regular check-up',
        icon: '🏥'
      },
      {
        id: 'check-in',
        title: 'Check-In',
        description: 'Leo says hello at the front desk',
        icon: '📋'
      },
      {
        id: 'waiting',
        title: 'Fun Waiting Time',
        description: 'Leo waits in the colorful waiting room',
        icon: '🪑'
      },
      {
        id: 'measurements',
        title: 'Growing Check',
        description: 'Leo sees how much they have grown',
        icon: '📏'
      },
      {
        id: 'doctor-visit',
        title: 'See the Doctor',
        description: 'The friendly doctor checks Leo',
        icon: '👨‍⚕️'
      },
      {
        id: 'healthy-talk',
        title: 'Staying Healthy',
        description: 'Leo learns about staying strong',
        icon: '🍎'
      },
      {
        id: 'rewards',
        title: 'Good Job Sticker',
        description: 'Leo gets a sticker for being brave',
        icon: '⭐'
      },
      {
        id: 'going-home',
        title: 'See You Next Time',
        description: 'Leo says goodbye until next visit',
        icon: '👋'
      }
    ]
  }
];
