import { Button } from "../../components/ui/Button";

const colors: Array<[string, string]> = [
  ["--color-primary", "Primary"],
  ["--color-wine", "Wine"],
  ["--color-crimson", "Crimson"],
  ["--color-green", "Green"],
  ["--color-blue", "Blue"],
  ["--color-periwinkle", "Periwinkle"],
  ["--color-sky", "Sky"],
  ["--color-orange", "Orange"],
  ["--color-peach", "Peach"],
  ["--color-lilac", "Lilac"],
  ["--color-purple", "Purple"],
  ["--color-tan", "Tan"],
  ["--color-cream", "Cream"],
  ["--color-page", "Page"],
  ["--color-footer", "Footer"],
];

export default function DesignSystemPage() {
  return (
    <main
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "48px 24px",
        fontFamily: "var(--font-sans)",
        color: "var(--color-ink)",
      }}
    >
      <h1>Design system UHome</h1>

      <h2>Colores</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 16,
        }}
      >
        {colors.map(([variable, name]) => (
          <div key={variable}>
            <div
              style={{
                background: `var(${variable})`,
                height: 72,
                borderRadius: 16,
                border: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            />
            <p style={{ margin: "8px 0 0", fontWeight: 600 }}>{name}</p>
            <code>{variable}</code>
          </div>
        ))}
      </div>

      <h2>Botones</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="primary" loading>
          Cargando
        </Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
      </div>

      <h2>Tamaños</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "center",
        }}
      >
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    </main>
  );
}
