# Solución — CV Online con React Native WebView

---

## Paso 1 — Crear la SPA del CV con React y React Router

Crea un nuevo proyecto de React:

```bash
npx create-react-app mi-cv-spa
cd mi-cv-spa
```

Instala React Router:

```bash
npm install react-router-dom
```

### Estructura de archivos resultante

```
mi-cv-spa/
  src/
    App.jsx
    components/
      Navbar.jsx
    views/
      Home.jsx
      Educacion.jsx
      Experiencia.jsx
  public/
    index.html
```

---

### `src/App.jsx`

Punto de entrada de la SPA con las rutas definidas:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './views/Home';
import Educacion from './views/Educacion';
import Experiencia from './views/Experiencia';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/educacion" element={<Educacion />} />
        <Route path="/experiencia" element={<Experiencia />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

### `src/components/Navbar.jsx`

Barra de navegación persistente entre vistas:

```jsx
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/educacion', label: 'Educación' },
  { to: '/experiencia', label: 'Experiencia' },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav style={styles.nav}>
      {links.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          style={{
            ...styles.link,
            ...(pathname === to ? styles.active : {}),
          }}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    padding: '12px 24px',
    backgroundColor: '#c8102e',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '15px',
    opacity: 0.8,
  },
  active: {
    opacity: 1,
    borderBottom: '2px solid #fff',
    paddingBottom: '2px',
  },
};
```

---

### `src/views/Home.jsx`

Vista principal con foto, nombre, puesto y resumen:

```jsx
export default function Home() {
  return (
    <div style={styles.container}>
      <img
        src="https://www.unir.net/wp-content/uploads/claustro/jesus-perez-melero-5410535-12.webp"
        alt="Foto de perfil"
        style={styles.avatar}
      />
      <h1 style={styles.nombre}>Jesús Pérez Melero</h1>
      <p style={styles.puesto}>Profesor · Desarrollador de Software</p>
      <div style={styles.separador} />
      <p style={styles.resumen}>
        Ingeniero de software con amplia experiencia en el desarrollo de
        aplicaciones móviles y web. Docente en el Máster de Ingeniería de
        Software y Sistemas Informáticos de UNIR, donde imparte asignaturas
        relacionadas con el desarrollo de aplicaciones móviles con React Native.
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '24px',
    textAlign: 'center',
    fontFamily: 'sans-serif',
  },
  avatar: {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #c8102e',
    marginBottom: '16px',
  },
  nombre: {
    fontSize: '28px',
    color: '#1a1a2e',
    margin: '0 0 8px',
  },
  puesto: {
    fontSize: '16px',
    color: '#c8102e',
    fontWeight: '600',
    margin: '0 0 16px',
  },
  separador: {
    width: '60px',
    height: '3px',
    backgroundColor: '#c8102e',
    borderRadius: '2px',
    margin: '0 auto 16px',
  },
  resumen: {
    fontSize: '15px',
    color: '#444',
    lineHeight: '1.6',
  },
};
```

---

### `src/views/Educacion.jsx`

Vista con la formación académica:

```jsx
const formacion = [
  {
    titulo: 'Máster en Ingeniería del Software',
    centro: 'Universidad Politécnica de Madrid',
    año: '2010',
  },
  {
    titulo: 'Grado en Ingeniería Informática',
    centro: 'Universidad Complutense de Madrid',
    año: '2008',
  },
];

export default function Educacion() {
  return (
    <div style={styles.container}>
      <h2 style={styles.titulo}>🎓 Educación</h2>
      {formacion.map((item, i) => (
        <div key={i} style={styles.card}>
          <h3 style={styles.cardTitulo}>{item.titulo}</h3>
          <p style={styles.cardSub}>{item.centro}</p>
          <span style={styles.año}>{item.año}</span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '24px',
    fontFamily: 'sans-serif',
  },
  titulo: {
    fontSize: '24px',
    color: '#1a1a2e',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #eee',
    borderLeft: '4px solid #c8102e',
    borderRadius: '8px',
    padding: '16px 20px',
    marginBottom: '16px',
  },
  cardTitulo: {
    margin: '0 0 4px',
    fontSize: '17px',
    color: '#1a1a2e',
  },
  cardSub: {
    margin: '0 0 8px',
    color: '#666',
    fontSize: '14px',
  },
  año: {
    fontSize: '13px',
    color: '#c8102e',
    fontWeight: '600',
  },
};
```

---

### `src/views/Experiencia.jsx`

Vista con la experiencia profesional:

```jsx
const experiencia = [
  {
    puesto: 'Profesor Asociado — Desarrollo de Apps Móviles',
    empresa: 'UNIR — La Universidad en Internet',
    periodo: '2020 – Actualidad',
    descripcion:
      'Impartición de asignaturas de React Native en el Máster de Ingeniería de Software.',
  },
  {
    puesto: 'Senior Frontend Developer',
    empresa: 'Tech Company S.L.',
    periodo: '2015 – 2020',
    descripcion:
      'Desarrollo de aplicaciones web y móviles con React y React Native para clientes internacionales.',
  },
];

export default function Experiencia() {
  return (
    <div style={styles.container}>
      <h2 style={styles.titulo}>💼 Experiencia Profesional</h2>
      {experiencia.map((item, i) => (
        <div key={i} style={styles.card}>
          <h3 style={styles.puesto}>{item.puesto}</h3>
          <p style={styles.empresa}>{item.empresa}</p>
          <span style={styles.periodo}>{item.periodo}</span>
          <p style={styles.descripcion}>{item.descripcion}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '24px',
    fontFamily: 'sans-serif',
  },
  titulo: {
    fontSize: '24px',
    color: '#1a1a2e',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #eee',
    borderLeft: '4px solid #c8102e',
    borderRadius: '8px',
    padding: '16px 20px',
    marginBottom: '16px',
  },
  puesto: {
    margin: '0 0 4px',
    fontSize: '17px',
    color: '#1a1a2e',
  },
  empresa: {
    margin: '0 0 4px',
    color: '#666',
    fontSize: '14px',
  },
  periodo: {
    fontSize: '13px',
    color: '#c8102e',
    fontWeight: '600',
  },
  descripcion: {
    marginTop: '8px',
    fontSize: '14px',
    color: '#555',
    lineHeight: '1.5',
  },
};
```

---

## Paso 2 — Desplegar en Vercel

1. Inicializa un repositorio Git y sube el proyecto a GitHub:

```bash
git init
git add .
git commit -m "feat: CV online con React Router"
git remote add origin https://github.com/tu-usuario/mi-cv-spa.git
git push -u origin main
```

2. Ve a [https://vercel.com](https://vercel.com), inicia sesión con GitHub e importa el repositorio.
3. Vercel detectará automáticamente el proyecto de React. Haz clic en **Deploy**.
4. En unos segundos dispondrás de una URL pública, por ejemplo: `https://mi-cv-spa.vercel.app`

---

## Paso 3 — Crear el proyecto React Native WebView

```bash
npx create-expo-app@latest --template blank mi-cv-webview
cd mi-cv-webview
npx expo install react-native-webview react-native-safe-area-context
```

---

## Paso 4 — Versión básica sin navegación asistida

Crea o modifica `AppSinNavegacion.js`:

```jsx
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

export default function AppSinNavegacion() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <WebView source={{ uri: 'https://mi-cv-spa.vercel.app' }} />
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

---

## Paso 5 — Versión con navegación asistida

Crea `AppConNavegacion.js`:

```jsx
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { useRef, useState } from 'react';

export default function AppConNavegacion() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const handleNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://mi-cv-spa.vercel.app' }}
          onNavigationStateChange={handleNavigationStateChange}
          style={styles.webView}
        />

        <View style={styles.navigationBar}>
          <Pressable
            onPress={() => canGoBack && webViewRef.current.goBack()}
            style={[styles.button, !canGoBack && styles.buttonDisabled]}
            disabled={!canGoBack}
          >
            <Text style={[styles.buttonText, !canGoBack && styles.buttonTextDisabled]}>
              ← Atrás
            </Text>
          </Pressable>

          <Pressable
            onPress={() => webViewRef.current?.reload()}
            style={styles.button}
          >
            <Text style={styles.buttonText}>⟳ Recargar</Text>
          </Pressable>

          <Pressable
            onPress={() => canGoForward && webViewRef.current.goForward()}
            style={[styles.button, !canGoForward && styles.buttonDisabled]}
            disabled={!canGoForward}
          >
            <Text style={[styles.buttonText, !canGoForward && styles.buttonTextDisabled]}>
              Adelante →
            </Text>
          </Pressable>
        </View>

        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webView: { flex: 1 },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#c8102e',
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  buttonTextDisabled: { color: '#999' },
});
```

---

## Paso 6 — Registrar los componentes en `index.js`

```js
import { registerRootComponent } from 'expo';

import AppSinNavegacion from './AppSinNavegacion';
import AppConNavegacion from './AppConNavegacion';

// Cambia entre uno y otro según lo que quieras probar
registerRootComponent(AppConNavegacion);
```

---

## Paso 7 — Ejecutar en el simulador

```bash
npx expo start
# Pulsa 'i' para iOS o 'a' para Android
```

---

## Resumen de comandos ejecutados

```bash
# SPA React
npx create-react-app mi-cv-spa
cd mi-cv-spa
npm install react-router-dom
# ... editar archivos ...
git init && git add . && git commit -m "feat: CV online"
git push -u origin main
# Desplegar en vercel.com

# App React Native
npx create-expo-app@latest --template blank mi-cv-webview
cd mi-cv-webview
npx expo install react-native-webview react-native-safe-area-context
npx expo start
```
