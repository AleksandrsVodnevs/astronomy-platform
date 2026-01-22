import { AVATAR_BASE } from '../services/api';
import './Avatar.css';

const Avatar = ({ user, size = 40, onClick }) => {
  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : '?';

  const style = { width: size, height: size, fontSize: size * 0.38, cursor: onClick ? 'pointer' : 'default' };

  if (user?.avatar) {
    return (
      <img
        src={`${AVATAR_BASE}${user.avatar}`}
        alt={initials}
        className="avatar-img"
        style={{ ...style, borderRadius: '50%', objectFit: 'cover' }}
        onClick={onClick}
      />
    );
  }

  // Generate consistent color from name
  const colors = ['#4f8ef7','#7c3aed','#059669','#d97706','#dc2626','#0891b2','#be185d'];
  const colorIndex = ((user?.firstName?.charCodeAt(0) || 65) + (user?.lastName?.charCodeAt(0) || 65)) % colors.length;
  const bg = colors[colorIndex];

  return (
    <div
      className="avatar-initials"
      style={{ ...style, background: bg, borderRadius: '50%' }}
      onClick={onClick}
    >
      {initials}
    </div>
  );
};

export default Avatar;
