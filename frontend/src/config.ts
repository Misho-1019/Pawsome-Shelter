// API Configuration
// Change these values for production deployment

export const config = {
  // Backend API URL
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',

  // Frontend URL (for email links)
  frontendUrl: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',

  // App info
  appName: 'Pawsome Shelter',
  contactEmail: 'info@pawsomeshelter.com',
  contactPhone: '(555) PAW-SOME',
}

// Helper to build API URLs
export function apiUrl(path: string): string {
  return `${config.apiBaseUrl}${path}`
}

// Helper to build frontend URLs
export function frontendUrl(path: string): string {
  return `${config.frontendUrl}${path}`
}
