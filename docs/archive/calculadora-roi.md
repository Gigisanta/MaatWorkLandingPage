# ROI Calculator - Calculadora de Retorno de Inversion

## Descripcion General

La calculadora de ROI es una herramienta interactiva que ayuda a los visitantes a cuantificar el ahorro de tiempo y dinero que pueden obtener con MaatWork. Es una herramienta de conversion poderosa que hace tangibles los beneficios intangibles.

## Variables de Entrada (Sliders)

### 1. Horas Diarias en Tareas Manuales
- **Tipo**: Slider con valor numerico
- **Rango**: 1 a 12 horas
- **Default**: 3 horas
- **Label**: "Horas diarias en tareas administrativas"

### 2. Valor de Tu Hora de Trabajo
- **Tipo**: Slider con valor monetario
- **Rango**: $500 a $10,000 ARS (o USD segun region)
- **Default**: $2,000 ARS
- **Label**: "Valor de tu hora de trabajo"

### 3. Dias Laborables por Mes
- **Tipo**: Slider o valor fijo
- **Rango**: 20 a 30 dias
- **Default**: 24 dias
- **Label**: "Dias laborables por mes"

## Calculos Automáticos

### Tiempo Ahorrado

```
Horas mensuales = Horas_diarias x Dias_laborables
Ejemplo: 3 horas x 24 dias = 72 horas/mes
```

### Dinero Ahorrado

```
Ahorro mensual = Horas_ahorradas x Valor_hora
Ejemplo: 72 horas x $2,000 = $144,000 ARS/mes
```

### ROI Anual

```
Ahorro anual = Ahorro_mensual x 12
Ejemplo: $144,000 x 12 = $1,728,000 ARS/ano
```

## Resultado Mostrado

### Display Principal
- **Numero grande**: Ahorro en pesos/dolares
- **Texto**: "Ahorro mensual" o "Tu ahorro potencial"
- **Periodo**: Por mes / Por ano

### Desglose Adicional
- Horas ahorradas por mes
- Equivalencia en dias de trabajo
- Comparacion vs. precio de MaatWork ($59)

## Formato Visual

### Layout

```
+------------------------------------------+
|  [ICONO: Calculadora]                    |
|                                          |
|  Titulo: "Calcula tu ahorro"             |
|                                          |
|  +------------------------------------+  |
|  | Horas diarias        [-====o----] |  |
|  | Valor hora           [===o======] |  |
|  | Dias al mes          [======o===] |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  |         RESULTADO                  |  |
|  |         $144,000/mes               |  |
|  |         72 horas ahorradas         |  |
|  +------------------------------------+  |
|                                          |
|  [CTA: Comenzar ahora]                  |
+------------------------------------------+
```

### Diseno de Sliders
- Track con color de marca
- Thumb/drag grande y facil de usar en touch
- Valor numerico visible cerca del slider
- Minimo y maximo en extremos

### Resultado
- Numero grande y destacado
- Animacion sutil al actualizar (contador creciente)
- Separador de miles para legibilidad

## Proposito

- **Engagement**: Herramienta interactiva mantiene al usuario en la pagina
- **Personalizacion**: El usuario ve numeros propios, no genEricos
- **Justificacion**: El ahorro justifica facilmente el precio de $59/mes
- **Conviccion**: "Solo con 1 hora al dia ya recupero la inversion"

## Formula del ROI

### Comparacion Simple

```
Si ahorras $144,000/mes y MaatWork cuesta $59/mes:
ROI = ($144,000 - $59) / $59 x 100 = 243,966%
```

### Tiempo de Retorno
```
El pago de MaatWork se recupera en segundos de ahorro
```

## Consideraciones de UX

- Los sliders deben responder rapido al arrastrar
- El resultado debe actualizarse en tiempo real
- Los valores default deben ser razonables para el mercado
- Debe funcionar bien en mobile (sliders touch-friendly)
- El CTA debe estar prominente cerca del resultado
