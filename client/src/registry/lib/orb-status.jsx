const STATUS_TEXT = {
  idle: 'Idle',
  connecting: 'Connecting',
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking',
  error: 'Error',
  disabled: 'Muted',
};

export const OrbStatus = ({ state, className }) => (
  <span role="status" aria-live="polite" aria-atomic="true" className={className}>
    {STATUS_TEXT[state] || state}
  </span>
);
