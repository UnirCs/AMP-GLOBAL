# 🔐 El Cifrado César

## 🎬 Video introductorio

[![El Cifrado César en 60 segundos](https://img.youtube.com/vi/wNmm5i4QYX4/0.jpg)](https://youtube.com/shorts/wNmm5i4QYX4?si=_fj7zKHwubZjRx-d)

> 📺 [Ver video: El Cifrado César](https://youtube.com/shorts/wNmm5i4QYX4?si=_fj7zKHwubZjRx-d)

---

## ¿Qué es el Cifrado César?

El **Cifrado César** es una de las técnicas de cifrado más simples y antiguas conocidas. Se trata de un **cifrado simétrico de sustitución** en el que cada letra del texto original es reemplazada por otra letra que se encuentra un número fijo de posiciones más adelante (o atrás) en el alfabeto.

> **Fórmula:**
> - Cifrar: `C = (P + n) mod 26`
> - Descifrar: `P = (C - n) mod 26`
>
> Donde `P` es la posición de la letra original, `n` es el número de rotaciones y `C` es la posición de la letra cifrada.

---

## 🏛️ Historia

El cifrado lleva el nombre del **emperador romano Julio César** (100 a.C. – 44 a.C.), quien lo utilizaba para comunicarse con sus generales de forma secreta, protegiéndose de interceptaciones enemigas.

Según el historiador Suetonio, César usaba habitualmente una rotación de **3 posiciones** hacia la derecha en el alfabeto latino. De este modo, la letra `A` se convertía en `D`, la `B` en `E`, y así sucesivamente.

Aunque en su época resultaba suficientemente seguro (poca gente sabía leer), hoy en día es considerado un cifrado **trivialmente vulnerable**, fácil de romper con un simple ataque de fuerza bruta (solo existen 25 posibles rotaciones).

---

## 🛡️ Importancia en la Seguridad Informática

A pesar de su sencillez, el Cifrado César tiene un gran valor pedagógico y académico dentro de la ciberseguridad:

- **Fundamento criptográfico:** Es el punto de partida para comprender cifrados más complejos como el cifrado de Vigenère, ROT13 o los cifrados polialfabéticos.
- **Concepto de clave:** Introduce el concepto de **clave secreta** (el número de rotaciones), base de toda la criptografía moderna.
- **Análisis de frecuencia:** Aprender a romperlo enseña el **análisis de frecuencia de letras**, técnica usada en criptoanálisis avanzado.
- **ROT13:** Una variante popular del Cifrado César con rotación 13 se sigue usando hoy en día para ocultar spoilers o texto sensible en foros de internet.
- **Base histórica:** Comprender su historia ayuda a contextualizar la evolución de la seguridad de la información desde la Antigüedad hasta la era digital.

---

## 🔄 Ejemplos de Funcionamiento

### Alfabeto de referencia

```
Posición: 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25
Letra:     A  B  C  D  E  F  G  H  I  J  K  L  M  N  O  P  Q  R  S  T  U  V  W  X  Y  Z
```

---

### Ejemplo 1 — Rotación positiva: `+4`

Cada letra se desplaza **4 posiciones hacia la derecha**.

| Texto original | A | T | A | C | A | R |
|:--------------:|:-:|:-:|:-:|:-:|:-:|:-:|
| **Rotación**   | +4| +4| +4| +4| +4| +4|
| **Cifrado**    | E | X | E | G | E | V |

```
Texto:   ATACAR
Cifrado: EXEGEV
```

> `A(0) + 4 = E(4)` · `T(19) + 4 = X(23)` · `C(2) + 4 = G(6)` · `R(17) + 4 = V(21)`

---

### Ejemplo 2 — Rotación positiva: `+4` con vuelta al inicio

Cuando la suma supera la `Z`, el alfabeto **vuelve a empezar** desde la `A`.

| Texto original | V | I | V | A |
|:--------------:|:-:|:-:|:-:|:-:|
| **Rotación**   | +4| +4| +4| +4|
| **Cifrado**    | Z | M | Z | E |

```
Texto:   VIVA
Cifrado: ZMZE
```

> `V(21) + 4 = Z(25)` · `I(8) + 4 = M(12)` · `A(0) + 4 = E(4)`

---

### Ejemplo 3 — Rotación negativa: `-4`

Cada letra se desplaza **4 posiciones hacia la izquierda** (descifrado).

| Texto cifrado  | R | I | T | I | F | E |
|:--------------:|:-:|:-:|:-:|:-:|:-:|:-:|
| **Rotación**   | -4| -4| -4| -4| -4| -4|
| **Descifrado** | N | E | P | E | B | A |

```
Cifrado:    RITIFE
Descifrado: NEPEBA
```

> `R(17) - 4 = N(13)` · `I(8) - 4 = E(4)` · `T(19) - 4 = P(15)` · `F(5) - 4 = B(1)` · `E(4) - 4 = A(0)`

---

### Ejemplo 4 — Rotación negativa: `-4` con vuelta al final

Cuando la resta resulta negativa, el alfabeto **vuelve al final** (se suma 26).

| Texto cifrado  | C | B | A |
|:--------------:|:-:|:-:|:-:|
| **Rotación**   | -4| -4| -4|
| **Descifrado** | Y | X | W |

```
Cifrado:    CBA
Descifrado: YXW
```

> `C(2) - 4 = -2 → -2 + 26 = 24 = Y` · `B(1) - 4 = -3 → -3 + 26 = 23 = X` · `A(0) - 4 = -4 → -4 + 26 = 22 = W`

---

## 📝 Ejercicios

> 💡 **Instrucciones:** Intenta resolver cada ejercicio antes de revelar la solución. Usa lápiz y papel o crea tu propio programa.

---

### Ejercicio 1 — Cifrar con rotación `+4`

**Cifra el siguiente mensaje con una rotación de +4:**

```
ROMA NO SE CONSTRUYO EN UN DIA
```

<details>
<summary>🔍 Ver solución</summary>

```
Texto:   R  O  M  A     N  O     S  E     C  O  N  S  T  R  U  Y  O     E  N     U  N     D  I  A
Cifrado: V  S  Q  E     R  S     W  I     G  S  R  W  X  V  Y  C     S     I  R     Y  R     H  M  E

Resultado: VSQE RS WI GSRWXVYC SR YR HMIE
```

> Cada letra se desplaza 4 posiciones a la derecha en el alfabeto. Los espacios no se cifran.

</details>

---

### Ejercicio 2 — Descifrar con rotación `-4`

**Descifra el siguiente mensaje sabiendo que fue cifrado con rotación +4:**

```
XMZI UYI XYIVXE IW WIKYVM HEH
```

<details>
<summary>🔍 Ver solución</summary>

```
Cifrado:    X  M  Z  I     U  Y  I     X  Y  I  V  X  E     I  W     W  I  K  Y  V  M     H  E  H
Descifrado: T  I  V  E     Q  U  E     T  U  E  R  T  A     E  S     S  E  G  U  R  I     D  A  D

Resultado: TIVE QUE TUERTA ES SEGURI DAD
```

> Aplica rotación -4 (o equivalentemente +22) a cada letra del mensaje.

</details>

---

### Ejercicio 3 — Cifrar con rotación `-4`

**Cifra el siguiente mensaje con una rotación de -4:**

```
CLAVE SECRETA MUY FUERTE
```

<details>
<summary>🔍 Ver solución</summary>

```
Texto:   C  L  A  V  E     S  E  C  R  E  T  A     M  U  Y     F  U  E  R  T  E
Cifrado: Y  H  W  R  A     O  A  Y  N  A  P  W     I  Q  U     B  Q  A  N  P  A

Resultado: YHWRA OAYNAWPW IQUBQANPA
```

> Cada letra se desplaza 4 posiciones a la izquierda. Cuando el resultado es negativo, se suma 26.

</details>

---

### Ejercicio 4 — Descifrar con rotación `+4` (detectar el mensaje oculto)

**El siguiente mensaje fue interceptado. Fue cifrado con rotación +4. ¿Qué dice?**

```
EXEUYVI E PEW HSAW HI PE REQERE
```

<details>
<summary>🔍 Ver solución</summary>

```
Cifrado:    E  X  E  Y  Y  V  I     E     P  E  W     H  S  E  W     H  I     P  E     R  E  Q  E  R  E
Descifrado: A  T  A  Q  U  R  E     A     L  A  S     D  O  A  S     D  E     L  A     N  A  M  A  N  A

Resultado: ATAQURE A LAS DOAS DE LA NAMANA
           → ATAQUE A LAS DOCE DE LA MAÑANA
```

> Ten en cuenta que el español tiene letras como `Ñ` que no están en el alfabeto inglés estándar de 26 letras. En implementaciones reales se suele omitir la `Ñ` o usar variantes adaptadas.

</details>

---

### Ejercicio 5 — Descifrar sin conocer la clave 🔎

**El siguiente mensaje fue interceptado. No sabes con qué rotación fue cifrado. ¿Puedes descubrirlo y leer el mensaje?**

```
VHJXULGDG DQWH WRGR
```

> 💡 **Pista:** Prueba todas las rotaciones posibles (del 1 al 25) hasta que el texto tenga sentido en español. Solo hay 25 posibilidades. Empieza por las rotaciones más usadas históricamente.

<details>
<summary>🔍 Ver solución</summary>

**Estrategia: fuerza bruta** — probar cada rotación hasta encontrar texto legible.

```
Rot -1: UGIVTKFC CPVG VQFQ
Rot -2: TFHUSIJB BOUS UPEP
Rot -3: SEGURIDAD ANTE TODO  ✅
```

**Verificación letra a letra (rotación -3):**

```
Cifrado:    V  H  J  X  U  L  G  D  G     D  Q  W  H     W  R  G  R
Pos:        21  7  9 23 20 11  6  3  6     3 16 22  7    22 17  6 17
-3:         18  4  6 20 17  8  3  0  3     0 13 19  4    19 14  3 14
Descifrado: S  E  G  U  R  I  D  A  D     A  N  T  E     T  O  D  O

Resultado: SEGURIDAD ANTE TODO
```

> ✅ **Clave encontrada: rotación +3** (la clásica de Julio César). Aplicar **-3** a cada letra revela el mensaje original.

</details>

---

### Ejercicio 6 — Descifrar sin conocer la clave 🔎

**Interceptaste este mensaje. La clave es desconocida. Descúbrela y descifra el texto.**

```
JVUAYVSH ABZ KHAVZ
```

> 💡 **Pista:** Fíjate en las palabras cortas (2-3 letras). En español las más frecuentes son: `DE`, `LA`, `EL`, `UN`, `EN`, `ES`, `SE`, `CON`, `TUS`. La palabra de 3 letras puede darte la pista clave.

<details>
<summary>🔍 Ver solución</summary>

**Estrategia: análisis de palabras cortas** — la palabra `ABZ` tiene 3 letras. Probamos si podría ser `TUS`:

```
A → T significa: A(0) - T(19) = -19 → módulo 26: -19 + 26 = 7 → la clave sería +7
```

**Verificar hipótesis: descifrar con rotación -7:**

```
A(0)  -7+26 = 19 = T ✓
B(1)  -7+26 = 20 = U ✓
Z(25) -7    = 18 = S ✓  → ABZ = TUS ✅
```

**Descifrado completo (rotación -7):**

```
Cifrado:    J  V  U  A  Y  V  S  H     A  B  Z     K  H  A  V  Z
Pos:        9 21 20  0 24 21 18  7     0  1 25    10  7  0 21 25
-7:         2 14 13 19 17 14 11  0    19 20 18     3  0 19 14 18
Descifrado: C  O  N  T  R  O  L  A     T  U  S     D  A  T  O  S

Resultado: CONTROLA TUS DATOS
```

> ✅ **Clave encontrada: rotación +7**. El truco fue identificar la palabra corta `ABZ` como `TUS` para deducir la rotación sin necesidad de fuerza bruta completa.

</details>

---

> 📚 **Referencias:**
> - Suetonio, *Vidas de los Doce Césares*, Libro II (s. II d.C.)
> - Kahn, D. (1967). *The Codebreakers*. Macmillan.
> - Stallings, W. (2017). *Cryptography and Network Security*. Pearson.


