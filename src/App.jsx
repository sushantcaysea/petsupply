import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import SmoothScroll from './components/SmoothScroll'
import Benefits from './pages/Benefits'
import Contact from './pages/Contact'
import Gallery from './pages/Gallery'
import Home from './pages/Home'
import Process from './pages/Process'
import Products from './pages/Products'
import Story from './pages/Story'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="story" element={<Story />} />
            <Route path="benefits" element={<Benefits />} />
            <Route path="products" element={<Products />} />
            <Route path="process" element={<Process />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </SmoothScroll>
    </BrowserRouter>
  )
}
