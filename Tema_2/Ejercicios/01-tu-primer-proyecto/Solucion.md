# Solución — Ejercicio 01: Verificación del entorno local

---

## Paso 1 — Crear el proyecto

Abre una terminal y ejecuta:

```bash
npx create-expo-app@latest --template blank mi-primera-app
```

Con el flag `--template blank` el proyecto se crea directamente con la plantilla en blanco (JavaScript) sin pasar por el asistente interactivo de selección de template.

Una vez creado el proyecto, entra en la carpeta:

```bash
cd mi-primera-app
```

La estructura inicial del proyecto será algo así:

```
mi-primera-app/
  App.js
  app.json
  index.js
  package.json
  assets/
    adaptive-icon.png
    favicon.png
    icon.png
    splash-icon.png
```

---

## Paso 2 — Arrancar el servidor de desarrollo

Ejecuta el siguiente comando desde la raíz del proyecto:

```bash
npx expo start
```

Verás en la terminal una pantalla similar a esta:

```
Starting project at /ruta/a/mi-primera-app
...
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
```

---

## Paso 3 — Lanzar el simulador

### Opción A — Simulador iOS (macOS)

Asegúrate de tener **Xcode** instalado. Una vez instalado, ábrelo al menos una vez y descarga los simuladores de iPhone desde *Xcode → Settings → Platforms*. Sin este paso, los simuladores no estarán disponibles. Luego, en la terminal donde corre Expo, pulsa:

```
i
```

Se abrirá automáticamente el simulador de iPhone con la aplicación cargada.

### Opción B — Emulador Android

Asegúrate de tener **Android Studio** instalado y un **AVD (Android Virtual Device)** creado y en ejecución desde el AVD Manager. Luego, en la terminal donde corre Expo, pulsa:

```
a
```

---

## Paso 4 — Modificar el App.js

A continuación se muestra un ejemplo de `App.js` personalizado con la tarjeta de presentación de **Jesús Pérez Melero**, profesor de la asignatura:

```jsx
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
```

### ¿Qué hace cada parte?

| Elemento | Componente | Qué hace |
|---|---|---|
| Foto de perfil | `Image` | Carga la imagen desde una URL pública y la muestra redondeada |
| Nombre | `Text` | Muestra el nombre en texto grande y en negrita |
| Puesto | `Text` | Muestra el rol con color corporativo de UNIR |
| Separador | `View` | Una línea decorativa con `height: 3` |
| Descripción | `Text` | Texto largo con `lineHeight` para mejor legibilidad |
| Institución | `Text` | Nota final con estilo en cursiva |
| Contenedor | `ScrollView` | Permite hacer scroll si el contenido es mayor que la pantalla |

---

## Resultado esperado

La pantalla del simulador debería mostrar algo similar a esto:

```
┌──────────────────────────────────┐
│                                  │
│          [ Foto circular ]       │
│                                  │
│      Jesús Pérez Melero          │
│  Profesor · Desarrollador de     │
│           Software               │
│           ─────                  │
│  Ingeniero de software con...    │
│                                  │
│  🎓 UNIR — La Universidad en     │
│            Internet              │
│                                  │
└──────────────────────────────────┘
```

---

## Resumen de comandos ejecutados

```bash
# 1. Crear el proyecto
npx create-expo-app@latest --template blank mi-primera-app

# 2. Entrar en la carpeta
cd mi-primera-app

# 3. Arrancar el servidor de desarrollo
npx expo start

# 4. (En la terminal de Expo)
#    Pulsar 'i' para iOS o 'a' para Android
```
