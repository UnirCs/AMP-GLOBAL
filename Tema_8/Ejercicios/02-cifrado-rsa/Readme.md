# Ejercicio de cifrado asimétrico usando RSA con OpenSSL

## ¿De qué trata este ejercicio?

Este ejercicio tiene como objetivo entender cómo funciona el **cifrado con clave asimétrica RSA** de forma práctica, ejecutando los pasos directamente desde la terminal con la herramienta OpenSSL.

A diferencia del cifrado simétrico (donde se usa la misma clave para cifrar y descifrar), el cifrado asimétrico utiliza un **par de claves matemáticamente relacionadas**:

- 🔑 **Clave pública**: se puede compartir libremente con cualquiera. Se usa para **cifrar**.
- 🔐 **Clave privada**: debe mantenerse secreta. Se usa para **descifrar**.

---

## ¿Cómo funciona RSA?

RSA (Rivest–Shamir–Adleman) es uno de los algoritmos de clave pública más utilizados en el mundo. Su seguridad se basa en la **dificultad computacional de factorizar números enteros muy grandes**.

### Conceptos matemáticos clave (simplificados)

1. **Generación del par de claves:**
   - Se eligen dos números primos grandes, `p` y `q`.
   - Se calcula `n = p × q` (módulo RSA), que forma parte de ambas claves.
   - Se calcula `φ(n) = (p-1)(q-1)` (función de Euler).
   - Se elige un número `e` coprimo con `φ(n)` → este será el **exponente público**.
   - Se calcula `d`, el inverso modular de `e` respecto a `φ(n)` → este será el **exponente privado**.
   - **Clave pública:** `(e, n)` | **Clave privada:** `(d, n)`

2. **Cifrado** (con la clave pública):
   ```
   C = M^e mod n
   ```
   Donde `M` es el mensaje (como número) y `C` es el mensaje cifrado.

3. **Descifrado** (con la clave privada):
   ```
   M = C^d mod n
   ```
   Solo quien conoce `d` puede recuperar `M`.

La magia del algoritmo es que aunque `e` y `n` son públicos, deducir `d` requeriría factorizar `n`, algo computacionalmente inviable para claves de 2048 bits o más.

---

## Objetivo

Este documento muestra una demostración sencilla de **cifrado asimétrico con RSA** usando OpenSSL desde terminal.

La idea principal es:

```text
mensaje.txt
   ↓ cifrado con clave pública
cifrado.bin
   ↓ descifrado con clave privada
descifrado.txt
```

En RSA, **cualquiera puede cifrar usando la clave pública**, pero **solo quien posee la clave privada correspondiente puede recuperar el mensaje original**.

---

## 1. Generar la clave privada RSA

```bash
openssl genpkey -algorithm RSA -out privada.pem -pkeyopt rsa_keygen_bits:2048
```

Este comando genera una **clave privada RSA** y la guarda en un archivo llamado `privada.pem`.

### Explicación de los argumentos

```text
openssl
```

Invoca la herramienta OpenSSL.

```text
genpkey
```

Indica que queremos generar una clave criptográfica.

```text
-algorithm RSA
```

Especifica que el algoritmo de clave pública será **RSA**.

```text
-out privada.pem
```

Indica el archivo de salida donde se guardará la clave privada.

```text
-pkeyopt rsa_keygen_bits:2048
```

Define el tamaño de la clave RSA. En este caso, se genera una clave de **2048 bits**.

---

## 2. Extraer la clave pública desde la clave privada

```bash
openssl rsa -pubout -in privada.pem -out publica.pem
```

Este comando obtiene la **clave pública** correspondiente a la clave privada anterior.

### Explicación de los argumentos

```text
rsa
```

Indica que vamos a trabajar con claves RSA.

```text
-pubout
```

Solicita que se exporte la parte pública de la clave.

```text
-in privada.pem
```

Archivo de entrada. Es la clave privada generada en el paso anterior.

```text
-out publica.pem
```

Archivo de salida donde se guardará la clave pública.

La idea importante es que desde la clave privada puede extraerse la pública, pero no al revés.

---

## 3. Crear un mensaje de prueba

```bash
echo "Hola RSA" > mensaje.txt
```

Este comando crea un archivo de texto con el mensaje que vamos a cifrar.

### Explicación de los argumentos

```text
echo "Hola RSA"
```

Escribe el texto `Hola RSA`.

```text
> mensaje.txt
```

Redirige esa salida a un archivo llamado `mensaje.txt`.

El contenido del archivo será:

```text
Hola RSA
```

---

## 4. Cifrar el mensaje con la clave pública

```bash
openssl pkeyutl -encrypt \
  -inkey publica.pem \
  -pubin \
  -in mensaje.txt \
  -out cifrado.bin
```

Este comando cifra el contenido de `mensaje.txt` usando la **clave pública**.

### Explicación de los argumentos

```text
pkeyutl
```

Utilidad de OpenSSL para realizar operaciones con claves públicas y privadas.

```text
-encrypt
```

Indica que queremos cifrar datos.

```text
-inkey publica.pem
```

Indica qué clave se usará para la operación. En este caso, usamos la clave pública.

```text
-pubin
```

Le dice a OpenSSL que la clave proporcionada con `-inkey` es una **clave pública**.

```text
-in mensaje.txt
```

Archivo de entrada que contiene el mensaje original.

```text
-out cifrado.bin
```

Archivo de salida donde se guarda el mensaje cifrado.

Después de este paso, `cifrado.bin` contiene datos binarios ilegibles para una persona.

---

## 5. Descifrar el mensaje con la clave privada

```bash
openssl pkeyutl -decrypt \
  -inkey privada.pem \
  -in cifrado.bin \
  -out descifrado.txt
```

Este comando descifra el archivo `cifrado.bin` usando la **clave privada**.

### Explicación de los argumentos

```text
pkeyutl
```

Utilidad de OpenSSL para operaciones con claves.

```text
-decrypt
```

Indica que queremos descifrar datos.

```text
-inkey privada.pem
```

Clave usada para descifrar. En RSA, el mensaje cifrado con la clave pública solo puede descifrarse con la clave privada correspondiente.

```text
-in cifrado.bin
```

Archivo de entrada con el contenido cifrado.

```text
-out descifrado.txt
```

Archivo de salida donde se guarda el mensaje recuperado.

---

## 6. Verificar el resultado

```bash
cat descifrado.txt
```

Este comando muestra el contenido del archivo descifrado.

### Explicación de los argumentos

```text
cat
```

Muestra por pantalla el contenido de un archivo.

```text
descifrado.txt
```

Archivo que contiene el mensaje recuperado.

La salida esperada es:

```text
Hola RSA
```

---

## 7. Ver el contenido cifrado en Base64

```bash
base64 cifrado.bin
```

Este comando permite ver el contenido cifrado en un formato textual.

### Explicación de los argumentos

```text
base64
```

Convierte datos binarios a una representación textual.

```text
cifrado.bin
```

Archivo binario cifrado que queremos visualizar.

Esto no descifra el mensaje. Solo convierte el contenido cifrado a texto para poder verlo, copiarlo o pegarlo más fácilmente.

---

## Set completo de comandos

```bash
# 1. Generar clave privada RSA
openssl genpkey -algorithm RSA -out privada.pem -pkeyopt rsa_keygen_bits:2048

# 2. Extraer la clave pública a partir de la clave privada
openssl rsa -pubout -in privada.pem -out publica.pem

# 3. Crear un mensaje de prueba
echo "Hola RSA" > mensaje.txt

# 4. Cifrar el mensaje con la clave pública
openssl pkeyutl -encrypt \
  -inkey publica.pem \
  -pubin \
  -in mensaje.txt \
  -out cifrado.bin

# 5. Descifrar el mensaje con la clave privada
openssl pkeyutl -decrypt \
  -inkey privada.pem \
  -in cifrado.bin \
  -out descifrado.txt

# 6. Verificar el resultado
cat descifrado.txt

# 7. Ver el contenido cifrado en Base64
base64 cifrado.bin
```

---

## Resumen conceptual

```text
1. Se genera una clave privada.
2. A partir de ella se obtiene la clave pública.
3. El mensaje se cifra con la clave pública.
4. El mensaje solo puede descifrarse con la clave privada.
```

La idea clave para la clase sería:

> Cualquiera puede cifrar usando la clave pública, pero solo quien posee la clave privada puede recuperar el mensaje original.

---

## Nota didáctica

RSA no se usa normalmente para cifrar mensajes grandes directamente. En sistemas reales suele utilizarse para cifrar una clave simétrica temporal, y esa clave simétrica cifra el contenido. Aun así, este ejemplo es útil para demostrar el principio básico del **cifrado asimétrico**.

---

## 💻 ¿Tienes Windows? Cómo probarlo

Todos los comandos de este ejercicio son de terminal Unix/Linux. Si usas **Windows**, tienes dos opciones para ejecutarlos sin instalar nada adicional complejo:

### Opción 1: Git Bash

Si tienes **Git** instalado (muy probable si has trabajado con repositorios), ya tienes Git Bash disponible.

1. Abre el menú de inicio y busca **"Git Bash"**.
2. Se abrirá una terminal que emula Unix y ya incluye `openssl` y `base64`.
3. Ejecuta los comandos del ejercicio exactamente como aparecen en este documento.

> ✅ Es la opción más sencilla si ya tienes Git instalado.

### Opción 2: Windows Subsystem for Linux (WSL)

WSL te permite ejecutar un entorno Linux completo dentro de Windows, sin necesidad de una máquina virtual.

1. Abre **PowerShell como administrador** y ejecuta:
   ```powershell
   wsl --install
   ```
2. Reinicia el equipo si se solicita.
3. Una vez instalado, abre **Ubuntu** (o la distro que hayas elegido) desde el menú de inicio.
4. Instala OpenSSL si no está disponible:
   ```bash
   sudo apt update && sudo apt install openssl
   ```
5. Ejecuta los comandos del ejercicio normalmente.

> ✅ Es la opción más completa y recomendada para desarrollo en general.

