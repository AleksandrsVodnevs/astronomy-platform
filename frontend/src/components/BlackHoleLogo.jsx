const BlackHoleLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Accretion disk - outer glow */}
    <ellipse cx="50" cy="50" rx="46" ry="14" fill="none" stroke="#4f8ef7" strokeWidth="2" opacity="0.3"/>
    <ellipse cx="50" cy="50" rx="42" ry="11" fill="none" stroke="#7c9ef5" strokeWidth="1.5" opacity="0.5"/>
    {/* Accretion disk - bright part */}
    <ellipse cx="50" cy="50" rx="38" ry="8" fill="none" stroke="#a0b8ff" strokeWidth="3" opacity="0.7"/>
    {/* Event horizon shadow */}
    <circle cx="50" cy="50" r="22" fill="#0a0e1a"/>
    <circle cx="50" cy="50" r="22" fill="none" stroke="#4f8ef7" strokeWidth="1" opacity="0.4"/>
    {/* Black hole center */}
    <circle cx="50" cy="50" r="18" fill="#050810"/>
    {/* Photon ring */}
    <circle cx="50" cy="50" r="19" fill="none" stroke="#6b8ef5" strokeWidth="1.5" opacity="0.8"/>
    {/* Disk overlay - front part covers bottom of black hole */}
    <ellipse cx="50" cy="50" rx="38" ry="8" fill="none" stroke="#c0d0ff" strokeWidth="2.5" strokeDasharray="120 240" strokeDashoffset="60" opacity="0.9"/>
  </svg>
);

export default BlackHoleLogo;
