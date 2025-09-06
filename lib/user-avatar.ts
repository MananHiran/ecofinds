import { generateUserAvatar } from './avatar-generator';

/**
 * Get user avatar - either their profile picture or a generated avatar
 * @param user - User object with username and optional profilePic
 * @returns Avatar URL (either profilePic or generated avatar)
 */
export function getUserAvatar(user: { username: string; profilePic?: string | null }): string {
  if (user.profilePic) {
    return user.profilePic;
  }
  
  // Generate avatar if no profile picture
  return generateUserAvatar(user.username);
}

/**
 * Get user avatar with fallback to generated avatar
 * @param username - Username for avatar generation
 * @param profilePic - Optional profile picture URL
 * @returns Avatar URL
 */
export function getUserAvatarWithFallback(username: string, profilePic?: string | null): string {
  if (profilePic) {
    return profilePic;
  }
  
  return generateUserAvatar(username);
}
