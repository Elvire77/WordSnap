import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CapturePage from './pages/CapturePage'
import CollectionPage from './pages/CollectionPage'
import WordDetailPage from './pages/WordDetailPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/capture" element={<CapturePage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/word/:id" element={<WordDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
