import React, { createContext, useContext, useState } from 'react';

/**
 * Contexto para compartir las películas entre componentes
 * Evita tener que hacer múltiples peticiones para acceder a los datos de películas
 */
const MoviesContext = createContext();

export const MoviesProvider = ({ children }) => {
    const [movies, setMovies] = useState([]);
    const [currentCity, setCurrentCity] = useState('Madrid');

    return (
        <MoviesContext.Provider value={{ movies, setMovies, currentCity, setCurrentCity }}>
            {children}
        </MoviesContext.Provider>
    );
};

export const useMoviesContext = () => {
    const context = useContext(MoviesContext);
    if (!context) {
        throw new Error('useMoviesContext debe usarse dentro de un MoviesProvider');
    }
    return context;
};

