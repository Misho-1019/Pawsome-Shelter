// API Configuration
// Change these values for production deployment

export const config = {
  // Backend API URL — empty means use relative URLs (same-origin via Vite proxy in dev,
  // reverse proxy in production). Override with VITE_API_URL if needed.
  apiBaseUrl: import.meta.env.VITE_API_URL || '',

  // Frontend URL (for email links)
  frontendUrl: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',

  // App info
  appName: 'Pawsome Shelter',
  contactEmail: 'info@pawsomeshelter.com',
  contactPhone: '(555) PAW-SOME',
}

// Helper to build API URLs (under /api/v1)
export function apiUrl(path: string): string {
  return `${config.apiBaseUrl}/api/v1${path}`
}

// Helper to build frontend URLs
export function frontendUrl(path: string): string {
  return `${config.frontendUrl}${path}`
}
