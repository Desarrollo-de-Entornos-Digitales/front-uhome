import styles from "./Avatar.module.css";

export interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({
  name,
  size = "md",
}: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div
      className={`${styles.avatar} ${styles[size]}`}
      aria-label={name}
      title={name}
    >
      {initials || "U"}
    </div>
  );
}