const KEY = 'rutahema_v1';
const EVENT_KEY = 'rutahema_last_event';
const patientIds = Array.from({ length: 12 }, (_, i) => `H-${String(i + 1).padStart(3, '0')}`);

type ChildEvent = 'child_checkin' | 'child_symptom_report' | 'child_help_request' | 'child_journey_progress';
export type AgeBandId = 'little' | 'school' | 'teen' | 'older-teen';

export interface PassportContext {
  patientId: string;
  age: number;
  ageBand: AgeBandId;
  ageLabel: string;
  coins: number;
  selectedAvatar: string;
  ownedAvatars: string[];
  parentalControls: {
    gamesAllowed: boolean;
    purchasesRequireApproval: boolean;
    dailyGameMinutes: number;
    showAppointmentReminders: boolean;
  };
}

export function getAgeBand(age: number): { id: AgeBandId; label: string; range: string } {
  if (age <= 6) return { id: 'little', label: 'Primera infancia', range: '3 a 6 años' };
  if (age <= 11) return { id: 'school', label: 'Escolar', range: '7 a 11 años' };
  if (age <= 15) return { id: 'teen', label: 'Adolescente', range: '12 a 15 años' };
  return { id: 'older-teen', label: 'Adolescente mayor', range: '15 a 17 años' };
}

function patientDefaults(patient: any) {
  const p = patient;
  p.edad = Number.isFinite(Number(p.edad)) ? Number(p.edad) : 8;
  p.segmentoEdad = getAgeBand(p.edad).id;
  p.wallet = { coins: 40, earned: 40, spent: 0, punctualVisits: 0, rewardedAppointments: [], ...(p.wallet || {}) };
  p.wallet.rewardedAppointments = p.wallet.rewardedAppointments || [];
  p.ownedAvatars = Array.isArray(p.ownedAvatars) && p.ownedAvatars.length ? p.ownedAvatars : ['lion', 'elephant', 'giraffe', 'panda'];
  p.selectedAvatar = p.selectedAvatar || 'lion';
  p.parentalControls = {
    enabled: true, gamesAllowed: true, purchasesRequireApproval: true,
    dailyGameMinutes: 20, showAppointmentReminders: true, updatedAt: '',
    ...(p.parentalControls || {})
  };
  p.learning = { watchedVideos: [], gameSessions: 0, ...(p.learning || {}) };
  return p;
}

function demoDb() {
  const ages = [8, 13, 6, 15, 4, 10, 12, 7, 9, 16, 3, 11];
  return {
    meta: { schemaVersion: 3, appVersion: '3.0', generatedAt: new Date().toISOString().slice(0, 10) },
    pacientes: patientIds.map((code, index) => patientDefaults({
      code, edad: ages[index], procedencia: 'DEMO', tipoIngreso: 'Demo', diagnostico: 'Escenario operativo sintético',
      faseIdx: index === 2 ? 6 : 5, responsable: 'Equipo Ruta Hema', ingreso: new Date().toISOString().slice(0, 10),
      proximaCita: '', ultimoContacto: '', estadoSeguimiento: 'Al día', barreras: '', requiereTraslado: false,
      servicioSocial: 'No requerido'
    })),
    citas: [], seguimientos: [], serviciosocial: [], alertas: [], novedades: [], encuestasAbandono: [],
    config: { profesionales: [{ nombre: 'Equipo Ruta Hema', capacidad: 15 }], email: 'demo@rutahema.local' }
  };
}

function readDb(): any {
  let db: any;
  try { db = JSON.parse(localStorage.getItem(KEY) || 'null') || demoDb(); } catch { db = demoDb(); }
  db.meta = { ...(db.meta || {}), schemaVersion: 3, appVersion: '3.0' };
  db.pacientes = (db.pacientes || []).map(patientDefaults);
  db.novedades = db.novedades || []; db.alertas = db.alertas || []; db.serviciosocial = db.serviciosocial || [];
  db.encuestasAbandono = db.encuestasAbandono || [];
  return db;
}

function saveDb(db: any, event: Record<string, unknown>) {
  const at = new Date().toISOString();
  localStorage.setItem(KEY, JSON.stringify(db));
  localStorage.setItem(EVENT_KEY, JSON.stringify({ ...event, at, source: 'LEOS_ADVENTURE' }));
  window.dispatchEvent(new CustomEvent('rutahema:changed', { detail: { ...event, at } }));
}

function findPatient(db: any, patientId: string) {
  return db.pacientes.find((item: { code: string }) => item.code === patientId);
}

export function getPatientPassport(patientId?: string): PassportContext | null {
  if (!patientId) return null;
  const db = readDb();
  const patient = findPatient(db, patientId);
  if (!patient) return null;
  const band = getAgeBand(patient.edad);
  return {
    patientId,
    age: patient.edad,
    ageBand: band.id,
    ageLabel: `${band.label} · ${band.range}`,
    coins: patient.wallet.coins,
    selectedAvatar: patient.selectedAvatar,
    ownedAvatars: [...patient.ownedAvatars],
    parentalControls: { ...patient.parentalControls }
  };
}

export function recordChildEvent(patientId: string, type: ChildEvent, payload: Record<string, unknown>) {
  const db = readDb();
  const patient = findPatient(db, patientId);
  if (!patient) return;
  const at = new Date().toISOString();
  const detail = String(payload.label || payload.emotion || payload.stepTitle || 'actualización');
  const messages: Record<ChildEvent, string> = {
    child_checkin: `Check-in del niño registrado: ${detail}.`,
    child_symptom_report: `El niño comunicó: ${detail}.`,
    child_help_request: 'El niño pidió ayuda. El equipo y Servicio Social pueden revisarlo.',
    child_journey_progress: `El niño completó el paso: ${detail}.`,
  };
  db.novedades.unshift({ id: `N-${Date.now()}`, pac: patientId, text: messages[type], source: 'LEOS_ADVENTURE', at, type, payload });
  patient.ultimoContacto = at.slice(0, 10);
  patient.childJourney = { lastEvent: type, lastStep: payload.stepTitle || null, updatedAt: at };
  if (type === 'child_help_request') {
    patient.estadoSeguimiento = 'En seguimiento';
    patient.servicioSocial = patient.servicioSocial === 'No requerido' ? 'Requerido' : patient.servicioSocial;
    db.alertas.unshift({ pac: patientId, tipo: 'Solicitud de ayuda del niño', fecha: at.slice(0, 10), nivel: 'Roja', motivo: 'Comunicación enviada desde la experiencia infantil: necesita ayuda.', responsable: patient.responsable || 'Equipo de continuidad', accion: 'Contactar a la familia y coordinar apoyo con Servicio Social', estado: 'Pendiente', source: 'LEOS_ADVENTURE' });
    if (!db.serviciosocial.some((item: { pac: string; estado: string }) => item.pac === patientId && item.estado !== 'Atendido')) {
      db.serviciosocial.unshift({ pac: patientId, motivo: 'Solicitud de ayuda comunicada por el niño', fechaDerivacion: at.slice(0, 10), responsable: 'Trab. Social — Equipo Continuidad', ultimoContacto: '', proximaAccion: 'Contactar a la familia y revisar la solicitud', estado: 'Pendiente', intervenciones: [] });
    }
  }
  saveDb(db, { type, patientId, payload });
}

export function recordLearning(patientId: string, kind: 'video' | 'game', itemId: string) {
  const db = readDb(), patient = findPatient(db, patientId); if (!patient) return;
  if (kind === 'video' && !patient.learning.watchedVideos.includes(itemId)) patient.learning.watchedVideos.push(itemId);
  if (kind === 'game') patient.learning.gameSessions += 1;
  db.novedades.unshift({ id: `N-${Date.now()}`, pac: patientId, text: kind === 'video' ? 'Video educativo completado.' : 'Juego educativo completado.', source: 'LEOS_ADVENTURE', at: new Date().toISOString(), type: kind === 'video' ? 'VIDEO_COMPLETED' : 'GAME_COMPLETED', payload: { itemId } });
  saveDb(db, { type: kind === 'video' ? 'VIDEO_COMPLETED' : 'GAME_COMPLETED', patientId, itemId });
}

export function purchaseAvatar(patientId: string, avatarId: string, cost: number, adultApproved: boolean): PassportContext {
  const db = readDb(), patient = findPatient(db, patientId); if (!patient) throw new Error('Paciente no encontrado');
  if (!patient.ownedAvatars.includes(avatarId)) {
    if (patient.parentalControls.purchasesRequireApproval && !adultApproved) throw new Error('Necesitas la aprobación de tu adulto responsable.');
    if (patient.wallet.coins < cost) throw new Error('Aún no tienes suficientes monedas.');
    patient.wallet.coins -= cost; patient.wallet.spent += cost; patient.ownedAvatars.push(avatarId);
  }
  patient.selectedAvatar = avatarId;
  db.novedades.unshift({ id: `N-${Date.now()}`, pac: patientId, text: `Avatar ${avatarId} desbloqueado y equipado.`, source: 'LEOS_ADVENTURE', at: new Date().toISOString(), type: 'AVATAR_UNLOCKED', payload: { avatarId, cost } });
  saveDb(db, { type: 'AVATAR_UNLOCKED', patientId, avatarId, cost });
  return getPatientPassport(patientId)!;
}

export function selectPatientAvatar(patientId: string, avatarId: string) {
  const db = readDb(), patient = findPatient(db, patientId); if (!patient || !patient.ownedAvatars.includes(avatarId)) return;
  patient.selectedAvatar = avatarId;
  saveDb(db, { type: 'AVATAR_SELECTED', patientId, avatarId });
}
