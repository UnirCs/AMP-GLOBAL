# UNIR Cinema 05 Device

Aplicación móvil de ejemplo construida con Expo, React Native y expo-router para simular la compra de entradas de cine desde un dispositivo. El proyecto permite iniciar sesión, consultar películas por ciudad, ver sesiones, seleccionar asientos, generar tickets y compartirlos mediante funciones nativas del dispositivo.

## Características

- Login y registro de ejemplo.
- Navegación con drawer, tabs y stacks usando `expo-router`.
- Cartelera por ciudad con datos simulados.
- Detalle de película con sinopsis, reparto, director y sesiones disponibles.
- Selección de asientos por sesión, con estados disponible, ocupado, seleccionado y VIP.
- Compra simulada de entradas y almacenamiento temporal de tickets en contexto.
- Pantalla de tickets con acciones para QR, compartir imagen, crear evento en calendario y enviar recordatorio por SMS.
- Pantalla "Sobre nosotros" con enlace externo a LinkedIn.
- Estilos con NativeWind/Tailwind CSS.

## Requisitos

- Node.js y npm instalados.
- Expo CLI disponible mediante `npx` o instalado globalmente.
- Expo Go en un dispositivo físico, o un emulador Android/iOS configurado.

## Instalación

Desde la carpeta del proyecto:

```bash
cd "Tema_7/Codigo de apoyo/unir-cinema-05-device"
npm install
```

## Ejecución

Iniciar el servidor de desarrollo:

```bash
npm run start
```

Ejecutar directamente en una plataforma:

```bash
npm run android
npm run ios
npm run web
```

Al arrancar Expo, escanea el QR con Expo Go o abre la aplicación en el emulador correspondiente.

## Credenciales de prueba

El login está simulado en `components/LoginForm.js`. Para acceder a la cartelera usa:

```text
Usuario: user
Contraseña: user
```

El formulario de registro solo muestra la interfaz y registra los datos por consola; no crea usuarios reales.

## Flujo principal

1. La ruta inicial redirige a `/home`.
2. En `/home` se muestra el login o el formulario de registro.
3. Tras el login correcto se navega a la cartelera.
4. La cartelera permite cambiar de ciudad y seleccionar una película.
5. En el detalle de película se elige una sesión.
6. En la reserva se seleccionan asientos y se confirma la compra.
7. Los tickets comprados aparecen en la pestaña "Tickets".
8. Desde cada ticket se puede abrir un QR, compartir la entrada, añadir un evento al calendario o enviar un SMS.

## Estructura del proyecto

```text
app/                         Rutas de expo-router
app/home.jsx                 Pantalla inicial de login/registro
app/(drawer)/                Navegación lateral
app/(drawer)/(tabs)/         Navegación por pestañas
components/                  Componentes reutilizables
context/MoviesContext.js     Estado compartido de películas, ciudad y tickets
data/moviesData.js           Datos simulados de películas y sesiones
hooks/                       Hooks de cartelera y disponibilidad de asientos
views/HomeView.js            Vista principal de autenticación
assets/                      Iconos, logo, splash y fuentes
```

## Datos y estado

La aplicación no consume una API real. Las películas se cargan desde `data/moviesData.js` y la disponibilidad de asientos se simula en `hooks/useSessionDetails.js`.

Los tickets se guardan en memoria mediante `MoviesContext`, por lo que se pierden al recargar la aplicación o reiniciar Metro.

## Permisos del dispositivo

Algunas acciones solicitan permisos nativos:

- `expo-contacts` para leer contactos al compartir por SMS.
- `expo-sms` para enviar recordatorios.
- `expo-calendar` para crear eventos en el calendario.
- `expo-sharing` y `react-native-view-shot` para compartir una imagen del ticket.
- `expo-haptics` para feedback táctil.

En web o emuladores algunas funciones pueden no estar disponibles, especialmente SMS, contactos y compartir archivos.

## Scripts disponibles

```json
{
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web"
}
```

## Notas de desarrollo

- El proyecto usa Expo SDK 55, React 19 y React Native 0.83.
- La configuración de Metro integra NativeWind desde `global.css`.
- No hay tests automatizados configurados en `package.json`.
- La autenticación, compra y persistencia son simuladas para fines docentes.
