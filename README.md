# UHome - Frontend

Plataforma web para consultar propiedades y encontrar opciones de alojamiento cerca del campus universitario.

## Tecnologías
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Leaflet y React Leaflet

## Requisitos
- Node.js
- npm
- Backend de UHome en ejecución o desplegado.

## Instalación
Desde la carpeta frontend:
npm install

## Variables de entorno
Configura el archivo .env.local:

NEXT_PUBLIC_API_URL=http://localhost:3001

Para producción:
NEXT_PUBLIC_API_URL=https://uhome-3e5i.onrender.com

No subas .env.local a GitHub.

## Ejecución local
npm run dev

Abre http://localhost:3000

## Compilación
npm run build

## Backend
- Local: http://localhost:3001
- Producción: https://uhome-3e5i.onrender.com

## Despliegue en Vercel
1. Importa el repositorio desde GitHub.
2. Configura frontend como Root Directory.
3. Agrega NEXT_PUBLIC_API_URL con la URL del backend de producción.
4. Despliega y verifica que se puedan consultar las propiedades.

## Estructura
- src/app
- src/components
- src/hooks
- src/services
- src/styles
- public

## Feed de propiedades (`/properties`)
Ruta protegida (requiere sesión). Muestra las propiedades reales del backend en tarjetas con nombre, tipo, disponibilidad, dirección, calificación promedio de reseñas (si existen), descripción, amenidades, precio mensual y distancia al campus. Cada tarjeta lleva al detalle (`/properties/:id`) y tiene un botón para agregar o quitar favoritos.

El backend no guarda imágenes de las propiedades, por eso la tarjeta muestra un espacio ilustrativo en lugar de una foto.

### Búsqueda y filtros
El estado de la búsqueda, los filtros y la página se guarda en la URL (`?q=&type=&lifestyle=&maxPrice=&maxDistance=&page=`), así que se puede compartir el enlace y volver atrás sin perder la búsqueda.

| Filtro | Dónde se aplica | Detalle |
| --- | --- | --- |
| Precio máximo | Backend | `GET /properties?maxPrice=` |
| Distancia al campus | Backend | `GET /properties?maxDistance=` (en metros) |
| Tipo de vivienda | Frontend | Opciones de `GET /property-types`; filtra por `propertyTypeId` |
| Estilo de vida | Frontend | Usa `GET /vibe-analysis`: una propiedad cumple el estilo si el indicador correspondiente es ≥ 4 (escala 1-5). Las propiedades sin análisis no aparecen con este filtro activo |
| Búsqueda | Frontend | Busca cada palabra en nombre, descripción, dirección, tipo y amenidades, sin distinguir mayúsculas ni tildes |

El backend solo soporta `maxPrice` y `maxDistance`; los demás filtros se aplican sobre la lista que devuelve.

### Paginación
El backend no pagina `GET /properties`, así que la paginación se hace en el frontend: 6 propiedades por página sobre los resultados ya filtrados. Las propiedades se deduplican por `id` antes de paginar. Al cambiar un filtro se vuelve a la página 1.

## Favoritos (`/favorites`)
Ruta protegida que lista las propiedades guardadas por el usuario autenticado, con las mismas tarjetas del feed. Los favoritos se guardan en el backend:

| Acción | Endpoint |
| --- | --- |
| Consultar | `GET /favorites/user/:userId` |
| Agregar | `POST /favorites` con `{ propertyId }` (el usuario se toma del token JWT) |
| Quitar | `DELETE /favorites/user/:userId/property/:propertyId` |

- Todas las peticiones llevan el token JWT mediante `apiRequest` (`src/services/api.ts`).
- Después de agregar o quitar se vuelve a consultar la lista para que la interfaz refleje el estado real del backend.
- El backend solo permite favoritos a los roles `student` y `admin`. A otros roles no se les muestra el botón de favoritos y `/favorites` muestra un aviso.
- Como `GET /favorites/user/:userId` no incluye el tipo ni las amenidades de la propiedad, esa información se completa con `GET /properties`.
- Hay estados de carga, error con reintento y lista vacía.

## Componentes reutilizables
En `src/components/ui`:
- `Card`, `CardHeader`, `CardBody`, `CardFooter`: contenedor de tarjeta y sus secciones.
- `Badge`: etiqueta con tonos basados en los colores de UHome.
- `RatingStars`: estrellas con decimales, valor y número de reseñas.
- `Pagination`: controles anterior/siguiente, números de página con elipsis e indicador de página actual.
- `EmptyState`: estado vacío o de error con acción opcional.
- `icons.tsx`: íconos SVG usados en el feed.

En `src/components/properties`: `PropertyCard`, `PropertyGrid`, `PropertyFilters`, `FavoriteButton`, `PropertiesFeed` y `FavoritesView`.
Hooks en `src/hooks`: `useFavorites` (favoritos del usuario) y `useAsync` (carga de datos con reintento).

> En desarrollo, el backend desplegado solo acepta CORS desde los orígenes que tiene configurados (por ejemplo `http://localhost:3000`). Si usas otro puerto, las peticiones fallarán.
