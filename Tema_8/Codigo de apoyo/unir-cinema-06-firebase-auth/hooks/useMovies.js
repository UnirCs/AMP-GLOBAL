import { useState, useEffect } from 'react';
import { moviesByCity } from '../data/moviesData';
import { useMoviesContext } from '../context/MoviesContext';

/**
 * Custom hook para manejar la lógica de películas por ciudad
 * En el futuro se conectará a una API real
 *
 * @param {string} initialCity - Ciudad inicial a mostrar
 * @returns {Object} Estado y funciones para manejar películas
 */
export const useMovies = (initialCity = 'Madrid') => {
    const { setMovies: setContextMovies, setCurrentCity: setContextCity } = useMoviesContext();
    const [currentCity, setCurrentCity] = useState(initialCity);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    // Simula la carga de películas (preparado para API futura)
    useEffect(() => {
        setLoading(true);

        // Simula un delay de red
        const timer = setTimeout(() => {
            const cityMovies = moviesByCity[currentCity] || [];
            setMovies(cityMovies);
            setContextMovies(cityMovies);
            setContextCity(currentCity);
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [currentCity, setContextMovies, setContextCity]);

    /**
     * Cambia a la ciudad anterior en el array
     */
    const goToPreviousCity = () => {
        const cities = Object.keys(moviesByCity);
        const currentIndex = cities.indexOf(currentCity);
        const previousIndex = currentIndex === 0 ? cities.length - 1 : currentIndex - 1;
        setCurrentCity(cities[previousIndex]);
    };

    /**
     * Cambia a la siguiente ciudad en el array
     */
    const goToNextCity = () => {
        const cities = Object.keys(moviesByCity);
        const currentIndex = cities.indexOf(currentCity);
        const nextIndex = (currentIndex + 1) % cities.length;
        setCurrentCity(cities[nextIndex]);
    };

    return {
        currentCity,
        movies,
        loading,
        goToPreviousCity,
        goToNextCity,
        setCurrentCity,
    };
};
/**
 * Datos simulados de películas por ciudad
 * En el futuro esto se reemplazará por llamadas a una API real
 */

export const cities = Object.keys(moviesByCity);
