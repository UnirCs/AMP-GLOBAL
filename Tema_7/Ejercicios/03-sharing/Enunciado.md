# Ejercicio 3 — Compartir tarjeta de receta como imagen (RecetApp)

## Objetivo

Ampliar **RecetApp** para que el usuario pueda **compartir una receta como imagen** (tarjeta visual) usando la hoja de compartir nativa del dispositivo. Se generará una "tarjeta de receta" visual en la app, se capturará como imagen y se compartirá mediante el sistema de compartir nativo (WhatsApp, Telegram, email, AirDrop, etc.).

Se practicarán los módulos **expo-sharing**, **react-native-view-shot** y **expo-file-system**.

---

## Conceptos previos

### expo-sharing

Abre la hoja de compartir nativa del sistema operativo, permitiendo enviar archivos (imágenes, PDFs, etc.) a cualquier app instalada.

```jsx
import * as Sharing from 'expo-sharing';

// Verificar disponibilidad
const isAvailable = await Sharing.isAvailableAsync();

// Compartir un archivo
if (isAvailable) {
    await Sharing.shareAsync(fileUri, {
        mimeType: 'image/png',
        dialogTitle: 'Compartir receta',
        UTI: 'public.png', // Uniform Type Identifier (iOS)
    });
}
```

**Funciones principales:**

| Función | Descripción |
|---|---|
| `isAvailableAsync()` | Devuelve `true` si el dispositivo soporta la API de compartir |
| `shareAsync(url, options?)` | Abre la hoja de compartir nativa con el archivo especificado |

**Opciones de `shareAsync`:**

| Opción | Tipo | Descripción |
|---|---|---|
| `mimeType` | `string` | Tipo MIME del archivo (`'image/png'`, `'application/pdf'`, etc.) |
| `dialogTitle` | `string` | Título del diálogo de compartir (solo Android) |
| `UTI` | `string` | Uniform Type Identifier para iOS (`'public.png'`, `'public.jpeg'`) |

> ⚠️ `shareAsync` requiere una **URI de archivo local** (no una URL remota). El archivo debe existir en el sistema de archivos del dispositivo.

> 📖 [expo-sharing — Documentación](https://docs.expo.dev/versions/latest/sdk/sharing/)

### react-native-view-shot

Captura cualquier componente React Native como imagen (screenshot de un `View`).

```jsx
import ViewShot from 'react-native-view-shot';
import { useRef } from 'react';

const viewRef = useRef();

// En el JSX:
<ViewShot ref={viewRef} options={{ format: 'png', quality: 1.0 }}>
    <View>
        {/* Contenido que se capturará como imagen */}
    </View>
</ViewShot>

// Para capturar:
const uri = await viewRef.current.capture();
// uri → 'file:///path/to/captured-image.png'
```

**Props de `ViewShot`:**

| Prop | Tipo | Descripción |
|---|---|---|
| `ref` | `ref` | Referencia para llamar a `.capture()` |
| `options.format` | `string` | Formato de imagen: `'png'`, `'jpg'`, `'webm'` |
| `options.quality` | `number` | Calidad de la imagen (0 a 1). Solo para jpg |
| `options.width` | `number` | Ancho forzado de la captura |
| `options.height` | `number` | Alto forzado de la captura |

> 📖 [react-native-view-shot — GitHub](https://github.com/gre/react-native-view-shot)

### expo-file-system (referencia)

Aunque no es estrictamente necesario para este ejercicio (ya que `ViewShot` devuelve una URI local), `expo-file-system` es útil para operaciones avanzadas con archivos.

> 📖 [expo-file-system — Documentación](https://docs.expo.dev/versions/latest/sdk/filesystem/)

---

## Parte 1 — Instalar dependencias adicionales

```bash
npm install expo-sharing react-native-view-shot expo-file-system
```

---

## Parte 2 — Crear la tarjeta de receta compartible

### 2.1 — Componente `RecipeShareCard`

Crea un componente `components/RecipeShareCard.js` que renderice una tarjeta visual atractiva con:

- Título de la receta en grande.
- Autor, dificultad, tiempo y porciones.
- Lista resumida de ingredientes (los primeros 5-6).
- Rating con estrellas.
- Branding "RecetApp" al final.
- Fondo oscuro con buenos contrastes (será una imagen).

Este componente se renderizará **fuera de la pantalla** (oculto) para poder capturarlo sin que el usuario lo vea.

### 2.2 — Técnica: renderizado oculto para captura

Para capturar un componente como imagen sin mostrarlo, se renderiza fuera de la pantalla:

```jsx
<View style={{ position: 'absolute', left: -9999 }}>
    <ViewShot ref={viewRef} options={{ format: 'png', quality: 1.0 }}>
        <RecipeShareCard recipe={recipe} />
    </ViewShot>
</View>
```

---

## Parte 3 — Botón "Compartir como imagen" en el detalle

En la pantalla de detalle de la receta, añade un botón:

- Icono: `share-social-outline` de Ionicons.
- Texto: "Compartir como imagen".
- Al pulsarlo:
  1. Captura la tarjeta con `viewRef.current.capture()`.
  2. Verifica disponibilidad con `Sharing.isAvailableAsync()`.
  3. Comparte con `Sharing.shareAsync(uri, { mimeType: 'image/png' })`.

---

## Parte 4 — Flujo de compartir

```
Detalle de receta (Nivel 3)
  → Pulsar "Compartir como imagen"
    → ViewShot captura la tarjeta oculta → obtiene URI local
    → Sharing.isAvailableAsync() → verifica
    → Sharing.shareAsync(uri) → abre hoja de compartir nativa
      → El usuario elige: WhatsApp, Telegram, email, guardar en fotos, etc.
```

---

## Checklist

- [ ] `expo-sharing` instalado y funcionando
- [ ] `react-native-view-shot` instalado y funcionando
- [ ] Componente `RecipeShareCard` con diseño atractivo
- [ ] `ViewShot` envolviendo la tarjeta con `ref`
- [ ] Tarjeta renderizada fuera de pantalla (`position: absolute, left: -9999`)
- [ ] `.capture()` genera URI local de la imagen
- [ ] `Sharing.isAvailableAsync()` verificado antes de compartir
- [ ] `Sharing.shareAsync(uri, { mimeType: 'image/png' })` funcional
- [ ] Gestión de errores (captura fallida, sharing no disponible)

---

## Referencias técnicas

| Recurso | Enlace |
|---|---|
| expo-sharing | https://docs.expo.dev/versions/latest/sdk/sharing/ |
| react-native-view-shot | https://github.com/gre/react-native-view-shot |
| expo-file-system | https://docs.expo.dev/versions/latest/sdk/filesystem/ |

