import ACCESS_ENUM from '@/access/accessEnum'

/**
 * Check permissions (determine if the current logged-in user has a specific permission)
 * @param loginUser Current logged-in user
 * @param needAccess Required permission
 * @return boolean Whether the user has the permission
 */
const checkAccess = (loginUser: any, needAccess = ACCESS_ENUM.NOT_LOGIN) => {
  // Get the current logged-in user's permission (if there is no loginUser, it means not logged in)
  const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN
  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    return true
  }
  // If user login is required for access
  if (needAccess === ACCESS_ENUM.USER) {
    // If the user is not logged in, it means no permission
    if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
      return false
    }
  }
  // If admin permission is required
  if (needAccess === ACCESS_ENUM.ADMIN) {
    // If not an admin, it means no permission
    if (loginUserAccess !== ACCESS_ENUM.ADMIN) {
      return false
    }
  }
  return true
}

export default checkAccess
