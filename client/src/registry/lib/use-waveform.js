import { useEffect, useRef, useState } from 'react';
import {
  acquireSharedAnalyser,
  classifyAudioError,
  releaseSharedAnalyser,
} from './use-audio-level';

const EMPTY = new Uint8Array(0);

export const useWaveform = (active) => {
  const samplesRef = useRef(EMPTY);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!active) {
      samplesRef.current = EMPTY;
      return;
    }

    let cancelled = false;
    let raf = 0;

    void acquireSharedAnalyser().then(
      (analyser) => {
        if (cancelled) return;
        setError(null);
        const data = new Uint8Array(analyser.fftSize);

        const tick = () => {
          analyser.getByteTimeDomainData(data);
          samplesRef.current = data;
          raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
      },
      (err) => {
        if (cancelled) return;
        setError(classifyAudioError(err));
        samplesRef.current = EMPTY;
      },
    );

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      releaseSharedAnalyser();
      samplesRef.current = EMPTY;
    };
  }, [active]);

  return { samplesRef, error };
};
