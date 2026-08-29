// NeuroNova Local Storage Persistence Helper
const STORAGE_KEYS = {
  PROFILE: 'neuronova_profile_v1',
  ROADMAP: 'neuronova_roadmap_v1',
  COMPLETED: 'neuronova_completed_v1',
  MESSAGES: 'neuronova_messages_v1',
  SECTION: 'neuronova_section_v1'
};

export const loadStoredProfile = (fallback) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const saveStoredProfile = (profile) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {}
};

export const loadStoredRoadmap = (fallback) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROADMAP);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const saveStoredRoadmap = (roadmap) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(roadmap));
  } catch (e) {}
};

export const loadStoredCompleted = (fallback) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const saveStoredCompleted = (completed) => {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPLETED, JSON.stringify(completed));
  } catch (e) {}
};

export const loadStoredMessages = (fallback) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const saveStoredMessages = (messages) => {
  try {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  } catch (e) {}
};

export const loadStoredSection = (fallback) => {
  try {
    return localStorage.getItem(STORAGE_KEYS.SECTION) || fallback;
  } catch (e) {
    return fallback;
  }
};

export const saveStoredSection = (section) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SECTION, section);
  } catch (e) {}
};
