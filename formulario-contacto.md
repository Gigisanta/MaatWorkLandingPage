# Contact Form - Formulario de Contacto

## Descripcion General

El formulario de contacto es la via principal para que potenciales clientes se comuniquen con el equipo de MaatWork. Es una herramienta de conversion critica para capturar leads interesados.

## Campos del Formulario

### 1. Nombre
- **Tipo**: Campo de texto
- **Placeholder**: "Tu nombre" o "Juan Perez"
- **Validacion**: Requerido, minimo 2 caracteres
- **Tipo de input**: text

### 2. Numero de WhatsApp
- **Tipo**: Campo telefonico
- **Placeholder**: "+54 9 11 1234 5678"
- **Validacion**: Requerido, formato telefonico valido
- **Tipo de input**: tel
- **Nota**: Campo preferido sobre email para comunicacion rapida

### 3. Email
- **Tipo**: Campo de correo electronico
- **Placeholder**: "tu@email.com"
- **Validacion**: Requerido, formato de email valido
- **Tipo de input**: email

### 4. Industria / Tipo de Negocio
- **Tipo**: Dropdown o selector
- **Placeholder**: "Selecciona tu industria"
- **Opciones sugeridas**:
  - Gimnasio
  - Salon de belleza
  - Academia / Escuela
  - Centro de pilates / Yoga
  - Swimming pool / Club
  - Consultorio profesional
  - Otro

### 5. Problema Principal
- **Tipo**: Campo de texto largo o dropdown
- **Placeholder**: "Cuentanos tu mayor desafio..."
- **Validacion**: Opcional o requerido segun configuracion
- **Tipo de input**: textarea o select

## Boton de Envio

### CTA Principal
**Texto**: "Enviar" o "Comenzar" o "Solicitar demo"

### Estados del Boton
- **Default**: Listo para hacer clic
- **Hover**: Efecto visual al pasar el mouse
- **Loading**: Indicador de envio en proceso
- **Disabled**: Cuando el formulario es invalido
- **Success**: Confirmacion de envio exitoso

## Mensajes de Feedback

### Mensaje de Error
- Se muestra si hay campos invalidos
- Texto claro indicando que campo necesita correccion
- Color rojo para destacar errores

### Mensaje de Exito
- **Texto**: "Gracias por contactarnos!" o "Mensaje enviado"
- **Accion**: Redireccion a pagina de agradecimiento o mensaje inline
- **Proximo paso**: "Te contactaremos pronto por WhatsApp"

## Consideraciones de UX

### Diseño de Formulario
- Labels claros encima de cada campo
- Placeholders como ayuda, no como label
- Espaciado generoso entre campos
- Indicador de campos requeridos (*)
- Focus states visibles

### Validacion
- Validacion en tiempo real (al salir del campo)
- Mensajes de error especificos
- Validacion del lado del cliente y servidor

### Privacidad
- Checkbox de aceptacion de politica de privacidad (si aplica)
- Link a politica de privacidad
- Nota sobre como se usaran los datos

## Integracion con WhatsApp (Opcional)

El formulario puede tener una opcion alternativa:

### Boton WhatsApp
- **Texto**: "Prefiero escribir directo por WhatsApp"
- **Accion**: Abre WhatsApp con mensaje prellenado
- **Numero**: +54 9 11 3091 6574

## Proposito

- **Capturar leads**: Recopilar informacion de potenciales clientes
- **Calificar prospects**: La industria y problema ayudan a segmentar
- **Iniciar conversacion**: El equipo puede responder personalmente
- **Generar confianza**: Un formulario profesional transmite seriedad

## Consideraciones Tecnicas

- El formulario debe enviarse via POST a un backend
- Los datos deben almacenarse de forma segura
- Puede integrarse con CRM, email marketing, o WhatsApp Business API
-防护 contra spam (honeypot, CAPTCHA si es necesario)
