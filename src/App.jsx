import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Blogs from './pages/Blogs'
import CreateBlog from './pages/CreateBlog'
import EditBlog from './pages/EditBlog'

import ProtectedRoute from './components/ProtectedRoute'
import DeleteBlog from './pages/DeleteBlog'

function App() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/blogs"
        element={
          <ProtectedRoute>
            <Blogs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/blogs/create"
        element={
          <ProtectedRoute>
            <CreateBlog />
          </ProtectedRoute>
        }
      />

      <Route
        path="/blogs/edit/:id"
        element={
          <ProtectedRoute>
            <EditBlog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blogs/edit/:id"
        element={
          <ProtectedRoute>
            <DeleteBlog />
          </ProtectedRoute>
        }
      />

    </Routes>
  )
}

export default App