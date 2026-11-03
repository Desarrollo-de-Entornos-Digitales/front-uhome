import type { NavbarLink } from "../components/ui/Navbar";

/** Enlaces del navbar en las pantallas autenticadas. */
export const appNavLinks: NavbarLink[] = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/properties" },
  { label: "Favorites", href: "/favorites" },
];
