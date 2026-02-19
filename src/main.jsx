import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FavoriteProvider } from './context/FavoriteContext';
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router";
import PokemonDetails from './screens/pokemonDetails.jsx';

createRoot(document.getElementById('root')).render(
<FavoriteProvider>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/pokemonDetails/:url" element={<PokemonDetails />} />
            <Route path="/pokemon/:id" element={<PokemonDetails />} />
        </Routes>
    </BrowserRouter>
</FavoriteProvider>
)
