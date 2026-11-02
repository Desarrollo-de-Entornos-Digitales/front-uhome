import type { FooterColumn, FooterContact } from "../components/ui/Footer";
import type { NavbarLink } from "../components/ui/Navbar";

export type Tone =
  | "green"
  | "blue"
  | "orange"
  | "lilac"
  | "periwinkle"
  | "tan"
  | "crimson"
  | "blueStrong"
  | "peach"
  | "pink"
  | "purple"
  | "sky";

export const navLinks: NavbarLink[] = [
  { label: "Funciones", href: "#funciones" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Opiniones", href: "#opiniones" },
];

export const hero = {
  title: "Encuentra vivienda estudiantil con",
  accent: "confianza.",
  text: "Compara precio, distancia, seguridad y reseñas reales de estudiantes, todo en un solo lugar.",
  primaryCta: "Empezar a buscar",
  secondaryCta: "Cómo funciona",
};

export const heroCards: Array<{
  tone: Tone;
  label: string;
  value: string;
  unit: string;
  note: string;
}> = [
  {
    tone: "green",
    label: "Precio",
    value: "$450.000",
    unit: "/ mes",
    note: "Seguridad: 8,7",
  },
  {
    tone: "blue",
    label: "Distancia",
    value: "12 min",
    unit: "caminando",
    note: "900 m del campus",
  },
  {
    tone: "orange",
    label: "Calificación",
    value: "4,5",
    unit: "de 5",
    note: "Basado en 32 estudiantes",
  },
];

export const problem = {
  title: "El problema",
  items: [
    { tone: "blue" as Tone, text: "¿Es seguro?" },
    { tone: "green" as Tone, text: "¿Está bien ubicado?" },
    { tone: "orange" as Tone, text: "¿Vale lo que cuesta?" },
  ],
  note: "Las plataformas tradicionales muestran anuncios.",
  strong: "UHome te ayuda a decidir.",
};

export const features = {
  title: "Funciones principales",
  items: [
    {
      tone: "green" as Tone,
      title: "Búsqueda inteligente",
      text: "Filtros dinámicos por precio, distancia al campus y tipo de vivienda.",
    },
    {
      tone: "blue" as Tone,
      title: "Analizador de ambiente",
      text: "Cómo es la zona de cada vivienda: tranquilidad, vida nocturna y lugares de estudio.",
    },
    {
      tone: "orange" as Tone,
      title: "Favoritos",
      text: "Guarda las viviendas que te interesan y vuelve a ellas cuando quieras.",
    },
    {
      tone: "lilac" as Tone,
      title: "Reseñas de estudiantes",
      text: "Opiniones de otros estudiantes sobre cada vivienda.",
    },
  ],
};

export const steps = {
  title: "¿Cómo funciona?",
  items: [
    { tone: "periwinkle" as Tone, text: "Crea tu perfil" },
    { tone: "green" as Tone, text: "Define tus prioridades" },
    { tone: "orange" as Tone, text: "Elige con confianza" },
  ],
};

export const vibe = {
  title: "¿Qué es el analizador de ambiente?",
  paragraphs: [
    "El analizador de ambiente es un indicador de estilo de vida que te ayuda a entender el entorno de una vivienda, más allá de la distancia o el precio.",
    "En lugar de mostrar solo qué tan lejos queda del campus, analiza la atmósfera de la zona y qué tan bien encaja con tu día a día.",
  ],
  tags: [
    "Porcentaje de estudiantes que viven cerca",
    "Acceso a servicios esenciales",
    "Tranquilidad y espacios para estudiar",
    "Cafés y sitios de estudio cercanos",
    "Nivel de vida nocturna",
  ],
};

export const testimonials = {
  title: "Opiniones de nuestros usuarios",
  items: [
    {
      tone: "green" as Tone,
      text: "Me encanta lo claras que son las publicaciones. Me ahorró mucho tiempo.",
    },
    {
      tone: "tan" as Tone,
      text: "Esta app me ayudó a encontrar un lugar que de verdad se ajusta a lo que necesito.",
    },
    {
      tone: "crimson" as Tone,
      text: "Con esta app fue mucho más fácil encontrar cuarto cerca de la universidad.",
    },
    {
      tone: "blueStrong" as Tone,
      text: "Me mudé en menos de una semana gracias a esta app.",
    },
    {
      tone: "peach" as Tone,
      text: "Habitación amplia y mucha privacidad.",
    },
    {
      tone: "pink" as Tone,
      text: "Convirtió una búsqueda complicada en una experiencia sencilla.",
    },
    {
      tone: "purple" as Tone,
      text: "Me encanta lo fácil que es navegar.",
    },
    {
      tone: "sky" as Tone,
      text: "Agradezco lo detalladas y transparentes que son las publicaciones.",
    },
  ],
};

export const footer: {
  tagline: string;
  columns: FooterColumn[];
  contact: FooterContact;
  copyright: string;
} = {
  tagline: "Encuentra tu lugar, vive a tu manera.",
  columns: [
    {
      title: "Enlaces rápidos",
      links: [
        { label: "Ver viviendas", href: "/properties" },
        { label: "Cómo funciona", href: "/#como-funciona" },
        { label: "Iniciar sesión", href: "/login" },
        { label: "Crear cuenta", href: "/register" },
      ],
    },
    {
      title: "Recursos",
      links: [
        { label: "Guías para estudiantes" },
        { label: "Blog" },
        { label: "Consejos de seguridad" },
        { label: "Soporte" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Política de privacidad" },
        { label: "Términos del servicio" },
        { label: "Política de reembolso" },
      ],
    },
  ],
  contact: {
    email: "info@uhome.com",
    phone: "+57 300 000 0000",
    address: "Bogotá, Colombia",
  },
  copyright: "© 2026 UHome. Todos los derechos reservados.",
};
