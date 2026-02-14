import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DataAssistantPage from './pages/DataAssistantPage'
import MultiDatabasePage from './pages/MultiDatabasePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DataAssistantPage />} />
        <Route path="/databases" element={<MultiDatabasePage />} />
      </Routes>
    </BrowserRouter>
  )
}
