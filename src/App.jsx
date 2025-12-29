import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './components/authContext.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import RegisterDetailsPage from './pages/RegisterDetailsPage.jsx'
import './App.css'

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/details" element={<RegisterDetailsPage />} />


          <Route path="/home" element={<HomePage />} />
          {/* <Route path="todos" element={<TodosPage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="albums" element={<AlbumsPage />} />
          <Route path="albums/:albumId/photos" element={<AlbumPhotosPage />} /> */}



          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App
