import { Navigate } from 'react-router-dom'

// Registration is now handled by admins creating accounts directly
// Redirect to login page
export function RegisterPage() {
  return <Navigate to="/login" replace />
}
