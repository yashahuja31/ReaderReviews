// Temporary storage for users during registration process
// In production, use a database or Redis for this

const tempUsers = new Map();

// Store temporary user data with expiration
export const storeTempUser = (email, userData) => {
  const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes expiration
  tempUsers.set(email, { ...userData, expiresAt });
};

// Get temporary user data
export const getTempUser = (email) => {
  const userData = tempUsers.get(email);
  
  if (!userData) {
    return null;
  }
  
  if (Date.now() > userData.expiresAt) {
    tempUsers.delete(email);
    return null;
  }
  
  return userData;
};

// Remove temporary user data
export const removeTempUser = (email) => {
  tempUsers.delete(email);
};

// Clean up expired temporary users (can be called periodically)
export const cleanupExpiredTempUsers = () => {
  const now = Date.now();
  for (const [email, userData] of tempUsers.entries()) {
    if (now > userData.expiresAt) {
      tempUsers.delete(email);
    }
  }
};