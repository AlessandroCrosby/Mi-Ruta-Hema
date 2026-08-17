/* RUTA HEMA v3 shared data service - local MVP adapter.
   Replace only this adapter with authenticated API calls in production. */
(function (root) {
  'use strict';

  const KEY = 'rutahema_v1';
  const EVENT_KEY = 'rutahema_last_event';
  const now = () => new Date().toISOString();
  const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));
  const patientIds = Array.from({ length: 12 }, (_, i) => `H-${String(i + 1).padStart(3, '0')}`);

  function ageBand(age) {
    const value = Number(age);
    if (value <= 6) return { id: 'little', label: 'Primera infancia', range: '3 a 6 años', tone: 'bosque mágico' };
    if (value <= 11) return { id: 'school', label: 'Escolar', range: '7 a 11 años', tone: 'expedición' };
    if (value <= 15) return { id: 'teen', label: 'Adolescente', range: '12 a 15 años', tone: 'misión espacial' };
    return { id: 'older-teen', label: 'Adolescente mayor', range: '15 a 17 años', tone: 'bitácora urbana' };
  }

  function patientDefaults(patient) {
    const p = patient || {};
    p.edad = Number.isFinite(Number(p.edad)) ? Number(p.edad) : 8;
    p.segmentoEdad = ageBand(p.edad).id;
    p.wallet = Object.assign({ coins: 40, earned: 40, spent: 0, punctualVisits: 0, rewardedAppointments: [] }, p.wallet || {});
    p.wallet.rewardedAppointments = p.wallet.rewardedAppointments || [];
    p.ownedAvatars = Array.isArray(p.ownedAvatars) && p.ownedAvatars.length ? p.ownedAvatars : ['lion', 'elephant', 'giraffe', 'panda'];
    p.selectedAvatar = p.selectedAvatar || 'lion';
    p.parentalControls = Object.assign({
      enabled: true,
      gamesAllowed: true,
      purchasesRequireApproval: true,
      dailyGameMinutes: 20,
      showAppointmentReminders: true,
      updatedAt: ''
    }, p.parentalControls || {});
    p.learning = Object.assign({ watchedVideos: [], gameSessions: 0 }, p.learning || {});
    return p;
  }

  function demoDb() {
    return {
      meta: { schemaVersion: 3, appVersion: '3.0', generatedAt: now().slice(0, 10), dataPolicy: 'Escenarios sintéticos sin datos identificables.' },
      pacientes: patientIds.map((code, index) => patientDefaults({
        code,
        edad: [8, 13, 6, 15, 4, 10, 12, 7, 9, 16, 3, 11][index],
        procedencia: 'DEMO', tipoIngreso: 'Demo', diagnostico: 'Escenario operativo sintético',
        faseIdx: index === 2 ? 6 : 5, responsable: 'Equipo Ruta Hema', ingreso: now().slice(0, 10),
        proximaCita: '', ultimoContacto: '', estadoSeguimiento: 'Al día', barreras: '',
        requiereTraslado: false, servicioSocial: 'No requerido'
      })),
      citas: [], seguimientos: [], serviciosocial: [], alertas: [], novedades: [], encuestasAbandono: [],
      config: { profesionales: [{ nombre: 'Equipo Ruta Hema', capacidad: 15 }], email: 'demo@rutahema.local' }
    };
  }

  function normalize(db) {
    if (!db) return null;
    db.meta = Object.assign({}, db.meta || {}, { schemaVersion: 3, appVersion: '3.0' });
    db.pacientes = (db.pacientes || []).map(patientDefaults);
    db.citas = db.citas || [];
    db.seguimientos = db.seguimientos || [];
    db.serviciosocial = db.serviciosocial || [];
    db.alertas = db.alertas || [];
    db.novedades = db.novedades || [];
    db.encuestasAbandono = db.encuestasAbandono || [];
    return db;
  }

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      return normalize(raw ? JSON.parse(raw) : demoDb());
    } catch (_) { return demoDb(); }
  }

  function write(db, event) {
    normalize(db);
    const stamped = Object.assign({}, event || { type: 'UPDATED' }, { at: now() });
    localStorage.setItem(KEY, JSON.stringify(db));
    localStorage.setItem(EVENT_KEY, JSON.stringify(stamped));
    root.dispatchEvent(new CustomEvent('rutahema:changed', { detail: stamped }));
    return db;
  }

  function patient(db, id) { return db && db.pacientes && db.pacientes.find(p => p.code === id); }
  function appointment(db, id) {
    const p = patient(db, id); if (!p) return null;
    const citas = (db.citas || []).filter(c => c.pac === id && (!p.proximaCita || c.fecha === p.proximaCita));
    return citas.sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))[0] ||
      (p.proximaCita ? { fecha: p.proximaCita, hora: 'Por confirmar', tipo: 'Control de continuidad', estado: 'Programada' } : null);
  }
  function notify(db, id, text, source, type, payload) {
    db.novedades.unshift({ id: 'N-' + Date.now(), pac: id, text, source, at: now(), type: type || 'notice', payload: payload || {} });
  }
  function riskLevel(db, id) {
    const open = (db.alertas || []).filter(a => a.pac === id && !['Resuelta', 'Atendido'].includes(a.estado));
    if (open.some(a => a.nivel === 'Roja')) return 'Roja';
    if (open.some(a => a.nivel === 'Ámbar')) return 'Ámbar';
    return 'Verde';
  }

  const api = {
    key: KEY, read, ageBand, patient, appointment,
    patients() { const db = read(); return clone(db.pacientes || []); },
    patientState(id) {
      const db = read(), p = patient(db, id);
      return p ? { db, p: clone(p), appointment: clone(appointment(db, id)),
        novedades: clone((db.novedades || []).filter(n => n.pac === id)), riskLevel: riskLevel(db, id),
        latestSurvey: clone((db.encuestasAbandono || []).filter(s => s.pac === id).sort((a, b) => b.at.localeCompare(a.at))[0] || null) } : null;
    },
    reportBarrier(id, category, detail) {
      const db = read(), p = patient(db, id); if (!p) throw new Error('Paciente no encontrado');
      const label = category + (detail ? ': ' + detail : '');
      p.barreras = p.barreras ? p.barreras + ' | ' + label : label;
      p.estadoSeguimiento = p.estadoSeguimiento === 'Al día' ? 'En seguimiento' : p.estadoSeguimiento;
      db.alertas.unshift({ pac: id, tipo: 'Nueva solicitud del paciente', fecha: now().slice(0, 10), nivel: 'Ámbar', motivo: 'Reportado desde Mi Ruta Hema: ' + label, responsable: p.responsable || 'Equipo de continuidad', accion: 'Contactar a la familia y gestionar la barrera', estado: 'Pendiente', source: 'MI_RUTA_HEMA', category, status: 'pending' });
      notify(db, id, 'Recibimos tu solicitud de ayuda. El equipo podrá revisarla.', 'patient', 'BARRIER_CREATED', { category });
      write(db, { type: 'BARRIER_CREATED', patientId: id, category, status: 'pending' });
    },
    submitAmberSurvey(id, answers) {
      const db = read(), p = patient(db, id); if (!p) throw new Error('Paciente no encontrado');
      const record = { id: 'EA-' + Date.now(), pac: id, at: now(), answers: clone(answers), status: 'Pendiente de revisión' };
      db.encuestasAbandono.unshift(record);
      const selected = Object.entries(answers || {}).filter(([, value]) => value && value !== 'No').map(([key]) => key);
      db.alertas.unshift({ pac: id, tipo: 'Encuesta de continuidad completada', fecha: now().slice(0, 10), nivel: 'Ámbar', motivo: selected.length ? 'La familia reportó factores que requieren revisión: ' + selected.join(', ') : 'Encuesta completada sin nuevas barreras declaradas', responsable: p.responsable || 'Equipo de continuidad', accion: 'Revisar respuestas y contactar a la familia si corresponde', estado: 'Pendiente', source: 'MI_RUTA_HEMA' });
      notify(db, id, 'Gracias por completar la encuesta. El equipo revisará tus respuestas.', 'patient', 'AMBER_SURVEY_SUBMITTED', {});
      write(db, { type: 'AMBER_SURVEY_SUBMITTED', patientId: id });
      return clone(record);
    },
    saveParentalControls(id, controls) {
      const db = read(), p = patient(db, id); if (!p) throw new Error('Paciente no encontrado');
      p.parentalControls = Object.assign({}, p.parentalControls, controls, { updatedAt: now() });
      notify(db, id, 'El adulto responsable actualizó el control parental.', 'family', 'PARENTAL_CONTROLS_UPDATED', {});
      write(db, { type: 'PARENTAL_CONTROLS_UPDATED', patientId: id });
      return clone(p.parentalControls);
    },
    recordLearning(id, kind, itemId) {
      const db = read(), p = patient(db, id); if (!p) return;
      if (kind === 'video' && !p.learning.watchedVideos.includes(itemId)) p.learning.watchedVideos.push(itemId);
      if (kind === 'game') p.learning.gameSessions += 1;
      notify(db, id, kind === 'video' ? 'Video educativo visto en la bitácora.' : 'Juego educativo completado.', 'child', kind === 'video' ? 'VIDEO_COMPLETED' : 'GAME_COMPLETED', { itemId });
      write(db, { type: kind === 'video' ? 'VIDEO_COMPLETED' : 'GAME_COMPLETED', patientId: id, itemId });
    },
    purchaseAvatar(id, avatarId, cost, adultApproved) {
      const db = read(), p = patient(db, id); if (!p) throw new Error('Paciente no encontrado');
      if (p.ownedAvatars.includes(avatarId)) return clone(p);
      if (p.parentalControls.purchasesRequireApproval && !adultApproved) throw new Error('Se necesita aprobación del adulto responsable.');
      if (p.wallet.coins < cost) throw new Error('Aún no tienes suficientes monedas.');
      p.wallet.coins -= cost; p.wallet.spent += cost; p.ownedAvatars.push(avatarId); p.selectedAvatar = avatarId;
      notify(db, id, `Avatar desbloqueado con ${cost} monedas.`, 'child', 'AVATAR_UNLOCKED', { avatarId, cost });
      write(db, { type: 'AVATAR_UNLOCKED', patientId: id, avatarId, cost });
      return clone(p);
    },
    selectAvatar(id, avatarId) {
      const db = read(), p = patient(db, id); if (!p || !p.ownedAvatars.includes(avatarId)) return null;
      p.selectedAvatar = avatarId;
      write(db, { type: 'AVATAR_SELECTED', patientId: id, avatarId });
      return clone(p);
    },
    subscribe(fn) {
      const handler = event => fn(event);
      root.addEventListener('storage', handler); root.addEventListener('rutahema:changed', handler);
      return () => { root.removeEventListener('storage', handler); root.removeEventListener('rutahema:changed', handler); };
    }
  };

  root.RutaHemaData = api;
})(window);
