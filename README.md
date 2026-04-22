# Maatwork Landing Page

Landing page premium para Maatwork — desarrollo de apps personalizadas para negocios en Argentina.

## Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Base de datos**: [NeonDB](https://neon.tech) (PostgreSQL serverless)
- **3D**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Three.js](https://threejs.org)
- **Estilos**: [Tailwind CSS 4](https://tailwindcss.com) + CSS custom properties
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/) + CSS animations
- **Validación**: [Zod](https://zod.dev)
- **Despliegue**: [Vercel](https://vercel.com)

## Requisitos

- Node.js 18+
- npm / yarn / pnpm / bun

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/your-org/maatwork-web.git
cd maatwork-web

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Iniciar desarrollo
npm run dev
```

## Variables de Entorno

### Obligatorias

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection string de NeonDB |

### Opcionales

| Variable | Descripción |
|----------|-------------|
| `SLACK_WEBHOOK_URL` | Webhook de Slack para notificaciones |

### Obtener DATABASE_URL desde NeonDB

1. Ir a [NeonDB Dashboard](https://neon.tech)
2. Crear un nuevo proyecto o seleccionar uno existente
3. Ir a **Dashboard** → **Connection Details**
4. Copiar la URL de conexión con formato:

```
postgresql://usuario:password@host.neon.tech/neondb?sslmode=require
```

## Base de Datos

### Schema de Leads

```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  industria VARCHAR(50) NOT NULL,
  problema TEXT NOT NULL,
  procesos TEXT[] NOT NULL,
  presupuesto VARCHAR(20),
  timeline VARCHAR(20),
  source VARCHAR(50) DEFAULT 'landing_page',
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Ejecutar migrations en NeonDB

```bash
# Usando psql directamente
psql "postgresql://user:password@host/neondb?sslmode=require" -f scripts/migrate.sql

# O desde el dashboard de NeonDB
# Dashboard -> SQL Editor -> Ejecutar SQL
```

## API

### POST /api/leads

Guarda un nuevo lead en la base de datos.

**Request Body**:

```json
{
  "nombre": "Juan Perez",
  "whatsapp": "+5491112345678",
  "email": "juan@example.com",
  "industria": "gimnasio",
  "problema": "Necesito digitalizar mi negocio...",
  "procesos": ["turnos", "pagos"],
  "presupuesto": "50k_150k",
  "timeline": "corto"
}
```

**Response (201)**:

```json
{
  "success": true,
  "message": "Lead creado exitosamente",
  "data": { "id": 1, ... }
}
```

### GET /api/leads

Lista leads (para admin).

## Despliegue en Vercel

### 1. Conectar Repository

1. Ir a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Importar desde GitHub
4. Seleccionar el repositorio `maatwork-web`

### 2. Configurar Environment Variables

1. En el proyecto, ir a **Settings** → **Environment Variables**
2. Agregar las siguientes variables:

| Name | Value |
|------|-------|
| `DATABASE_URL` | `postgresql://...` (de NeonDB) |
| `SLACK_WEBHOOK_URL` | `https://hooks.slack.com/...` (opcional) |

### 3. Deploy

1. Click **Deploy** o hacer push a `main`
2. Vercel automáticamente detecta Next.js y despliega

### 4. Configurar NeonDB para Producción

En NeonDB Dashboard:

1. Ir a **Dashboard** → **Connection Details**
2. Asegurarse que **SSL** está habilitado
3. La connection string ya incluye `?sslmode=require`

### 5. Verificar Deployment

```bash
# Probar endpoint de leads
curl -X POST https://your-project.vercel.app/api/leads \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","whatsapp":"+5491111111111","industria":"gimnasio","problema":"Test de conexion","procesos":["turnos"]}'
```

## Estructura del Proyecto

```
maatwork-web/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── leads/
│   │   │       └── route.ts      # API leads
│   │   ├── globals.css          # Estilos globales
│   │   ├── layout.tsx           # Layout principal
│   │   └── page.tsx             # Landing page
│   ├── components/
│   │   ├── landing/             # Secciones de la landing
│   │   │   ├── hero-section.tsx
│   │   │   ├── trust-badges.tsx
│   │   │   ├── how-it-works.tsx
│   │   │   ├── pricing-section.tsx
│   │   │   ├── testimonials-section.tsx
│   │   │   ├── faq-section.tsx
│   │   │   ├── contact-form.tsx
│   │   │   └── footer.tsx
│   │   ├── three/               # Componentes 3D
│   │   │   └── particles-canvas.tsx
│   │   └── ui/                  # Componentes reutilizables
│   │       ├── navbar.tsx
│   │       ├── scroll-progress.tsx
│   │       └── section-reveal.tsx
│   ├── hooks/
│   │   ├── use-scroll-reveal.ts
│   │   ├── useScrollY.ts
│   │   └── ...
│   └── lib/
│       ├── schemas/
│       │   └── lead.schema.ts   # Zod schema
│       ├── services/
│       │   ├── neon.ts          # NeonDB service
│       │   └── slack.ts         # Slack notifications
│       └── utils.ts
├── public/
├── .env.example
├── package.json
├── README.md
└── CLAUDE.md
```

## Scripts

```bash
npm run dev      # Desarrollo local
npm run build    # Build de producción
npm run start    # Iniciar servidor de producción
npm run lint     # ESLint
```

## Mantenimiento

### Agregar neuevas secciones

1. Crear componente en `src/components/landing/`
2. Importar en `src/app/page.tsx`
3. Usar `<SectionReveal>` para animaciones de scroll

### Modificar Schema de Leads

1. Actualizar `src/lib/schemas/lead.schema.ts`
2. Actualizar SQL en NeonDB
3. Actualizar `src/lib/services/neon.ts` si hay cambios

### Personalizar colores

Editar variables CSS en `src/app/globals.css`:

```css
--color-primary: #6366f1;
--color-background: #04040e;
```

## Licencia

Privado — Maatwork © 2024
