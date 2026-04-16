# Ejercicio 4 — Fotografiar platos con la cámara (RecetApp)

## Objetivo

Ampliar **RecetApp** para que el usuario pueda **tomar una foto del plato terminado** tras completar los pasos de cocina y asociarla a la receta. Al finalizar el modo paso a paso (Nivel 4), se ofrecerá la opción de abrir la cámara, tomar una foto y guardarla en el contexto de la app vinculada a esa receta.

Se practicará el módulo **expo-camera**, incluyendo solicitud de permisos, vista previa de la cámara, captura de foto y almacenamiento de la imagen.

---

## Conceptos previos

### expo-camera

Proporciona un componente React Native que renderiza la vista previa de la cámara del dispositivo y permite capturar fotos y vídeos.

```jsx
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';

const [permission, requestPermission] = useCameraPermissions();
const [facing, setFacing] = useState('back'); // 'back' o 'front'
const cameraRef = useRef(null);

// Capturar foto
const takePicture = async () => {
    if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({
            quality: 0.8,
            base64: false,
        });
        console.log(photo.uri); // URI local de la foto
    }
};

// JSX:
<CameraView
    ref={cameraRef}
    style={{ flex: 1 }}
    facing={facing}
/>
```

**Hook `useCameraPermissions()`:**

| Retorno | Tipo | Descripción |
|---|---|---|
| `permission` | `object \| null` | Estado del permiso. `permission.granted` es `true` si fue concedido |
| `requestPermission` | `function` | Función para solicitar el permiso |

**Props principales de `CameraView`:**

| Prop | Tipo | Descripción |
|---|---|---|
| `ref` | `ref` | Referencia para llamar a métodos como `takePictureAsync` |
| `facing` | `'back' \| 'front'` | Cámara trasera o frontal |
| `style` | `object` | Estilos del contenedor de la cámara |
| `flash` | `'on' \| 'off' \| 'auto'` | Modo de flash |
| `zoom` | `number` | Nivel de zoom (0 a 1) |
| `onBarcodeScanned` | `function` | Callback para escaneo de códigos QR/barras |

**Método `takePictureAsync(options)`:**

| Opción | Tipo | Descripción |
|---|---|---|
| `quality` | `number` | Calidad de la imagen (0 a 1). Solo para JPEG |
| `base64` | `boolean` | Si `true`, incluye la imagen en Base64 |
| `exif` | `boolean` | Si `true`, incluye metadatos EXIF |

El método devuelve un objeto con:
- `uri` — URI local de la foto capturada.
- `width` / `height` — dimensiones de la imagen.
- `base64` — cadena Base64 (si se solicitó).

> ⚠️ `CameraView` sustituye al antiguo componente `Camera` desde Expo SDK 51+.

> 📖 [expo-camera — Documentación](https://docs.expo.dev/versions/latest/sdk/camera/)

### Patrón: pantalla de cámara con preview

Un patrón muy común es:

1. **Pantalla de cámara**: muestra la vista previa en pantalla completa con un botón de captura.
2. **Preview de la foto**: tras capturar, muestra la imagen con opciones de "Guardar" o "Repetir".
3. **Vuelta a la app**: al guardar, se almacena la URI y se vuelve a la pantalla anterior.

```
[Vista cámara] → [Capturar] → [Preview] → [Guardar] → [Volver]
                                         → [Repetir] → [Vista cámara]
```

---

## Parte 1 — Instalar dependencias adicionales

```bash
npm install expo-camera
```

---

## Parte 2 — Ampliar el contexto

Añade al `context/RecipesContext.js`:

- `recipePhotos` — objeto `{ [recipeId]: uri }` que almacena la URI de la foto de cada receta.
- `saveRecipePhoto(recipeId, uri)` — función para guardar la foto.

---

## Parte 3 — Nueva pantalla: Cámara para foto del plato

### 3.1 — Estructura de archivos

Añade una nueva ruta tras completar la receta:

```
app/(drawer)/(tabs)/(stack)/landing/categories/[categoryName]/recipes/[idRecipe]/
  cooking/
    index.jsx         ← Paso a paso (existente)
    photo/
      index.jsx       ← NUEVA: Pantalla de cámara
```

### 3.2 — Registrar la ruta en el Stack layout

```jsx
<Stack.Screen
    name="landing/categories/[categoryName]/recipes/[idRecipe]/cooking/photo/index"
    options={{
        title: "Foto del plato",
        headerShown: false, // Pantalla completa sin cabecera
    }}
/>
```

### 3.3 — Modificar la pantalla de completado (Nivel 4)

Cuando el usuario completa todos los pasos de cocina (pantalla de felicitación), añade un botón:

- Texto: "📸 Fotografiar mi plato".
- Navega a la nueva ruta `cooking/photo`.

### 3.4 — Pantalla `photo/index.jsx`

La pantalla debe:

1. **Solicitar permisos** de cámara con `useCameraPermissions()`.
2. **Mostrar la vista previa** de la cámara (`CameraView`) a pantalla completa.
3. **Botón de captura** centrado en la parte inferior.
4. **Botón para alternar cámara** (frontal ↔ trasera) en la esquina superior.
5. **Tras capturar**, mostrar la imagen en modo preview con botones:
   - "✅ Guardar" → guarda la URI en el contexto y vuelve al detalle.
   - "🔄 Repetir" → vuelve a la vista de cámara para otra captura.
6. **Gestión de permisos denegados**: pantalla informativa con botón de solicitar permiso.

---

## Parte 4 — Mostrar la foto en el detalle

En la pantalla de detalle de la receta (Nivel 3), si existe una foto guardada para esa receta (`recipePhotos[recipeId]`), muéstrala como una imagen `Image` en la parte superior del detalle con un badge "📸 Mi plato".

---

## Checklist

- [ ] `expo-camera` instalado y funcionando
- [ ] `useCameraPermissions()` para gestionar permisos
- [ ] `CameraView` renderizado a pantalla completa
- [ ] Botón de captura funcional con `takePictureAsync()`
- [ ] Alternancia de cámara frontal/trasera (`facing`)
- [ ] Preview de la foto capturada antes de guardar
- [ ] Opciones "Guardar" y "Repetir" en el preview
- [ ] URI guardada en el contexto (`recipePhotos`)
- [ ] Foto visible en el detalle de la receta si existe
- [ ] Gestión de permisos denegados
- [ ] Pantalla de cámara sin cabecera (`headerShown: false`)

---

## Referencias técnicas

| Recurso | Enlace |
|---|---|
| expo-camera | https://docs.expo.dev/versions/latest/sdk/camera/ |
| CameraView | https://docs.expo.dev/versions/latest/sdk/camera/#cameraview |
| useCameraPermissions | https://docs.expo.dev/versions/latest/sdk/camera/#usecamerapermissions |
| Image — React Native | https://reactnative.dev/docs/image |

