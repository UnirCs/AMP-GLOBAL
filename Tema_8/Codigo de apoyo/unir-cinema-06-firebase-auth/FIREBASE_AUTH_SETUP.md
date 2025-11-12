# Guía de Configuración de Firebase Authentication (Email/Password)

---

## 📋 Configuración Requerida en Firebase Console

### Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Haz clic en **"Agregar proyecto"** o **"Add project"**
3. Nombra tu proyecto (ejemplo: "unir-cinema")
4. Desactiva Google Analytics si no lo necesitas (opcional)
5. Haz clic en **"Crear proyecto"**

### Paso 2: Registrar tu App Web

1. En el dashboard de Firebase, haz clic en el ícono **Web** (`</>`)
2. Nombra tu app: "UNIR Cinema Web"
3. **NO marques** "Configure Firebase Hosting" (no es necesario)
4. Haz clic en **"Registrar app"**
5. **Incluye el contenido** de `firebaseConfig` en tu proyecto. Por ejemplo:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### Paso 3: Habilitar Email/Password Authentication

**ESTE PASO ES OBLIGATORIO - La app no funcionará sin esto**

1. En Firebase Console, ve al menú lateral izquierdo
2. Haz clic en **"Authentication"** (Autenticación)
3. Haz clic en **"Get started"** si es la primera vez
4. Ve a la pestaña **"Sign-in method"**
5. Busca **"Email/Password"** en la lista de proveedores
6. Haz clic en **"Email/Password"**
7. **ACTIVA** el interruptor "Enable"
8. **NO actives** "Email link (passwordless sign-in)" por ahora
9. Haz clic en **"Save"**
