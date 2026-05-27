# Floating WhatsApp Button - Boton Flotante de WhatsApp

## Descripcion General

El Floating WhatsApp Button es un elemento de UI persistente que permanece visible en todas las paginas de la aplicacion. Su funcion es proporcionar un acceso rapido y directo al canal de WhatsApp del equipo de MaatWork.

## Caracteristicas Principales

### Apariencia Visual

- **Icono**: Logo de WhatsApp (burbuja con telefono)
- **Color de fondo**: Verde WhatsApp (#25D366) o similar
- **Color del icono**: Blanco
- **Forma**: Circular
- **Tamano**: Estandar 48x48px o 56x56px para mejor touch target
- **Sombra**: Box-shadow sutil para elevacion visual

### Posicionamiento

- **Ubicacion**: Esquina inferior derecha de la pantalla
- **Margen**: 16-24px del borde derecho e inferior
- **Z-index**: Alto (por ejemplo 9999) para estar sobre otros elementos
- **Fixed**: Posicion fija que no se mueve al hacer scroll

### Estados Visuales

| Estado | Comportamiento |
|--------|----------------|
| Default | Visible con color verde |
| Hover | Escala ligeramente (1.1x) o sombra mas pronunciada |
| Active/Click | Escala reducida momentaneamente (0.95x) |
| New message | Puede mostrar badge con numero (1, 10, etc.) |

## Funcionalidad

### Accion al Click

Al hacer clic en el boton:
1. Se abre WhatsApp Web, WhatsApp Desktop, o WhatsApp Mobile
2. El numero de telefono destino es: +54 9 11 3091 6574
3. Mensaje prellenado puede incluirse (opcional)

### Enlace URL

```
https://wa.me/5491130916574?text=Hola%2C%20quiero%20mas%20informacion
```

Parametros:
- `5491130916574`: Numero en formato internacional (Argentina)
- `?text=`: Parametro opcional para prellenar mensaje

## Propuesta de Valor

### Para el Usuario
- **Acceso inmediato** a comunicacion directa
- **Preferido** sobre填写 un formulario
- **Respuesta rapida** (vs. esperar email)

### Para el Negocio
- **Canal directo** con potenciales clientes
- **Lead qualification** mas rapido
- **Higher conversion** que formularios tradicionales

## Elementos Adicionales (Opcional)

### Tooltip
- **Texto**: "Habla con nosotros" o "Necesitas ayuda?"
- **Appears**: Al hacer hover o after 3 segundos
- **Position**: A la izquierda del boton
- **Animation**: Fade in/out

### Badge de Notificacion
- **Forma**: Circulo rojo pequeno en esquina superior derecha
- **Numero**: Cantidad de mensajes no leidos (si aplica)
- **Animacion**: Pulse sutil para llamar atencion

### Mensaje Pregrabado
 Algunos implementations incluyen un popup con opciones:
- "Quiero mas informacion"
- "Tengo una pregunta"
- "Quiero una demo"

## Consideraciones de UX

- **No molestar**: El boton no debe interferir con el contenido principal
- **Accesibilidad**: El boton debe ser alcanzable via tab y Enter
- **Mobile**: En dispositivos moviles, el tap target debe ser de al menos 44x44px
- **Velocidad**: El enlace debe abrirse rapidamente sin delays

## Consideraciones Tecnicas

- Implementado con CSS `position: fixed`
- z-index alto para estar sobre todo
- JavaScript para manejo de estados hover/active
- HTML semantico con `aria-label` para accesibilidad

## Proposito

- **CTA persistente**: Siempre hay una forma de contactarse
- **Reduce friccion**: WhatsApp es mas rapido que formularios
- **ConversiOn**: Aumenta la tasa de contacto
- **Confianza**: El icono de WhatsApp es reconocido mundialmente
