# Logo Carousel - Carrusel de Logos

## Descripcion General

El Logo Carousel es una seccion que muestra los logos de empresas o marcas que de alguna manera estan asociadas con MaatWork. Puede tratarse de tecnologias utilizadas, empresas colaboradoras, o simplemente como elemento decorativo para transmitir profesionalismo.

## Proposito Principal

### Prueba Social Indirecta
- Mostrar que MaatWork trabaja con empresas reconocidas
- Generar confianza por asociacion

### Estetica
- Llenar espacio en la pagina
- Crear una transicion visual entre secciones
- Transmitir profesionalismo y seriedad

## Logos Tipicos Mostrados

### Tecnologias (si aplica)
- Next.js
- Vercel
- Stripe
- Supabase
- OpenAI

### Empresas Colaboradoras (si aplica)
- Nombres de empresas locales o partners

### Placeholder (si no hay logos reales)
- Tecnologias de la stack
- Iconos estilizados representando empresas
- El propio logo de MaatWork repetido

## Implementacion Visual

### Animacion

- **Tipo**: Scroll automatico horizontal infinito
- **Velocidad**: Lenta y constante (no distractiva)
- **Direccion**: Izquierda a derecha
- **Loop**: Sin fin, se repite automaticamente
- **Pausa**: Al hacer hover sobre los logos (opcional)

### Estilos

| Elemento | Valor tipico |
|----------|--------------|
| Tamano logos | 80-120px de ancho |
| Altura | Auto para mantener aspect ratio |
| Opacidad | 50-70% (no compite con contenido) |
| Separacion | 32-48px entre logos |
| Filtro | grayscale(100%) para uniformidad |

### Contenedor

- **Fondo**: Puede ser transparente o ligeramente distinto al fondo
- **Padding**: Espacio vertical suficiente (py-12 a py-16)
- **Overflow**: hidden para ocultar logos en bordes

## Formato de Logos

```
[Logo1]  [Logo2]  [Logo3]  [Logo4]  [Logo5]  [Logo6]  [Logo7]  [Logo8]
   └─────────────────────────────────────────────────────────────────┘
                                    │
                              Animacion ────►
```

## Consideraciones de Diseno

### Hacer
- Mantener los logos pequenos y no intrusivos
- Usar grayscale para evitar conflictos de color
- Animar suavemente sin distraer
- Incluir alt text apropiado para accesibilidad

### No Hacer
- Mostrar logos de empresas que no han dado permiso
- Usar animaciones rapidas o erraticas
- Dejar que los logos compitan con CTAs importantes
- Olvidar la pausa en hover para usuarios con vertigo

## Notas Tecnicas

### CSS
```css
.logo-carousel {
  display: flex;
  animation: scroll 20s linear infinite;
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

### JavaScript (opcional)
- Duplicar array de logos para efecto infinito
- Pausar animacion en hover via CSS o JS
- Responsive: ajustar tamano y velocidad en mobile

## Alternativas

Si no hay logos reales para mostrar, opciones validas:
1. No incluir la seccion
2. Usar placeholders estilizados
3. Mostrar "Tecnologias que usamos" con iconos abstractos
4. Reemplazar con estadisticas de la empresa

## Proposito en la Pagina

Esta seccion generalmente aparece:
- Debajo del Hero
- Antes de Features
- Antes o despues de Testimonials
- En el Footer superior

Su ubicacion depende de quanto se quiera enfatizar la asociacion con otras marcas.
