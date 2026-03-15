import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';

export default function App() {
  return (
      <ScrollView contentContainerStyle={styles.container}>

        {/* Foto de perfil */}
        <Image
            source={{
              uri: 'https://www.unir.net/wp-content/uploads/claustro/jesus-perez-melero-5410535-12.webp',
            }}
            style={styles.avatar}
        />

        {/* Nombre */}
        <Text style={styles.nombre}>Jesús Pérez Melero</Text>

        {/* Puesto */}
        <Text style={styles.puesto}>Profesor · Desarrollador de Software</Text>

        {/* Separador */}
        <View style={styles.separador} />

        {/* Descripción */}
        <Text style={styles.descripcion}>
          Ingeniero de software con amplia experiencia en el desarrollo de
          aplicaciones móviles y web. Docente en el Máster de Ingeniería de
          Software y Sistemas Informáticos de UNIR, donde imparte asignaturas
          relacionadas con el desarrollo de aplicaciones móviles con React Native.
        </Text>

        {/* Enlace / institución */}
        <Text style={styles.institucion}>🎓 UNIR — La Universidad en Internet</Text>

      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#c8102e',
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
    textAlign: 'center',
    marginBottom: 6,
  },
  puesto: {
    fontSize: 15,
    color: '#c8102e',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  separador: {
    width: 60,
    height: 3,
    backgroundColor: '#c8102e',
    borderRadius: 2,
    marginBottom: 16,
  },
  descripcion: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    maxWidth: 340,
  },
  institucion: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});