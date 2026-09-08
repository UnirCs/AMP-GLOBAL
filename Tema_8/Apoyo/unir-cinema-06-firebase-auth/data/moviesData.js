/**
 * Datos simulados de películas por ciudad
 * En el futuro esto se reemplazará por llamadas a una API real
 */

// Función para generar sesiones aleatorias
const generateSessions = (count) => {
    const times = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'];
    const shuffled = times.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map((time, index) => ({
        id: index + 1,
        time
    })).sort((a, b) => a.time.localeCompare(b.time));
};

// Imagen placeholder base64 (pequeño icono de película)
const moviePlaceholder = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QBWRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAAITAAMAAAABAAEAAAAAAAAAAAEsAAAAAQAAASwAAAAB/+0ALFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAPHAFaAAMbJUccAQAAAgAEAP/hDIFodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0nYWRvYmU6bnM6bWV0YS8nIHg6eG1wdGs9J0ltYWdlOjpFeGlmVG9vbCAxMC4xMCc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczp0aWZmPSdodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyc+CiAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICA8dGlmZjpYUmVzb2x1dGlvbj4zMDAvMTwvdGlmZjpYUmVzb2x1dGlvbj4KICA8dGlmZjpZUmVzb2x1dGlvbj4zMDAvMTwvdGlmZjpZUmVzb2x1dGlvbj4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6eG1wTU09J2h0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8nPgogIDx4bXBNTTpEb2N1bWVudElEPmFkb2JlOmRvY2lkOnN0b2NrOjJiMzJlMDQ2LWQwNWQtNDVjNy1iNzJkLTYwNzQyOGI1ZGFjNTwveG1wTU06RG9jdW1lbnRJRD4KICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOjNjYTMzOTViLTMxMjQtNDM0YS04NjgxLTFmMTZiYWVjYTE2NzwveG1wTU06SW5zdGFuY2VJRD4KIDwvcmRmOkRlc2NyaXB0aW9uPgo8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSd3Jz8+/9sAQwAFAwQEBAMFBAQEBQUFBgcMCAcHBwcPCwsJDBEPEhIRDxERExYcFxMUGhURERghGBodHR8fHxMXIiQiHiQcHh8e/9sAQwEFBQUHBgcOCAgOHhQRFB4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4e/8AAEQgBaAEOAwERAAIRAQMRAf/EAB0AAQABBQEBAQAAAAAAAAAAAAAHAgQFBggDAQn/xABUEAABAwMDAgMFAwYICQgLAAABAAIDBAURBhIhBzETQVEIFCJhcRUygSNCUpGhwWJjcoKS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';

export const moviesByCity = {
    'Madrid': [
        {
            id: 1,
            title: 'Oppenheimer',
            genre: 'Drama histórico',
            rating: '8.5',
            year: '2023',
            director: 'Christopher Nolan',
            cast: 'Cillian Murphy, Emily Blunt, Matt Damon',
            synopsis: 'La historia del físico J. Robert Oppenheimer y su papel en el desarrollo de la bomba atómica durante la Segunda Guerra Mundial.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(5)
        },
        {
            id: 2,
            title: 'Barbie',
            genre: 'Comedia',
            rating: '7.8',
            year: '2023',
            director: 'Greta Gerwig',
            cast: 'Margot Robbie, Ryan Gosling, America Ferrera',
            synopsis: 'Barbie vive en Barbieland, pero cuando comienza a cuestionar su existencia perfecta, emprende un viaje al mundo real.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(6)
        },
        {
            id: 3,
            title: 'Dune: Part Two',
            genre: 'Ciencia ficción',
            rating: '9.0',
            year: '2024',
            director: 'Denis Villeneuve',
            cast: 'Timothée Chalamet, Zendaya, Rebecca Ferguson',
            synopsis: 'Paul Atreides se une a Chani y los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(7)
        },
        {
            id: 4,
            title: 'The Killer',
            genre: 'Thriller',
            rating: '7.5',
            year: '2023',
            director: 'David Fincher',
            cast: 'Michael Fassbender, Tilda Swinton',
            synopsis: 'Después de un fatídico error, un asesino a sueldo lucha contra sus empleadores y contra sí mismo en una cacería internacional.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(4)
        },
        {
            id: 5,
            title: 'Poor Things',
            genre: 'Comedia dramática',
            rating: '8.2',
            year: '2023',
            director: 'Yorgos Lanthimos',
            cast: 'Emma Stone, Mark Ruffalo, Willem Dafoe',
            synopsis: 'La increíble historia de Bella Baxter, una joven resucitada por un científico brillante y poco convencional.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(5)
        },
    ],
    'Barcelona': [
        {
            id: 6,
            title: 'The Zone of Interest',
            genre: 'Drama histórico',
            rating: '7.8',
            year: '2023',
            director: 'Jonathan Glazer',
            cast: 'Christian Friedel, Sandra Hüller',
            synopsis: 'El comandante de Auschwitz y su familia viven una vida idílica junto al campo de concentración.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(3)
        },
        {
            id: 7,
            title: 'Killers of the Flower Moon',
            genre: 'Drama criminal',
            rating: '8.3',
            year: '2023',
            director: 'Martin Scorsese',
            cast: 'Leonardo DiCaprio, Robert De Niro, Lily Gladstone',
            synopsis: 'Una serie de asesinatos en la comunidad Osage durante los años 20 lleva a una importante investigación del FBI.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(6)
        },
        {
            id: 8,
            title: 'The Holdovers',
            genre: 'Comedia dramática',
            rating: '8.1',
            year: '2023',
            director: 'Alexander Payne',
            cast: 'Paul Giamatti, Da\'Vine Joy Randolph',
            synopsis: 'Un profesor gruñón se queda en un internado durante las vacaciones de Navidad con un estudiante problemático.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(4)
        },
        {
            id: 9,
            title: 'Perfect Days',
            genre: 'Drama',
            rating: '8.0',
            year: '2023',
            director: 'Wim Wenders',
            cast: 'Kōji Yakusho, Tokio Emoto',
            synopsis: 'La vida contemplativa de un hombre que limpia baños públicos en Tokio y encuentra belleza en lo cotidiano.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(5)
        },
        {
            id: 10,
            title: 'Past Lives',
            genre: 'Romance',
            rating: '8.4',
            year: '2023',
            director: 'Celine Song',
            cast: 'Greta Lee, Teo Yoo, John Magaro',
            synopsis: 'Dos amigos de la infancia se reencuentran en Nueva York después de 24 años y exploran su conexión del pasado.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(7)
        },
    ],
    'Valencia': [
        {
            id: 11,
            title: 'Anatomy of a Fall',
            genre: 'Drama legal',
            rating: '8.2',
            year: '2023',
            director: 'Justine Triet',
            cast: 'Sandra Hüller, Swann Arlaud',
            synopsis: 'Una escritora es acusada del asesinato de su esposo, y el juicio revela secretos oscuros de su matrimonio.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(4)
        },
        {
            id: 12,
            title: 'The Boy and the Heron',
            genre: 'Animación',
            rating: '7.9',
            year: '2023',
            director: 'Hayao Miyazaki',
            cast: 'Soma Santoki, Masaki Suda',
            synopsis: 'Un joven entra en un mundo fantástico en busca de su madre, guiado por una misteriosa garza.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(6)
        },
        {
            id: 13,
            title: 'May December',
            genre: 'Drama',
            rating: '7.4',
            year: '2023',
            director: 'Todd Haynes',
            cast: 'Natalie Portman, Julianne Moore',
            synopsis: 'Una actriz viaja para conocer a la mujer cuya controvertida historia de amor interpretará en una película.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(3)
        },
        {
            id: 14,
            title: 'Society of the Snow',
            genre: 'Drama supervivencia',
            rating: '8.0',
            year: '2023',
            director: 'J.A. Bayona',
            cast: 'Enzo Vogrincic, Agustín Pardella',
            synopsis: 'La verdadera historia del equipo de rugby uruguayo que sobrevivió a un accidente aéreo en los Andes en 1972.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(5)
        },
        {
            id: 15,
            title: 'All of Us Strangers',
            genre: 'Drama romántico',
            rating: '7.8',
            year: '2023',
            director: 'Andrew Haigh',
            cast: 'Andrew Scott, Paul Mescal',
            synopsis: 'Un guionista solitario desarrolla una relación inesperada con un vecino misterioso mientras lidia con su pasado.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(4)
        },
    ],
    'Sevilla': [
        {
            id: 16,
            title: 'The Iron Claw',
            genre: 'Biografía',
            rating: '8.1',
            year: '2023',
            director: 'Sean Durkin',
            cast: 'Zac Efron, Jeremy Allen White',
            synopsis: 'La historia de la familia Von Erich, una dinastía de luchadores profesionales marcada por la tragedia.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(5)
        },
        {
            id: 17,
            title: 'Saltburn',
            genre: 'Thriller psicológico',
            rating: '7.2',
            year: '2023',
            director: 'Emerald Fennell',
            cast: 'Barry Keoghan, Jacob Elordi',
            synopsis: 'Un estudiante lucha por encajar en Oxford hasta que es invitado a la lujosa finca de un compañero aristocrático.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(6)
        },
        {
            id: 18,
            title: 'Maestro',
            genre: 'Biografía musical',
            rating: '7.5',
            year: '2023',
            director: 'Bradley Cooper',
            cast: 'Bradley Cooper, Carey Mulligan',
            synopsis: 'La vida y el amor del compositor Leonard Bernstein y su esposa Felicia Montealegre Cohn Bernstein.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(4)
        },
        {
            id: 19,
            title: 'Ferrari',
            genre: 'Biografía deportiva',
            rating: '6.9',
            year: '2023',
            director: 'Michael Mann',
            cast: 'Adam Driver, Penélope Cruz',
            synopsis: 'El verano de 1957, Enzo Ferrari enfrenta crisis en su matrimonio, su empresa y en la pista de carreras.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(3)
        },
        {
            id: 20,
            title: 'The Color Purple',
            genre: 'Drama musical',
            rating: '7.0',
            year: '2023',
            director: 'Blitz Bazawule',
            cast: 'Fantasia Barrino, Taraji P. Henson',
            synopsis: 'Décadas de vida de Celie, una mujer afroamericana sureña que supera circunstancias extraordinarias.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(7)
        },
    ],
    'Bilbao': [
        {
            id: 21,
            title: 'Challengers',
            genre: 'Romance deportivo',
            rating: '7.6',
            year: '2024',
            director: 'Luca Guadagnino',
            cast: 'Zendaya, Josh O\'Connor, Mike Faist',
            synopsis: 'Un triángulo amoroso entre una tenista prodigio y dos amigos que compiten por su afecto dentro y fuera de la cancha.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(5)
        },
        {
            id: 22,
            title: 'Civil War',
            genre: 'Acción distópica',
            rating: '7.3',
            year: '2024',
            director: 'Alex Garland',
            cast: 'Kirsten Dunst, Wagner Moura',
            synopsis: 'En un futuro cercano, un equipo de periodistas viaja a través de Estados Unidos durante una guerra civil.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(6)
        },
        {
            id: 23,
            title: 'Monkey Man',
            genre: 'Acción',
            rating: '7.2',
            year: '2024',
            director: 'Dev Patel',
            cast: 'Dev Patel, Sharlto Copley',
            synopsis: 'Un joven emerge de la prisión para vengar la muerte de su madre a manos de líderes corruptos.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(4)
        },
        {
            id: 24,
            title: 'Ghostbusters: Frozen Empire',
            genre: 'Comedia fantástica',
            rating: '6.5',
            year: '2024',
            director: 'Gil Kenan',
            cast: 'Paul Rudd, Carrie Coon',
            synopsis: 'La familia Spengler regresa a Nueva York para enfrentarse a una nueva amenaza sobrenatural.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(7)
        },
        {
            id: 25,
            title: 'Godzilla x Kong',
            genre: 'Acción MonsterVerse',
            rating: '6.8',
            year: '2024',
            director: 'Adam Wingard',
            cast: 'Rebecca Hall, Brian Tyree Henry',
            synopsis: 'Los dos titanes más poderosos del planeta se enfrentan en una batalla épica por la supremacía.',
            imageBase64: moviePlaceholder,
            sessions: generateSessions(5)
        },
    ],
};

export const cities = Object.keys(moviesByCity);
