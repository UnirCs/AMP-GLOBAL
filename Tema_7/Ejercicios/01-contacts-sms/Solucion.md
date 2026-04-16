# Solución — Compartir recetas por SMS con Contactos (RecetApp)

## Proceso mental

1. **¿Qué módulos necesitamos?** → `expo-contacts` para leer la agenda y `expo-sms` para abrir la app de mensajes.
2. **¿Dónde encaja en la app?** → Desde el detalle de una receta (Nivel 3), un botón navega a una nueva pantalla de selección de contacto. Es una nueva ruta en el Stack.
3. **¿Qué permisos necesitamos?** → Solo contactos (`Contacts.requestPermissionsAsync()`). SMS no requiere permiso explícito (solo abre la app nativa).
4. **¿Cómo obtenemos la receta?** → La pantalla `share` recibe `idRecipe` como parámetro dinámico y busca la receta en el contexto (mismo patrón que el detalle).
5. **¿Cómo filtramos contactos?** → Primero eliminamos los que no tienen número de teléfono, y luego filtramos en tiempo real con un `TextInput` + `useState`.

---

## Paso 1 — Instalar dependencias

```bash
npm install expo-contacts expo-sms
```

---

## Paso 2 — Registrar la nueva ruta en el Stack

En `app/(drawer)/(tabs)/(stack)/_layout.jsx`, añade:

```jsx
// ...existing Stack.Screen entries...
<Stack.Screen
    name="landing/categories/[categoryName]/recipes/[idRecipe]/share/index"
    options={{ title: "Compartir receta" }}
/>
```

---

## Paso 3 — Añadir botón en el detalle de la receta

En `recipes/[idRecipe]/index.jsx`, añade un botón después de "Empezar a cocinar":

```jsx
// ...existing imports...
// Añadir al componente, después del botón de cocinar:

const handleShareSMS = () => {
    router.push(`/(drawer)/(tabs)/(stack)/landing/categories/${categoryName}/recipes/${idRecipe}/share`);
};

// En el JSX, después del botón "Empezar a cocinar":
<Pressable
    onPress={handleShareSMS}
    className="bg-blue-600 rounded-xl py-4 px-6 flex-row items-center justify-center active:bg-blue-700 mb-4"
>
    <Ionicons name="chatbubble-outline" size={24} color="white" />
    <Text className="text-white text-lg font-bold ml-2">
        Compartir por SMS
    </Text>
</Pressable>
```

---

## Paso 4 — `share/index.jsx` (Pantalla de contactos)

```jsx
import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, FlatList, Pressable, Alert,
    KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import * as SMS from 'expo-sms';
import { useRecipesContext } from '../../../../../../../../context/RecipesContext';

export default function ShareRecipeScreen() {
    const { idRecipe } = useLocalSearchParams();
    const { recipes } = useRecipesContext();
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [permissionDenied, setPermissionDenied] = useState(false);

    const recipe = recipes.find(r => r.id === parseInt(idRecipe));

    // Solicitar permisos y cargar contactos al montar
    useEffect(() => {
        (async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.PhoneNumbers],
                });
                if (data.length > 0) {
                    // Filtrar solo contactos con número de teléfono
                    const validContacts = data.filter(
                        contact => contact.phoneNumbers && contact.phoneNumbers.length > 0
                    );
                    setContacts(validContacts);
                    setFilteredContacts(validContacts);
                }
            } else {
                setPermissionDenied(true);
                Alert.alert(
                    'Permisos insuficientes',
                    'Necesitamos acceso a tus contactos para compartir recetas por SMS.'
                );
            }
        })();
    }, []);

    // Filtrar contactos por búsqueda
    useEffect(() => {
        setFilteredContacts(
            contacts.filter(contact =>
                contact.name && contact.name.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, contacts]);

    // Enviar SMS con la receta
    const handleShareWithContact = async (contact) => {
        if (!recipe) {
            Alert.alert('Error', 'No se encontró la receta.');
            return;
        }

        if (!contact.phoneNumbers || contact.phoneNumbers.length === 0) {
            Alert.alert('Error', 'Este contacto no tiene número de teléfono.');
            return;
        }

        const isAvailable = await SMS.isAvailableAsync();
        if (isAvailable) {
            const message =
                `🍳 ¡Te comparto una receta de RecetApp!\n\n` +
                `📖 ${recipe.title}\n` +
                `👨‍🍳 ${recipe.author}\n` +
                `⏱️ ${recipe.time} · ${recipe.difficulty}\n` +
                `👥 ${recipe.servings} porciones\n\n` +
                `${recipe.description}\n\n` +
                `¡Descarga RecetApp para ver los ingredientes y el paso a paso!`;

            await SMS.sendSMSAsync(
                [contact.phoneNumbers[0].number],
                message
            );
        } else {
            Alert.alert('Error', 'No es posible enviar SMS desde este dispositivo.');
        }
    };

    const renderContact = ({ item }) => (
        <Pressable
            onPress={() => handleShareWithContact(item)}
            className="mb-3 active:opacity-70"
        >
            <View
                className="bg-gray-800 flex-row justify-between items-center rounded-xl p-4"
                style={{ borderWidth: 1, borderColor: '#374151' }}
            >
                <View className="flex-1 mr-3">
                    <Text className="text-lg font-bold text-white">{item.name}</Text>
                    {item.phoneNumbers && item.phoneNumbers.length > 0 && (
                        <Text className="text-gray-400 text-sm mt-1">
                            {item.phoneNumbers[0].number}
                        </Text>
                    )}
                </View>
                <Ionicons name="chatbubble-outline" size={24} color="#3b82f6" />
            </View>
        </Pressable>
    );

    // Pantalla de permiso denegado
    if (permissionDenied) {
        return (
            <View className="flex-1 bg-gray-900 justify-center items-center px-6">
                <Ionicons name="lock-closed-outline" size={64} color="#6b7280" />
                <Text className="text-white text-xl text-center mt-4 font-bold">
                    Acceso a contactos denegado
                </Text>
                <Text className="text-gray-400 text-center mt-2">
                    Ve a los ajustes del dispositivo para permitir el acceso a los contactos.
                </Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            className="bg-gray-900"
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1">
                    {/* Info de la receta que se compartirá */}
                    {recipe && (
                        <View className="px-4 pt-4 pb-2">
                            <Text className="text-gray-400 text-sm">Compartiendo:</Text>
                            <Text className="text-white text-lg font-bold">{recipe.title}</Text>
                        </View>
                    )}

                    {/* Barra de búsqueda */}
                    <View className="px-4 py-3">
                        <View
                            className="flex-row items-center bg-gray-700 rounded-xl px-4 py-3"
                            style={{ borderWidth: 1, borderColor: '#6b7280' }}
                        >
                            <Ionicons name="search-outline" size={22} color="#9ca3af" />
                            <TextInput
                                placeholder="Buscar contactos..."
                                placeholderTextColor="#9ca3af"
                                value={search}
                                onChangeText={setSearch}
                                className="flex-1 ml-3 text-white text-base"
                                autoFocus={true}
                            />
                        </View>
                    </View>

                    {/* Lista de contactos */}
                    <FlatList
                        data={filteredContacts}
                        keyExtractor={(item) => item.id}
                        renderItem={renderContact}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                        keyboardShouldPersistTaps="handled"
                        ListEmptyComponent={
                            <View className="justify-center items-center mt-10">
                                <Ionicons name="people-outline" size={48} color="#6b7280" />
                                <Text className="text-gray-400 text-center mt-4">
                                    {contacts.length === 0
                                        ? 'Cargando contactos...'
                                        : 'No hay resultados para tu búsqueda'}
                                </Text>
                            </View>
                        }
                    />
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
```

**Desglose:**

1. **`Contacts.requestPermissionsAsync()`** → pide permiso al usuario. Solo se muestra una vez; después iOS/Android recuerda la decisión.
2. **`Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers] })`** → trae contactos con sus números de teléfono. Especificar `fields` es importante para rendimiento: no traemos datos innecesarios.
3. **Filtro de validez** → `data.filter(c => c.phoneNumbers?.length > 0)` elimina contactos sin número (ej. contactos solo con email).
4. **Filtro de búsqueda** → un segundo `useEffect` observa `search` y filtra por nombre. Es reactivo: al escribir, la lista se actualiza instantáneamente.
5. **`SMS.isAvailableAsync()`** → verifica que el dispositivo puede enviar SMS. En simuladores esto suele devolver `false`.
6. **`SMS.sendSMSAsync()`** → abre la app de SMS nativa con el número y mensaje prellenados. El usuario decide si enviar o no.
7. **`KeyboardAvoidingView`** → evita que el teclado tape la lista de contactos al buscar.
8. **`keyboardShouldPersistTaps="handled"`** → permite pulsar un contacto sin tener que cerrar el teclado primero.

---

## Flujo completo

```
Detalle de receta (Nivel 3)
  → Pulsar "Compartir por SMS"
    → Navegar a share/index.jsx
      → Se solicita permiso de contactos (primera vez)
        → Si concedido: se cargan y muestran contactos
        → Si denegado: pantalla de error con instrucciones
      → Buscar contacto por nombre
      → Pulsar un contacto
        → Se verifica SMS disponible
        → Se abre la app de mensajes con el texto de la receta
```

---

## Referencias

| Recurso | Enlace |
|---|---|
| expo-contacts | https://docs.expo.dev/versions/latest/sdk/contacts/ |
| expo-sms | https://docs.expo.dev/versions/latest/sdk/sms/ |

