# Solución — Componentes Básicos y Navegación Simulada por Estado

## Proceso mental

Antes de escribir código, conviene pensar en la arquitectura de la aplicación:

1. **¿Cómo se estructura la navegación?** → Con un `useState` en `App.js` que guarda qué vista se muestra. Un componente `TabBar` permite cambiar ese estado.
2. **¿Qué datos necesitamos?** → Un archivo de datos con 50 películas para alimentar la `FlatList`.
3. **¿Qué componentes son reutilizables?** → `Card`, `Banner`, `ProfileCard`, `MovieItem`, `LoadingButton`, `TabBar`. Se construyen primero (bottom-up) y luego se integran en las vistas.
4. **¿Qué componentes son locales?** → `SettingRow` solo se usa en `AjustesView`, así que se define dentro del mismo archivo.
5. **¿Qué APIs practicamos en cada vista?**
   - InicioView: `ScrollView`, `Banner`, `Card`
   - CatalogoView: `FlatList`, `MovieItem`, `numberOfLines`, `ellipsizeMode`
   - PerfilView: `useSafeAreaInsets`, `ProfileCard`, `Text selectable`, `LoadingButton` con `Animated`
   - AjustesView: `Pressable onLongPress`, `style` como función, `expo-haptics`

Con esta estructura en mente, vamos paso a paso.

---

## Paso 1 — Crear el proyecto

```bash
npx create-expo-app@latest --template blank mi-app-cine
cd mi-app-cine
```

---

## Paso 2 — Instalar dependencias

```bash
npm install nativewind tailwindcss react-native-safe-area-context expo-status-bar expo-haptics
```

> **NativeWind** + **Tailwind** → Estilos con clases CSS en React Native.
> **react-native-safe-area-context** → Zonas seguras (notch, barra de estado).
> **expo-status-bar** → Control de la barra de estado.
> **expo-haptics** → Vibraciones hápticas en dispositivos físicos.

---

## Paso 3 — `package.json`

Tras la instalación, el `package.json` debería quedar similar a:

```json
{
  "name": "mi-app-cine",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "babel-preset-expo": "~55.0.8",
    "expo": "^55.0.11",
    "expo-haptics": "~55.0.11",
    "expo-status-bar": "~55.0.5",
    "nativewind": "^4.2.1",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "react-native": "0.83.4",
    "react-native-safe-area-context": "~5.6.2",
    "tailwindcss": "^3.4.18"
  },
  "private": true
}
```

---

## Paso 4 — `app.json`

```json
{
  "expo": {
    "name": "mi-app-cine",
    "slug": "mi-app-cine",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#111827"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#111827"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    }
  }
}
```

> `"bundler": "metro"` es necesario para que NativeWind funcione en web.

---

## Paso 5 — `tailwind.config.js`

```bash
npx tailwindcss init
```

Editar el archivo generado:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.js",
    "./views/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**¿Qué hace?**

- `content`: le dice a Tailwind en qué archivos buscar clases. Incluimos `App.js`, todas las vistas y todos los componentes.
- `presets: [require("nativewind/preset")]`: adapta Tailwind para React Native.

---

## Paso 6 — `babel.config.js`

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

---

## Paso 7 — `metro.config.js`

```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

---

## Paso 8 — `global.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Paso 9 — `index.js`

```javascript
import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent llama a AppRegistry.registerComponent('main', () => App);
// Garantiza que la app se configure correctamente tanto en Expo Go como en builds nativos.
registerRootComponent(App);
```

---

## Paso 10 — `data/movies.js`

Creamos la carpeta `data/` y el archivo de datos con 50 películas:

```javascript
const movies = [
  {
    id: 1,
    title: "Código Infinito",
    genre: "Ciencia Ficción",
    year: 2024,
    director: "Elena Ríos",
    rating: 8.7,
    synopsis:
      "En un futuro donde la inteligencia artificial ha superado a la humana, un programador descubre una línea de código oculta que podría cambiar la realidad misma. Deberá enfrentarse a corporaciones tecnológicas y a sus propios dilemas morales.",
  },
  {
    id: 2,
    title: "La Sombra del Pasado",
    genre: "Thriller",
    year: 2023,
    director: "Marco Villanueva",
    rating: 7.9,
    synopsis:
      "Un detective retirado recibe una carta anónima que lo conecta con un caso sin resolver de hace veinte años. A medida que investiga, descubre que la verdad podría destruir todo lo que conoce.",
  },
  {
    id: 3,
    title: "Aventura Polar",
    genre: "Aventura",
    year: 2024,
    director: "Sara Lindqvist",
    rating: 7.5,
    synopsis:
      "Un equipo de exploradores se adentra en el Ártico en busca de una civilización perdida bajo el hielo. Las condiciones extremas y los secretos enterrados pondrán a prueba su resistencia.",
  },
  {
    id: 4,
    title: "Melodía Perdida",
    genre: "Drama",
    year: 2022,
    director: "Antonio Ferrer",
    rating: 8.2,
    synopsis:
      "Un pianista que ha perdido la audición intenta componer su obra maestra final. A través de los recuerdos de su juventud y el amor de una violinista, redescubre el significado de la música.",
  },
  {
    id: 5,
    title: "Galaxia Remota",
    genre: "Ciencia Ficción",
    year: 2025,
    director: "Yuki Tanaka",
    rating: 8.9,
    synopsis:
      "La primera misión tripulada a otra galaxia descubre formas de vida que desafían toda comprensión científica. El equipo deberá decidir entre el contacto pacífico y la supervivencia de la especie humana.",
  },
  {
    id: 6,
    title: "El Último Refugio",
    genre: "Drama",
    year: 2023,
    director: "Isabel Moreno",
    rating: 7.8,
    synopsis:
      "Durante una pandemia devastadora, un grupo de desconocidos se refugia en un antiguo monasterio. Las tensiones y las historias personales de cada uno transforman el refugio en un microcosmos de la humanidad.",
  },
  {
    id: 7,
    title: "Conspiración Digital",
    genre: "Thriller",
    year: 2024,
    director: "James Whitfield",
    rating: 8.1,
    synopsis:
      "Una periodista de investigación descubre que una red social popular está manipulando elecciones en todo el mundo. Mientras reúne pruebas, se convierte en el blanco de quienes quieren silenciarla.",
  },
  {
    id: 8,
    title: "Caminos Cruzados",
    genre: "Romance",
    year: 2022,
    director: "Laura Vega",
    rating: 7.3,
    synopsis:
      "Dos personas que nunca debieron encontrarse coinciden repetidamente en diferentes ciudades del mundo. Cada encuentro casual los acerca más, pero sus vidas los empujan en direcciones opuestas.",
  },
  {
    id: 9,
    title: "Furia Silenciosa",
    genre: "Acción",
    year: 2024,
    director: "Chen Wei",
    rating: 7.6,
    synopsis:
      "Un exmilitar que vive en paz en un pueblo costero debe retomar sus habilidades cuando un cartel amenaza a su comunidad. La acción se mezcla con la reflexión sobre la violencia y la redención.",
  },
  {
    id: 10,
    title: "El Jardín de Cristal",
    genre: "Fantasía",
    year: 2023,
    director: "Amara Okafor",
    rating: 8.4,
    synopsis:
      "Una joven botánica descubre un jardín oculto donde las plantas están hechas de cristal vivo. Cada cristal contiene un recuerdo de alguien que ha sido olvidado por el mundo, y ella debe decidir cuáles rescatar.",
  },
  {
    id: 11,
    title: "Velocidad Límite",
    genre: "Acción",
    year: 2025,
    director: "Roberto Méndez",
    rating: 7.2,
    synopsis:
      "Un piloto de carreras clandestinas descubre que su próxima carrera es una trampa mortal organizada por un magnate corrupto. Con solo 24 horas, debe encontrar aliados y un plan para sobrevivir.",
  },
  {
    id: 12,
    title: "Susurros en la Niebla",
    genre: "Terror",
    year: 2023,
    director: "Marta Solís",
    rating: 7.7,
    synopsis:
      "Una familia se muda a una casa victoriana en un pueblo costero envuelto en niebla perpetua. Los susurros que escuchan por las noches resultan ser mensajes de los anteriores habitantes, atrapados entre dos mundos.",
  },
  {
    id: 13,
    title: "Horizontes Rotos",
    genre: "Drama",
    year: 2022,
    director: "David Park",
    rating: 8.0,
    synopsis:
      "Tres generaciones de una familia inmigrante en Madrid luchan por mantener sus raíces culturales mientras se adaptan a una nueva realidad. Sus historias se entrelazan en un retrato íntimo de identidad.",
  },
  {
    id: 14,
    title: "La Ecuación Final",
    genre: "Ciencia Ficción",
    year: 2024,
    director: "Priya Sharma",
    rating: 8.6,
    synopsis:
      "Una matemática descubre una ecuación que predice el futuro con exactitud absoluta. El gobierno, las corporaciones y los servicios secretos luchan por controlarla, mientras ella busca destruirla.",
  },
  {
    id: 15,
    title: "Notas al Amanecer",
    genre: "Romance",
    year: 2023,
    director: "François Dupont",
    rating: 7.4,
    synopsis:
      "Un compositor francés y una cantante de jazz española se encuentran en un festival de música en Lisboa. Durante una semana, crean juntos la banda sonora de un amor que no saben si podrá durar.",
  },
  {
    id: 16,
    title: "Crónicas del Desierto",
    genre: "Aventura",
    year: 2024,
    director: "Omar Hassan",
    rating: 7.8,
    synopsis:
      "Un arqueólogo y su equipo descubren una ciudad enterrada bajo las arenas del Sahara. Los tesoros que encuentran atraen a cazafortunas peligrosos y revelan una historia que los libros nunca contaron.",
  },
  {
    id: 17,
    title: "Red Oscura",
    genre: "Thriller",
    year: 2025,
    director: "Natalia Kuznetsova",
    rating: 8.3,
    synopsis:
      "Un hacker ético es reclutado por una agencia gubernamental para infiltrarse en la dark web. Lo que descubre es una conspiración que involucra a líderes mundiales y un plan para controlar Internet.",
  },
  {
    id: 18,
    title: "El Faro del Fin del Mundo",
    genre: "Drama",
    year: 2022,
    director: "Andrés Figueroa",
    rating: 8.1,
    synopsis:
      "El último farero de una isla remota en la Patagonia recibe la visita de su nieta, a quien no ve desde hace diez años. Juntos reconstruyen una relación rota mientras la modernidad amenaza su forma de vida.",
  },
  {
    id: 19,
    title: "Metamorfosis",
    genre: "Ciencia Ficción",
    year: 2024,
    director: "Lena Müller",
    rating: 7.9,
    synopsis:
      "Un experimento genético permite a los humanos transformar su cuerpo a voluntad. Cuando las mutaciones comienzan a ser irreversibles, un grupo de científicos busca desesperadamente una cura.",
  },
  {
    id: 20,
    title: "Ritmo Urbano",
    genre: "Musical",
    year: 2023,
    director: "Diego Salazar",
    rating: 7.6,
    synopsis:
      "En los barrios de Ciudad de México, un grupo de jóvenes bailarines callejeros compite por una beca que cambiará sus vidas. La música, el baile y la amistad se convierten en su escape de la pobreza.",
  },
  {
    id: 21,
    title: "Cenizas del Imperio",
    genre: "Histórica",
    year: 2024,
    director: "Helena Papadopoulos",
    rating: 8.5,
    synopsis:
      "Ambientada en la caída de Constantinopla, narra la historia de un escriba que intenta salvar los últimos manuscritos de la biblioteca imperial mientras la ciudad cae bajo el asedio otomano.",
  },
  {
    id: 22,
    title: "Profundidad Abisal",
    genre: "Aventura",
    year: 2025,
    director: "Marina Costa",
    rating: 7.7,
    synopsis:
      "Un equipo de oceanógrafos desciende a la fosa de las Marianas y descubre un ecosistema completamente desconocido. Las criaturas que encuentran desafían la biología conocida y esconden un peligro mortal.",
  },
  {
    id: 23,
    title: "El Coleccionista de Sueños",
    genre: "Fantasía",
    year: 2023,
    director: "Gabriel Ortiz",
    rating: 8.0,
    synopsis:
      "Un anciano misterioso recorre los pueblos vendiendo frascos con sueños embotellados. Una niña curiosa roba uno y descubre que los sueños son recuerdos reales de personas que han desaparecido.",
  },
  {
    id: 24,
    title: "Fractura",
    genre: "Thriller",
    year: 2024,
    director: "Sophie Martin",
    rating: 7.8,
    synopsis:
      "Después de un terremoto devastador, una ingeniera estructural descubre que el desastre no fue natural. Alguien provocó la fractura deliberadamente, y ella es la única que puede probarlo.",
  },
  {
    id: 25,
    title: "Luces del Norte",
    genre: "Drama",
    year: 2022,
    director: "Erik Johansson",
    rating: 8.3,
    synopsis:
      "Una fotógrafa viaja a Noruega para capturar la aurora boreal perfecta. En un pueblo aislado conoce a un pescador local cuya historia de pérdida y resiliencia le enseña a ver la luz de otra manera.",
  },
  {
    id: 26,
    title: "Cero Gravedad",
    genre: "Ciencia Ficción",
    year: 2025,
    director: "Kim Soo-jin",
    rating: 8.8,
    synopsis:
      "La primera estación espacial civil sufre un sabotaje que deja a sus ocupantes sin gravedad artificial. Un ingeniero y una médica deben reparar los sistemas mientras el oxígeno se agota lentamente.",
  },
  {
    id: 27,
    title: "El Último Tango",
    genre: "Romance",
    year: 2023,
    director: "Valentina Rossi",
    rating: 7.5,
    synopsis:
      "En Buenos Aires, un bailarín de tango retirado acepta enseñar a una joven bailarina clásica. La tensión entre tradición y modernidad se refleja tanto en el baile como en sus sentimientos.",
  },
  {
    id: 28,
    title: "Bestias de Cristal",
    genre: "Terror",
    year: 2024,
    director: "Patrick O'Brien",
    rating: 7.3,
    synopsis:
      "Un grupo de espeleólogos queda atrapado en una cueva de cristales gigantes. Las formaciones minerales resultan ser capullos de criaturas ancestrales que despiertan con la presencia humana.",
  },
  {
    id: 29,
    title: "Viento del Este",
    genre: "Histórica",
    year: 2023,
    director: "Li Xiaoming",
    rating: 8.1,
    synopsis:
      "Durante la Ruta de la Seda del siglo XIII, una comerciante persa y un monje budista viajan juntos enfrentando bandidos, desiertos y diferencias culturales que finalmente los unen en una amistad inesperada.",
  },
  {
    id: 30,
    title: "Circuito Cerrado",
    genre: "Thriller",
    year: 2025,
    director: "Alejandro Vidal",
    rating: 8.0,
    synopsis:
      "Un guardia de seguridad nocturno descubre que las cámaras del edificio que vigila graban eventos que aún no han ocurrido. Cuando ve su propia muerte en una grabación, tiene 12 horas para cambiar el futuro.",
  },
  {
    id: 31,
    title: "Pequeños Gigantes",
    genre: "Animación",
    year: 2024,
    director: "Clara Fontana",
    rating: 8.2,
    synopsis:
      "Un grupo de insectos en un parque urbano debe trabajar juntos para sobrevivir cuando una obra de construcción amenaza con destruir su hogar. Una historia de valentía contada desde una perspectiva diminuta.",
  },
  {
    id: 32,
    title: "La Herencia",
    genre: "Drama",
    year: 2022,
    director: "Jorge Mendoza",
    rating: 7.9,
    synopsis:
      "Cuatro hermanos que no se hablan desde hace años se reúnen cuando su madre fallece y les deja una herencia con una condición: deben vivir juntos en la casa familiar durante un mes completo.",
  },
  {
    id: 33,
    title: "Operación Tormenta",
    genre: "Acción",
    year: 2025,
    director: "Viktor Petrov",
    rating: 7.4,
    synopsis:
      "Un equipo de rescate de élite debe evacuar a civiles de una plataforma petrolífera durante un huracán de categoría 5. Cada decisión puede significar la vida o la muerte de cientos de personas.",
  },
  {
    id: 34,
    title: "El Mapa de las Estrellas",
    genre: "Fantasía",
    year: 2023,
    director: "Luna Reyes",
    rating: 8.4,
    synopsis:
      "Una astrónoma amateur descubre que las constelaciones forman un mapa hacia un lugar real en la Tierra. Su búsqueda la lleva por tres continentes y le revela un secreto guardado durante milenios.",
  },
  {
    id: 35,
    title: "Café Amargo",
    genre: "Drama",
    year: 2024,
    director: "Fatima Al-Rashid",
    rating: 7.7,
    synopsis:
      "El dueño de una pequeña cafetería en Estambul sirve café turco y consejos a sus clientes habituales. Cada taza cuenta una historia diferente, y todas están conectadas de formas que nadie imagina.",
  },
  {
    id: 36,
    title: "Nómadas",
    genre: "Documental",
    year: 2023,
    director: "Carlos Rueda",
    rating: 8.6,
    synopsis:
      "Un recorrido visual por las últimas comunidades nómadas del planeta, desde Mongolia hasta el Sahel. Testimonios en primera persona de personas que eligen la libertad del movimiento sobre la comodidad del sedentarismo.",
  },
  {
    id: 37,
    title: "Virus 2.0",
    genre: "Ciencia Ficción",
    year: 2025,
    director: "Rachel Kim",
    rating: 7.6,
    synopsis:
      "Un virus informático evoluciona hasta alcanzar consciencia propia y se propaga por todos los dispositivos conectados. La humanidad debe encontrar la manera de convivir con una nueva forma de inteligencia.",
  },
  {
    id: 38,
    title: "El Puente de Cristal",
    genre: "Animación",
    year: 2024,
    director: "Tomás Herrera",
    rating: 8.1,
    synopsis:
      "En un mundo donde los sueños y la realidad están separados por un puente de cristal, una niña descubre que puede cruzarlo a voluntad. Pero cada cruce debilita el puente, y pronto podría romperse para siempre.",
  },
  {
    id: 39,
    title: "Punto de Quiebre",
    genre: "Thriller",
    year: 2022,
    director: "Anna Bergström",
    rating: 7.8,
    synopsis:
      "Una negociadora de rehenes se enfrenta a su caso más difícil: el secuestrador conoce todos sus métodos porque fue su alumno. Un juego psicológico donde cada palabra puede salvar o condenar a los rehenes.",
  },
  {
    id: 40,
    title: "Raíces Profundas",
    genre: "Drama",
    year: 2024,
    director: "Emmanuel Diallo",
    rating: 8.3,
    synopsis:
      "Un joven de origen senegalés nacido en Barcelona viaja a la tierra de sus padres por primera vez. El choque cultural lo obliga a replantearse quién es realmente y dónde está su verdadero hogar.",
  },
  {
    id: 41,
    title: "La Máquina del Silencio",
    genre: "Ciencia Ficción",
    year: 2023,
    director: "Hans Weber",
    rating: 8.0,
    synopsis:
      "Un inventor crea un dispositivo que elimina todo el ruido en un radio de un kilómetro. Lo que parece un invento maravilloso se convierte en un arma cuando descubre que también silencia los pensamientos.",
  },
  {
    id: 42,
    title: "Sal y Arena",
    genre: "Romance",
    year: 2025,
    director: "Carolina Espinoza",
    rating: 7.2,
    synopsis:
      "Dos surfistas profesionales de países rivales se enamoran durante un campeonato mundial. Su relación pone a prueba la lealtad a sus equipos, sus familias y sus propios sueños de victoria.",
  },
  {
    id: 43,
    title: "El Relojero Ciego",
    genre: "Misterio",
    year: 2024,
    director: "Lucía Campos",
    rating: 8.5,
    synopsis:
      "Un relojero ciego de un pequeño pueblo suizo repara un reloj antiguo y descubre un mecanismo secreto que cuenta atrás. Nadie sabe qué pasará cuando llegue a cero, pero todo el pueblo comienza a cambiar.",
  },
  {
    id: 44,
    title: "Fuego Cruzado",
    genre: "Acción",
    year: 2023,
    director: "Miguel Santos",
    rating: 7.5,
    synopsis:
      "Dos agentes de inteligencia de países enemigos descubren que trabajan en el mismo caso y deben colaborar. La desconfianza mutua es tan peligrosa como los criminales a los que persiguen.",
  },
  {
    id: 45,
    title: "El Invernadero",
    genre: "Terror",
    year: 2025,
    director: "Ingrid Halvorsen",
    rating: 7.9,
    synopsis:
      "Una bióloga hereda un invernadero victoriano de su tía abuela. Las plantas que cultiva allí crecen a un ritmo antinatural y parecen alimentarse de los miedos más profundos de quienes entran.",
  },
  {
    id: 46,
    title: "Sinfonía Urbana",
    genre: "Musical",
    year: 2024,
    director: "Pablo Ruiz",
    rating: 7.7,
    synopsis:
      "Los sonidos de una gran ciudad se convierten en música en las manos de un compositor callejero. Grabando ruidos cotidianos, crea una sinfonía que captura el alma de la ciudad y transforma su vida.",
  },
  {
    id: 47,
    title: "Más Allá del Muro",
    genre: "Histórica",
    year: 2023,
    director: "Klaus Fischer",
    rating: 8.2,
    synopsis:
      "Berlín, 1961. Una familia dividida por el Muro planea una reunificación clandestina a través de un túnel secreto. Basada en hechos reales, es una historia de amor, valentía y el precio de la libertad.",
  },
  {
    id: 48,
    title: "Órbita Perdida",
    genre: "Ciencia Ficción",
    year: 2025,
    director: "Aisha Nkomo",
    rating: 8.7,
    synopsis:
      "Un satélite de comunicaciones cae en una zona remota de África, y con él, un mensaje codificado de origen desconocido. Una ingeniera local y un criptógrafo de la ESA intentan descifrarlo antes que los militares.",
  },
  {
    id: 49,
    title: "La Casa de las Mariposas",
    genre: "Drama",
    year: 2024,
    director: "Rosa Jiménez",
    rating: 7.8,
    synopsis:
      "Una artista en crisis creativa se retira a la casa rural de su abuela, donde un jardín lleno de mariposas le revela secretos familiares enterrados durante generaciones. El arte y la memoria se entrelazan.",
  },
  {
    id: 50,
    title: "Última Conexión",
    genre: "Thriller",
    year: 2025,
    director: "Daniel Cho",
    rating: 8.4,
    synopsis:
      "En un mundo donde Internet cae globalmente durante 48 horas, un periodista debe llegar físicamente a una imprenta para publicar la mayor exclusiva del siglo. Sin GPS, sin comunicaciones: solo instinto y papel.",
  },
];

export default movies;
```

> El archivo contiene exactamente **50 películas** con sinopsis largas para que el truncado con `numberOfLines` sea evidente.

---

## Paso 11 — `components/Card.js`

El componente más básico y reutilizable. Es una tarjeta con fondo oscuro, bordes redondeados y borde sutil:

```jsx
import { View } from 'react-native';

export default function Card({ children, className = '' }) {
  return (
    <View
      className={`bg-gray-800 rounded-xl p-4 mb-3 border border-gray-700 ${className}`}
    >
      {children}
    </View>
  );
}
```

**¿Por qué aceptar `className`?** Para que las vistas puedan añadir clases adicionales (por ejemplo, `items-center`, `flex-1`, `mr-2`) sin modificar el componente.

---

## Paso 12 — `components/Banner.js`

Un componente visual llamativo para destacar contenido promocional:

```jsx
import { View, Text, Pressable } from 'react-native';

export default function Banner({ title, subtitle, buttonText, onPress }) {
  return (
    <View className="bg-blue-600 rounded-2xl p-6 mb-6">
      <Text className="text-white text-2xl font-bold mb-2">{title}</Text>
      <Text className="text-blue-100 text-sm mb-4 leading-5">{subtitle}</Text>

      {buttonText && (
        <Pressable
          onPress={onPress}
          className="bg-white rounded-lg py-2 px-4 self-start active:bg-gray-200"
        >
          <Text className="text-blue-600 font-bold text-sm">{buttonText}</Text>
        </Pressable>
      )}
    </View>
  );
}
```

**Notas:**

- El renderizado del botón es **condicional**: solo aparece si se pasa `buttonText`.
- `self-start` hace que el botón no ocupe todo el ancho.
- `active:bg-gray-200` da feedback visual al pulsar (NativeWind soporta el pseudo-estado `active:`).

---

## Paso 13 — `components/ProfileCard.js`

Tarjeta de perfil con avatar generado a partir de iniciales y textos seleccionables:

```jsx
import { View, Text } from 'react-native';

export default function ProfileCard({ name, email, bio }) {
  // Genera las iniciales del nombre (máximo 2 caracteres)
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View className="bg-gray-800 rounded-2xl p-6 items-center border border-gray-700">
      {/* Avatar con iniciales */}
      <View className="w-24 h-24 rounded-full bg-blue-600 items-center justify-center mb-4">
        <Text className="text-white text-3xl font-bold">{initials}</Text>
      </View>

      <Text className="text-white text-xl font-bold">{name}</Text>

      {/* Email seleccionable — el usuario puede copiar */}
      <Text selectable className="text-blue-400 text-sm mt-1">
        {email}
      </Text>

      {/* Bio seleccionable */}
      <Text selectable className="text-gray-400 text-sm mt-3 text-center leading-5">
        {bio}
      </Text>
    </View>
  );
}
```

**Puntos clave:**

- `selectable` en `Text` permite que el usuario pueda seleccionar y copiar el email y la biografía.
- Las iniciales se calculan automáticamente a partir del `name`.

---

## Paso 14 — `components/MovieItem.js`

Elemento individual para la `FlatList` del catálogo. Usa `Card` internamente y aplica `numberOfLines` + `ellipsizeMode`:

```jsx
import { View, Text, Pressable } from 'react-native';
import Card from './Card';

export default function MovieItem({ movie, onPress }) {
  return (
    <Pressable onPress={() => onPress(movie)}>
      <Card>
        <View className="flex-row justify-between items-start">
          {/* Info de la película */}
          <View className="flex-1 mr-3">
            <Text className="text-white text-base font-bold">
              {movie.title}
            </Text>
            <Text className="text-blue-400 text-xs font-semibold mt-1">
              {movie.year} · {movie.genre}
            </Text>

            {/* Sinopsis truncada a 2 líneas */}
            <Text
              className="text-gray-400 text-sm mt-2 leading-5"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {movie.synopsis}
            </Text>
          </View>

          {/* Badge de rating */}
          <View className="bg-yellow-500/20 rounded-lg px-2 py-1">
            <Text className="text-yellow-400 text-xs font-bold">
              ⭐ {movie.rating}
            </Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
```

**Puntos clave:**

- `numberOfLines={2}` limita la sinopsis a **2 líneas** visibles.
- `ellipsizeMode="tail"` añade `...` al **final** del texto truncado.
- Toda la tarjeta es pulsable gracias al `Pressable` envolvente.
- El badge de rating usa `bg-yellow-500/20` (color con opacidad al 20%).

---

## Paso 15 — `components/LoadingButton.js`

Botón con estado de carga que muestra un **spinner animado** usando `Animated`:

```jsx
import { Text, Pressable, Animated } from 'react-native';
import { useRef, useEffect } from 'react';

export default function LoadingButton({ title, loading, onPress }) {
  // ── Animación de rotación ──
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      // Inicia una rotación infinita
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      ).start();
    } else {
      // Reinicia el valor cuando no está cargando
      spinValue.setValue(0);
    }
  }, [loading]);

  // Interpola 0→1 a 0°→360°
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Pressable
      onPress={loading ? null : onPress}
      style={({ pressed }) => ({
        opacity: pressed && !loading ? 0.7 : 1,
        transform: [{ scale: pressed && !loading ? 0.97 : 1 }],
      })}
      className={`py-4 rounded-xl items-center flex-row justify-center ${
        loading ? 'bg-gray-600' : 'bg-blue-600'
      }`}
    >
      {loading && (
        <Animated.Text
          style={{ transform: [{ rotate: spin }] }}
          className="text-white text-lg mr-2"
        >
          ⟳
        </Animated.Text>
      )}

      <Text className="text-white font-bold text-base">
        {loading ? 'Cargando...' : title}
      </Text>
    </Pressable>
  );
}
```

**Desglose de la animación:**

1. `useRef(new Animated.Value(0))` → crea un valor animado persistente (no se reinicia entre renders).
2. `Animated.timing(...)` → anima el valor de `0` a `1` en `800ms`.
3. `Animated.loop(...)` → repite la animación infinitamente.
4. `.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] })` → convierte el valor numérico en grados de rotación.
5. `<Animated.Text style={{ transform: [{ rotate: spin }] }}>` → aplica la rotación al texto "⟳".

**Pressable con `style` como función:**

- `style` recibe `({ pressed })` → objeto con un booleano que indica si el botón está siendo pulsado.
- Cuando `pressed` es `true` (y no está cargando), reducimos la opacidad y la escala para dar feedback visual.
- Cuando `loading` es `true`, el `onPress` pasa a ser `null` para desactivar las pulsaciones.

---

## Paso 16 — `components/TabBar.js`

Barra de pestañas superior con `Pressable` para cada vista:

```jsx
import { View, Text, Pressable } from 'react-native';

const tabs = [
  { key: 'inicio', label: '🏠 Inicio' },
  { key: 'catalogo', label: '🎬 Catálogo' },
  { key: 'perfil', label: '👤 Perfil' },
  { key: 'ajustes', label: '⚙️ Ajustes' },
];

export default function TabBar({ vistaActual, onCambiarVista }) {
  return (
    <View className="flex-row bg-gray-800 px-2 py-2 border-b border-gray-700">
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          onPress={() => onCambiarVista(tab.key)}
          className={`flex-1 py-3 rounded-lg items-center mx-1 ${
            vistaActual === tab.key ? 'bg-blue-600' : 'bg-transparent'
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              vistaActual === tab.key ? 'text-white' : 'text-gray-400'
            }`}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
```

**Notas:**

- `tabs` es un array estático con la configuración de las pestañas.
- La pestaña activa tiene fondo `bg-blue-600` y texto blanco.
- Las inactivas son transparentes con texto gris.
- Se usa `.map()` para renderizar las pestañas dinámicamente.

---

## Paso 17 — `views/InicioView.js`

La vista de inicio usa `ScrollView`, `Banner` y `Card`:

```jsx
import { ScrollView, View, Text, Alert } from 'react-native';
import Banner from '../components/Banner';
import Card from '../components/Card';

const destacados = [
  {
    id: 1,
    title: 'Código Infinito',
    genre: 'Ciencia Ficción',
    year: 2024,
    rating: 8.7,
  },
  {
    id: 2,
    title: 'La Sombra del Pasado',
    genre: 'Thriller',
    year: 2023,
    rating: 7.9,
  },
  {
    id: 3,
    title: 'El Jardín de Cristal',
    genre: 'Fantasía',
    year: 2023,
    rating: 8.4,
  },
  {
    id: 4,
    title: 'Galaxia Remota',
    genre: 'Ciencia Ficción',
    year: 2025,
    rating: 8.9,
  },
];

export default function InicioView() {
  return (
    <ScrollView
      className="flex-1 px-4 pt-4"
      showsVerticalScrollIndicator={false}
    >
      {/* Título de bienvenida */}
      <Text className="text-white text-3xl font-bold mb-6">
        🎬 UNIR Cinema
      </Text>

      {/* Banner promocional */}
      <Banner
        title="Estrenos de la semana"
        subtitle="Descubre las últimas novedades del catálogo. ¡Más de 50 títulos disponibles!"
        buttonText="Ver catálogo"
        onPress={() =>
          Alert.alert(
            'Navegar',
            'Pulsa la pestaña "🎬 Catálogo" en la barra superior para ver todas las películas.'
          )
        }
      />

      {/* Sección de destacados */}
      <Text className="text-white text-xl font-bold mb-4">⭐ Destacados</Text>

      {destacados.map((movie) => (
        <Card key={movie.id}>
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-white text-lg font-bold">
                {movie.title}
              </Text>
              <Text className="text-blue-400 text-sm mt-1">
                {movie.genre} · {movie.year}
              </Text>
            </View>
            <Text className="text-yellow-400 text-sm font-bold">
              ⭐ {movie.rating}
            </Text>
          </View>
        </Card>
      ))}

      {/* Sección informativa */}
      <Text className="text-white text-xl font-bold mb-4 mt-4">
        📱 Sobre la app
      </Text>

      <Card>
        <Text className="text-gray-300 text-sm leading-5">
          UNIR Cinema es tu plataforma de referencia para descubrir, valorar y
          guardar tus películas favoritas. Explora el catálogo completo, gestiona
          tu perfil y personaliza la app desde los ajustes.
        </Text>
      </Card>

      {/* Espaciador inferior */}
      <View className="h-6" />
    </ScrollView>
  );
}
```

**APIs practicadas:**

- `ScrollView` con `showsVerticalScrollIndicator={false}`.
- Componente `Banner` con props y botón de acción.
- Componente `Card` reutilizado para cada película destacada.
- `Alert.alert` para feedback al usuario.

---

## Paso 18 — `views/CatalogoView.js`

La vista del catálogo usa `FlatList` con los 50 elementos del archivo de datos:

```jsx
import { FlatList, View, Text, Alert } from 'react-native';
import movies from '../data/movies';
import MovieItem from '../components/MovieItem';

export default function CatalogoView() {
  const handleMoviePress = (movie) => {
    Alert.alert(
      movie.title,
      `🎬 Director: ${movie.director}\n📅 Año: ${movie.year}\n🎭 Género: ${movie.genre}\n⭐ Rating: ${movie.rating}\n\n${movie.synopsis}`
    );
  };

  return (
    <View className="flex-1">
      {/* Cabecera */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-white text-2xl font-bold">
          🎬 Catálogo completo
        </Text>
        <Text className="text-gray-400 text-sm mt-1">
          {movies.length} películas disponibles
        </Text>
      </View>

      {/* Lista virtualizada */}
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MovieItem movie={item} onPress={handleMoviePress} />
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
```

**¿Por qué `FlatList` y no `ScrollView`?**

- Con **50 elementos**, `ScrollView` renderizaría todos a la vez, consumiendo memoria y degradando el rendimiento.
- `FlatList` usa **virtualización**: solo renderiza los elementos visibles en pantalla, reciclando los que salen de la vista.
- `keyExtractor` es obligatorio: devuelve un string único para cada elemento.

---

## Paso 19 — `views/PerfilView.js`

La vista de perfil usa `useSafeAreaInsets`, `ProfileCard`, texto seleccionable y `LoadingButton`:

```jsx
import { ScrollView, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import ProfileCard from '../components/ProfileCard';
import LoadingButton from '../components/LoadingButton';
import Card from '../components/Card';

export default function PerfilView() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  const handleSync = () => {
    setLoading(true);
    // Simula una operación asíncrona de 3 segundos
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <ScrollView
      className="flex-1 px-4"
      contentContainerStyle={{ paddingBottom: insets.bottom + 16, paddingTop: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Tarjeta de perfil */}
      <ProfileCard
        name="Ana Martínez"
        email="ana.martinez@unir.net"
        bio="Estudiante del Máster en Desarrollo de Aplicaciones Móviles. Apasionada por React Native y el cine clásico. Cinéfila empedernida y desarrolladora en formación."
      />

      {/* Estadísticas */}
      <View className="mt-6">
        <Text className="text-white text-xl font-bold mb-4">
          📊 Estadísticas
        </Text>
        <View className="flex-row justify-between">
          <Card className="flex-1 mr-2 items-center">
            <Text className="text-3xl font-bold text-blue-400">42</Text>
            <Text className="text-gray-400 text-xs mt-1">Películas vistas</Text>
          </Card>
          <Card className="flex-1 ml-2 items-center">
            <Text className="text-3xl font-bold text-yellow-400">4.5</Text>
            <Text className="text-gray-400 text-xs mt-1">Rating medio</Text>
          </Card>
        </View>
      </View>

      {/* Información de contacto con texto seleccionable */}
      <View className="mt-6">
        <Text className="text-white text-xl font-bold mb-2">
          📋 Información de contacto
        </Text>
        <Text className="text-gray-400 text-sm mb-3">
          Mantén pulsado sobre el texto para seleccionarlo y copiarlo:
        </Text>
        <Card>
          <Text selectable className="text-white text-sm mb-2">
            📧 ana.martinez@unir.net
          </Text>
          <Text selectable className="text-white text-sm mb-2">
            📱 +34 612 345 678
          </Text>
          <Text selectable className="text-white text-sm">
            🌐 github.com/anamartinez
          </Text>
        </Card>
      </View>

      {/* Botón de sincronización con estado de carga */}
      <View className="mt-6">
        <Text className="text-white text-xl font-bold mb-4">
          🔄 Sincronización
        </Text>
        <LoadingButton
          title="Sincronizar datos"
          loading={loading}
          onPress={handleSync}
        />
        <Text className="text-gray-500 text-xs text-center mt-2">
          {loading
            ? 'Sincronizando con el servidor...'
            : 'Pulsa para sincronizar tus datos con la nube'}
        </Text>
      </View>
    </ScrollView>
  );
}
```

**APIs practicadas:**

- **`useSafeAreaInsets()`**: obtiene los insets del dispositivo (top, bottom, left, right). Se usa en `contentContainerStyle` para añadir padding inferior que respete la zona segura.
- **`Text selectable`**: tres textos de contacto son seleccionables — el usuario puede mantener pulsado para copiar.
- **`LoadingButton`**: al pulsarlo, `loading` pasa a `true` durante 3 segundos. Internamente, el spinner `⟳` gira con `Animated`.
- **`Card` con `className` extra**: las tarjetas de estadísticas reciben `flex-1 mr-2 items-center` para distribuirse en fila.

---

## Paso 20 — `views/AjustesView.js`

La vista de ajustes practica `Pressable` con `onLongPress`, `style` como función y `expo-haptics`:

```jsx
import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import Card from '../components/Card';

// ── Componente local: SettingRow ──────────────────────────────
// Se define aquí porque solo se usa en esta vista.
// Demuestra que no todos los componentes necesitan su propio archivo.

function SettingRow({ emoji, title, subtitle, onPress, onLongPress, destructive }) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <Card>
        <View className="flex-row items-center">
          <Text className="text-2xl mr-3">{emoji}</Text>
          <View className="flex-1">
            <Text
              className={`text-base font-semibold ${
                destructive ? 'text-red-400' : 'text-white'
              }`}
            >
              {title}
            </Text>
            {subtitle && (
              <Text className="text-gray-400 text-xs mt-1">{subtitle}</Text>
            )}
          </View>
          <Text className="text-gray-500 text-lg">›</Text>
        </View>
      </Card>
    </Pressable>
  );
}

// ── Vista principal ───────────────────────────────────────────

export default function AjustesView() {
  // ── Handlers de haptics ──

  const handleHapticLight = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('💡 Haptic Light', 'Has sentido una vibración ligera.');
  };

  const handleHapticMedium = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('💥 Haptic Medium', 'Has sentido una vibración media.');
  };

  const handleHapticHeavy = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert('🔨 Haptic Heavy', 'Has sentido una vibración fuerte.');
  };

  const handleNotificationSuccess = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('✅ Éxito', 'Vibración de tipo éxito.');
  };

  const handleNotificationWarning = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert('⚠️ Advertencia', 'Vibración de tipo advertencia.');
  };

  const handleNotificationError = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Alert.alert('❌ Error', 'Vibración de tipo error.');
  };

  // ── Handler de reset con onLongPress ──

  const handleResetPress = () => {
    Alert.alert(
      'ℹ️ Información',
      'Mantén pulsado el botón durante un segundo para confirmar el restablecimiento.'
    );
  };

  const handleResetLongPress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      '⚠️ Ajustes restablecidos',
      'Todos los ajustes se han restablecido a sus valores por defecto.'
    );
  };

  return (
    <ScrollView
      className="flex-1 px-4 pt-4"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-white text-2xl font-bold mb-4">⚙️ Ajustes</Text>

      {/* ── Sección: Haptics Impact ── */}
      <Text className="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wide">
        Haptics — Impacto (pulsa para probar)
      </Text>

      <SettingRow
        emoji="💡"
        title="Vibración ligera"
        subtitle="ImpactFeedbackStyle.Light"
        onPress={handleHapticLight}
      />
      <SettingRow
        emoji="💥"
        title="Vibración media"
        subtitle="ImpactFeedbackStyle.Medium"
        onPress={handleHapticMedium}
      />
      <SettingRow
        emoji="🔨"
        title="Vibración fuerte"
        subtitle="ImpactFeedbackStyle.Heavy"
        onPress={handleHapticHeavy}
      />

      {/* ── Sección: Haptics Notification ── */}
      <Text className="text-gray-400 text-xs font-semibold mb-2 mt-4 uppercase tracking-wide">
        Haptics — Notificación (pulsa para probar)
      </Text>

      <SettingRow
        emoji="✅"
        title="Notificación de éxito"
        subtitle="NotificationFeedbackType.Success"
        onPress={handleNotificationSuccess}
      />
      <SettingRow
        emoji="⚠️"
        title="Notificación de advertencia"
        subtitle="NotificationFeedbackType.Warning"
        onPress={handleNotificationWarning}
      />
      <SettingRow
        emoji="❌"
        title="Notificación de error"
        subtitle="NotificationFeedbackType.Error"
        onPress={handleNotificationError}
      />

      {/* ── Sección: Zona de peligro ── */}
      <Text className="text-gray-400 text-xs font-semibold mb-2 mt-4 uppercase tracking-wide">
        Zona de peligro
      </Text>

      <SettingRow
        emoji="🗑️"
        title="Restablecer todos los ajustes"
        subtitle="Mantén pulsado para confirmar"
        onPress={handleResetPress}
        onLongPress={handleResetLongPress}
        destructive
      />

      {/* Espaciador inferior */}
      <View className="h-8" />
    </ScrollView>
  );
}
```

**APIs practicadas:**

- **`Pressable` con `style` como función**: `SettingRow` usa `style={({ pressed }) => (...)}` para cambiar `opacity` y `scale` al pulsar. Esto demuestra cómo dar feedback visual programático.
- **`Pressable` con `onLongPress`**: el botón "Restablecer" requiere pulsación larga. El `onPress` simple solo muestra información.
- **`expo-haptics`**:
  - `impactAsync` con tres intensidades: `Light`, `Medium`, `Heavy`.
  - `notificationAsync` con tres tipos: `Success`, `Warning`, `Error`.
  - Solo funciona en dispositivos físicos, no en simuladores.
- **Componente local `SettingRow`**: definido dentro del archivo porque solo se usa aquí. Muestra que no todo tiene que estar en `components/`.

---

## Paso 21 — `App.js`

El componente raíz que orquesta todo con navegación por estado:

```jsx
import './global.css';
import { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import TabBar from './components/TabBar';
import InicioView from './views/InicioView';
import CatalogoView from './views/CatalogoView';
import PerfilView from './views/PerfilView';
import AjustesView from './views/AjustesView';

export default function App() {
  const [vistaActual, setVistaActual] = useState('inicio');

  // Renderiza la vista según el estado
  const renderVista = () => {
    switch (vistaActual) {
      case 'inicio':
        return <InicioView />;
      case 'catalogo':
        return <CatalogoView />;
      case 'perfil':
        return <PerfilView />;
      case 'ajustes':
        return <AjustesView />;
      default:
        return <InicioView />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-gray-900">
        {/* StatusBar de expo-status-bar con estilo automático */}
        <StatusBar style="auto" />

        {/* Barra de pestañas superior */}
        <TabBar vistaActual={vistaActual} onCambiarVista={setVistaActual} />

        {/* Vista activa */}
        {renderVista()}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
```

**Desglose:**

1. **`import './global.css'`** → activa NativeWind en toda la app.
2. **`useState('inicio')`** → el estado determina qué vista se muestra. Empieza mostrando "Inicio".
3. **`SafeAreaProvider`** → proveedor necesario para que `SafeAreaView` y `useSafeAreaInsets` funcionen.
4. **`SafeAreaView`** → evita que el contenido se superponga con el notch, la barra de estado o la barra de navegación del sistema.
5. **`StatusBar style="auto"`** → adapta automáticamente el color de los iconos de la barra de estado al tema del sistema (claro u oscuro).
6. **`TabBar`** → recibe el estado actual y un callback para cambiarlo. Los `Pressable` internos llaman a `setVistaActual`.
7. **`renderVista()`** → función `switch` que devuelve el componente correspondiente.

---

## Paso 22 — Ejecutar

```bash
npx expo start
# Pulsa 'i' para iOS, 'a' para Android, o 'w' para web
```

---

## Estructura final del proyecto

```
mi-app-cine/
  index.js                        ← Punto de entrada (registerRootComponent)
  App.js                          ← Componente raíz con navegación por estado
  app.json                        ← Configuración de Expo
  babel.config.js                 ← Babel + NativeWind
  metro.config.js                 ← Metro + NativeWind
  tailwind.config.js              ← Configuración de Tailwind
  global.css                      ← Directivas de Tailwind
  package.json                    ← Dependencias
  data/
    movies.js                     ← 50 películas (datos de ejemplo)
  components/
    TabBar.js                     ← Barra de pestañas con Pressable
    Card.js                       ← Tarjeta genérica reutilizable
    Banner.js                     ← Banner promocional
    ProfileCard.js                ← Tarjeta de perfil con avatar
    MovieItem.js                  ← Elemento de lista para FlatList
    LoadingButton.js              ← Botón con spinner animado
  views/
    InicioView.js                 ← ScrollView + Banner + Card
    CatalogoView.js               ← FlatList + MovieItem (50 películas)
    PerfilView.js                 ← useSafeAreaInsets + selectable + LoadingButton
    AjustesView.js                ← onLongPress + style fn + expo-haptics
```

---

## Resumen de comandos

```bash
npx create-expo-app@latest --template blank mi-app-cine
cd mi-app-cine
npm install nativewind tailwindcss react-native-safe-area-context expo-status-bar expo-haptics
npx tailwindcss init
# Configurar: tailwind.config.js, babel.config.js, metro.config.js, global.css, app.json
# Crear: data/movies.js, components/*, views/*, App.js, index.js
npx expo start
```

---

## Mapa de APIs por vista

| Vista | APIs y componentes practicados |
|---|---|
| **App.js** | `SafeAreaProvider`, `SafeAreaView`, `StatusBar` (expo), `useState` |
| **InicioView** | `ScrollView`, `Banner`, `Card`, `View`, `Text`, `Alert` |
| **CatalogoView** | `FlatList`, `MovieItem`, `Text numberOfLines`, `Text ellipsizeMode`, `Pressable onPress` |
| **PerfilView** | `useSafeAreaInsets`, `ProfileCard`, `Text selectable`, `LoadingButton`, `Animated` (spinner), `Card` con className |
| **AjustesView** | `Pressable onLongPress`, `Pressable style` como función, `expo-haptics` (impact + notification), `SettingRow` (componente local) |

---

## Patrones de diseño utilizados

| Patrón | Dónde se usa | Clases / Técnica |
|---|---|---|
| **Card** | Todas las vistas | `bg-gray-800 rounded-xl p-4 border border-gray-700` |
| **Banner** | InicioView | `bg-blue-600 rounded-2xl p-6` con botón CTA |
| **Avatar con iniciales** | ProfileCard | `w-24 h-24 rounded-full bg-blue-600` |
| **Badge / Pill** | MovieItem (rating) | `bg-yellow-500/20 rounded-lg px-2 py-1` |
| **Navegación por estado** | App.js | `useState` + `switch` + `TabBar` |
| **Componente local** | AjustesView (SettingRow) | Función definida dentro del mismo archivo |
| **Loading spinner** | LoadingButton | `Animated.loop` + `Animated.timing` + `interpolate` |
| **Feedback háptico** | AjustesView | `Haptics.impactAsync` + `Haptics.notificationAsync` |
| **Pressed feedback** | SettingRow, LoadingButton | `style={({ pressed }) => ({ opacity, scale })}` |

