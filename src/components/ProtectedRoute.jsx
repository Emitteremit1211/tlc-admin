import React from 'react'
import { Navigate } from 'react-router-dom'
import { isLoggedIn } from '../lib/auth'

// Wraps any page that should only be visible to a logged-in admin.
// If there's no valid token, it redirects straight to /login.
export default function ProtectedRoute({ children }) {
    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />
    }
    return children
}