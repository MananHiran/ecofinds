/**
 * Generate a simple avatar with user initials
 * @param username - The username to generate initials from
 * @param size - The size of the avatar (default: 200)
 * @returns Base64 encoded SVG avatar
 */
export function generateAvatar(username: string, size: number = 200): string {
  // Get initials from username
  const initials = username
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

  // Generate a consistent color based on username
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];
  
  const colorIndex = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const backgroundColor = colors[colorIndex];
  
  // Generate text color (white or black based on background brightness)
  const rgb = parseInt(backgroundColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const textColor = brightness > 128 ? '#000000' : '#FFFFFF';

  // Create SVG
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}" rx="${size/8}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size/3}" 
            font-weight="bold" text-anchor="middle" dominant-baseline="central" 
            fill="${textColor}">${initials}</text>
    </svg>
  `.trim();

  // Convert to base64
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Generate avatar for a user and return the base64 data URL
 * @param username - The username to generate avatar for
 * @returns Base64 encoded SVG avatar data URL
 */
export function generateUserAvatar(username: string): string {
  return generateAvatar(username, 200);
}
