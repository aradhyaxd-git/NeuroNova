import { useSyncExternalStore } from 'react';

let cached = null;

const detect = () => {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement('canvas');
    const attributes = { failIfMajorPerformanceCaveat: true };
    cached =
      canvas.getContext('webgl2', attributes) !== null ||
      canvas.getContext('webgl', attributes) !== null;
  } catch {
    cached = false;
  }
  return cached;
};

const subscribe = () => () => {};
const getSnapshot = () => detect();
const getServerSnapshot = () => null;

export const useWebGLSupport = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
