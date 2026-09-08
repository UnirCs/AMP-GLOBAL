import { useState, useEffect } from 'react';

/**
 * Custom hook para obtener los detalles de disponibilidad de asientos de una sesión
 * @param {number} sessionId - ID de la sesión
 * @returns {Object} - { seatsAvailability, loading, error }
 */
export const useSessionDetails = (sessionId) => {
    const [seatsAvailability, setSeatsAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSessionDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                // Simular una llamada HTTP con un delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Generar datos simulados de disponibilidad de asientos
                // 0 = libre, 1 = ocupado
                const mockSeatsAvailability = [
                    [0, 1, 0, 0, 1, 0], // Fila 1: 6 asientos
                    [1, 0, 0, 1, 0, 0, 1, 0], // Fila 2: 8 asientos
                    [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0], // Fila 3: 12 asientos
                    [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0], // Fila 4: 14 asientos
                    [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0], // Fila 5: 14 asientos
                    [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1], // Fila 6: 14 asientos
                    [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0], // Fila 7: 14 asientos
                    [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0], // Fila 8: 14 asientos
                    [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0], // Fila 9: 14 asientos
                    [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0], // Fila 10: 14 asientos
                    [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1], // Fila 11: 14 asientos
                    [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0], // Fila 12: 14 asientos
                    [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0], // Fila 13: 14 asientos VIP
                    [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0], // Fila 14: 16 asientos
                    [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1], // Fila 15: 16 asientos
                ];

                setSeatsAvailability(mockSeatsAvailability);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (sessionId) {
            fetchSessionDetails();
        }
    }, [sessionId]);

    return { seatsAvailability, loading, error };
};

