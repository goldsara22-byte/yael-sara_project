import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './components/AuthContext.jsx'
import HomePage from './components/pages/HomePage.jsx'
import LoginPage from './components/pages/LoginPage.jsx' 
import RegisterPage from './components/pages/RegisterPage.jsx'
import RegisterDetailsPage from './components/pages/RegisterDetailsPage.jsx'
import './App.css'
import InfoPage from './components/header/info.jsx'
import TodosPage from './components/pages/TodosPage.jsx'
import PostsPage from './components/pages/PostsPage.jsx'
import AlbumsPage from './components/pages/AlbumsPage.jsx'
import AlbumPhotosPage from './components/pages/AlbumPhotosPage.jsx'

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/details" element={<RegisterDetailsPage />} />

          <Route path="/home/*" element={<HomePage />}>
            <Route path="todos" element={<TodosPage />} />
            <Route path="posts" element={<PostsPage />} />
            <Route path="albums" element={<AlbumsPage />} />
            <Route path="albums/:albumId" element={<AlbumPhotosPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App