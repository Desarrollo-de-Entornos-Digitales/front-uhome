"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

import { Avatar } from "../../components/ui/Avatar";
import { Badge, type BadgeTone } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { HeartIcon, MapPinIcon, SearchIcon } from "../../components/ui/icons";
import { InputPassword } from "../../components/ui/InputPassword";
import { InputText } from "../../components/ui/InputText";
import { Pagination } from "../../components/ui/Pagination";
import { RatingStars } from "../../components/ui/RatingStars";

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

const badgeTones: Array<[BadgeTone, string]> = [
  ["neutral", "Neutral"],
  ["price", "$1.200.000"],
  ["type", "apartamento"],
  ["distance", "650 m"],
  ["lifestyle", "Tranquilo"],
  ["success", "Disponible"],
  ["muted", "No disponible"],
];

const rowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 16,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: 16,
};

const captionStyle: CSSProperties = {
  margin: "0 0 8px",
  fontSize: "var(--text-sm)",
  color: "var(--color-disabled-text)",
};

export default function DesignSystemPage() {
  const [currentPage, setCurrentPage] = useState(3);

  return (
    <div style={{ flex: 1, background: "var(--color-page)" }}>
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

        <h2>InputText</h2>
        <div style={gridStyle}>
          <InputText
            id="ds-text-normal"
            label="Normal"
            placeholder="tu.correo@uhome.com"
          />
          <InputText
            id="ds-text-error"
            label="Con error"
            defaultValue="correo-invalido"
            error="Escribe un correo válido."
          />
          <InputText
            id="ds-text-disabled"
            label="Deshabilitado"
            defaultValue="ana.torres@uhome.com"
            disabled
          />
        </div>

        <h2>InputPassword</h2>
        <div style={gridStyle}>
          <InputPassword
            id="ds-password-normal"
            label="Normal"
            placeholder="Tu contraseña"
          />
          <InputPassword
            id="ds-password-error"
            label="Con error"
            defaultValue="123"
            error="La contraseña debe tener al menos 8 caracteres."
          />
          <InputPassword
            id="ds-password-disabled"
            label="Deshabilitado"
            defaultValue="Uhome1234"
            disabled
          />
        </div>

        <h2>Badge</h2>
        <p style={captionStyle}>Tonos (tamaño md)</p>
        <div style={rowStyle}>
          {badgeTones.map(([tone, label]) => (
            <Badge key={tone} tone={tone}>
              {label}
            </Badge>
          ))}
        </div>
        <p style={{ ...captionStyle, marginTop: 16 }}>Tamaño sm y con ícono</p>
        <div style={rowStyle}>
          <Badge tone="distance" size="sm" icon={<MapPinIcon size={14} />}>
            650 m del campus
          </Badge>
          <Badge tone="price" size="sm">
            $900.000
          </Badge>
          <Badge tone="lifestyle" size="sm" icon={<HeartIcon size={14} />}>
            Social
          </Badge>
        </div>

        <h2>Card</h2>
        <div style={gridStyle}>
          <Card>
            <CardHeader>
              <strong>Card básica</strong>
            </CardHeader>
            <CardBody>
              <p style={{ margin: 0 }}>
                Contenedor con encabezado, cuerpo y pie.
              </p>
            </CardBody>
            <CardFooter>
              <Badge tone="price">$1.200.000</Badge>
              <Button size="sm" variant="outline">
                Ver más
              </Button>
            </CardFooter>
          </Card>
          <Card interactive>
            <CardHeader>
              <strong>Card interactiva</strong>
            </CardHeader>
            <CardBody>
              <p style={{ margin: 0 }}>Se eleva al pasar el cursor.</p>
            </CardBody>
          </Card>
        </div>

        <h2>RatingStars</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <RatingStars value={4.5} count={12} />
          <RatingStars value={3.2} size="sm" count={1} />
          <RatingStars value={2.7} showValue={false} />
        </div>

        <h2>Avatar</h2>
        <div style={rowStyle}>
          <Avatar name="Ana Torres" size="sm" />
          <Avatar name="Carlos Mendoza" size="md" />
          <Avatar name="Laura Gómez" size="lg" />
        </div>

        <h2>Pagination</h2>
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
        />

        <h2>EmptyState</h2>
        <div style={gridStyle}>
          <EmptyState
            icon={<SearchIcon size={26} />}
            title="No encontramos propiedades"
            description="Prueba con otros filtros de precio o distancia."
            action={
              <Button size="sm" variant="accent">
                Limpiar filtros
              </Button>
            }
          />
          <EmptyState
            tone="error"
            title="No pudimos cargar la información"
            description="Revisa tu conexión e inténtalo de nuevo."
            action={
              <Button size="sm" variant="accent">
                Reintentar
              </Button>
            }
          />
        </div>
      </main>
    </div>
  );
}
