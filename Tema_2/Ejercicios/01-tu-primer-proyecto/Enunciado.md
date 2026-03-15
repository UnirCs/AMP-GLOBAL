# Ejercicio 01 — Verificación del entorno local con React Native y Expo

## Objetivo

El objetivo de este ejercicio es **asegurarte de que tu entorno de desarrollo está correctamente configurado** para trabajar con React Native y Expo, y que eres capaz de ejecutar una aplicación en un simulador local.

---

## Parte 1 — Crear un nuevo proyecto con Expo

Para crear un nuevo proyecto de React Native utilizaremos la herramienta oficial de Expo. Ejecuta el siguiente comando en tu terminal:

```bash
npx create-expo-app@latest --template blank mi-primera-app
```

> ⚠️ **Nota:** En este ejercicio usaremos el template **blank** (JavaScript). Sin embargo, existen otros templates disponibles como `blank-typescript`, `tabs` (con navegación por pestañas) o incluso empezar con una plantilla vacía. Puedes explorar todas las opciones en la documentación oficial:
> 👉 [https://docs.expo.dev/more/create-expo/](https://docs.expo.dev/more/create-expo/)

Una vez ejecutado el comando, accede a la carpeta del proyecto:

```bash
cd mi-primera-app
```

---

## Parte 2 — Ejecutar el proyecto en un simulador

Arranca el servidor de desarrollo con:

```bash
npx expo start
```

A continuación, deberás tener un simulador disponible. Dependiendo de tu sistema operativo:

- **iOS** *(solo disponible en macOS)*: Se obtiene instalando **Xcode** desde la App Store. Una vez instalado, es necesario **abrirlo al menos una vez** y descargar los simuladores de iPhone desde *Xcode → Settings → Platforms*. Sin este paso, los simuladores no estarán disponibles. Una vez descargados, puedes lanzar el simulador de iOS pulsando la tecla **`i`** en la terminal donde corre Expo.
- **Android** *(disponible en cualquier sistema operativo)*: Se obtiene instalando **Android Studio**. Debes crear un dispositivo virtual (AVD) desde el gestor de dispositivos. Una vez activo, pulsa **`a`** en la terminal de Expo.

> 📹 **Recuerda:** En el **aula virtual** encontrarás un vídeo paso a paso para instalar y configurar tanto los simuladores de iOS como los de Android.

Cuando el simulador muestre la aplicación funcionando, habrás superado esta parte del ejercicio. 🎉

---

## Parte 3 — Personalización del App.js

Una vez que la aplicación arranque correctamente en el simulador, es el momento de hacer tu primera personalización.

Modifica el archivo **`App.js`** para crear una pequeña **tarjeta de presentación personal** con la siguiente información:

- 🖼️ **Tu foto** (puedes usar una URL pública)
- 👤 **Tu nombre completo**
- 💼 **Tu puesto actual**
- 📝 **Una breve descripción** de a qué te dedicas

### Componentes a utilizar

Para esta pantalla tan sencilla, utilizarás únicamente los siguientes componentes de React Native:

| Componente | Descripción | Documentación |
|---|---|---|
| `View` | Contenedor principal para estructurar la pantalla | [Ver docs](https://reactnative.dev/docs/view) |
| `Text` | Para mostrar textos (nombre, puesto, descripción) | [Ver docs](https://reactnative.dev/docs/text) |
| `Image` | Para mostrar tu foto | [Ver docs](https://reactnative.dev/docs/image) |

### Requisitos

- Utilizar al menos un componente `View` como contenedor principal.
- Mostrar una imagen (tu foto o avatar) con el componente `Image`.
- Mostrar tu nombre con un componente `Text`.
- Mostrar tu puesto actual y una breve descripción con componentes `Text`.
- **Jugar un poco con los estilos** usando `StyleSheet`: cambia colores, tamaños de fuente, márgenes, alineaciones, etc. ¡Sé creativo/a!

