export const getAvatar = (name: string) => {
  // Using 'adventurer' style for character avatars
  return `https://api.dicebear.com/6.x/personas/svg?seed=${encodeURIComponent(
    name
  )}`;
};
