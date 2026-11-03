import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/Card";
import { HomeIcon, MapPinIcon, WalkIcon } from "@/components/ui/icons";
import { RatingStars } from "@/components/ui/RatingStars";
import type { PropertyRating, PropertySummary } from "@/services/properties";
import { formatDistance, formatPrice } from "@/utils/format";

import { FavoriteButton } from "./FavoriteButton";
import styles from "./PropertyCard.module.css";

const VISIBLE_AMENITIES = 3;

export interface PropertyCardFavorite {
  active: boolean;
  pending: boolean;
  onToggle: () => void;
}

export interface PropertyCardProps {
  property: PropertySummary;
  /** Promedio de reseñas reales; se omite si no hay reseñas. */
  rating?: PropertyRating | null;
  /** Sin este prop la tarjeta no muestra el botón de favoritos. */
  favorite?: PropertyCardFavorite;
}

export function PropertyCard({ property, rating, favorite }: PropertyCardProps) {
  const amenities = property.amenities ?? [];
  const hiddenAmenities = amenities.length - VISIBLE_AMENITIES;
  const typeName = property.propertyType?.name;

  return (
    <Card interactive className={styles.card}>
      <div className={styles.media}>
        <HomeIcon size={44} className={styles.mediaIcon} />
        {favorite ? (
          <FavoriteButton
            className={styles.favorite}
            propertyName={property.name}
            active={favorite.active}
            pending={favorite.pending}
            onToggle={favorite.onToggle}
          />
        ) : null}
      </div>

      <CardHeader>
        <div className={styles.badges}>
          {typeName ? (
            <Badge tone="type" size="sm">
              {typeName}
            </Badge>
          ) : null}
          <Badge tone={property.available ? "success" : "muted"} size="sm">
            {property.available ? "Disponible" : "No disponible"}
          </Badge>
        </div>

        <h3 className={styles.title}>
          <Link href={`/properties/${property.id}`} className={styles.link}>
            {property.name}
          </Link>
        </h3>

        <p className={styles.address}>
          <MapPinIcon size={16} className={styles.addressIcon} />
          <span>{property.address}</span>
        </p>
      </CardHeader>

      <CardBody>
        {rating ? (
          <RatingStars value={rating.average} count={rating.count} size="sm" />
        ) : (
          <p className={styles.noRating}>Sin reseñas todavía</p>
        )}

        <p className={styles.description}>{property.description}</p>

        {amenities.length > 0 ? (
          <ul className={styles.amenities} aria-label="Amenidades">
            {amenities.slice(0, VISIBLE_AMENITIES).map((amenity) => (
              <li key={amenity.id}>
                <Badge size="sm">{amenity.name}</Badge>
              </li>
            ))}
            {hiddenAmenities > 0 ? (
              <li>
                <Badge size="sm" tone="price">
                  +{hiddenAmenities}
                </Badge>
              </li>
            ) : null}
          </ul>
        ) : null}
      </CardBody>

      <CardFooter>
        <p className={styles.price}>
          {formatPrice(property.price)}
          <span className={styles.period}> / mes</span>
        </p>
        <Badge tone="distance" size="sm" icon={<WalkIcon size={14} />}>
          {formatDistance(property.distanceToCampus)} del campus
        </Badge>
      </CardFooter>
    </Card>
  );
}
