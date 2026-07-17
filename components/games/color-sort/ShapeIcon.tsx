import type { Shape } from "./levels";

export default function ShapeIcon({
  shape,
  color,
  size = 56,
}: {
  shape: Shape;
  color: string;
  size?: number;
}) {
  const props = { width: size, height: size, viewBox: "0 0 100 100", "aria-hidden": true };

  switch (shape) {
    case "circle":
      return (
        <svg {...props}>
          <circle cx="50" cy="50" r="45" fill={color} />
        </svg>
      );
    case "square":
      return (
        <svg {...props}>
          <rect x="8" y="8" width="84" height="84" rx="16" fill={color} />
        </svg>
      );
    case "triangle":
      return (
        <svg {...props}>
          <polygon points="50,8 94,88 6,88" fill={color} />
        </svg>
      );
    case "star":
      return (
        <svg {...props}>
          <polygon
            points="50,4 61,37 96,37 68,58 78,92 50,71 22,92 32,58 4,37 39,37"
            fill={color}
          />
        </svg>
      );
    case "heart":
      return (
        <svg {...props}>
          <path
            d="M50 90 C18 66 4 44 4 27 C4 11 17 1 31 1 C41 1 50 8 50 20 C50 8 59 1 69 1 C83 1 96 11 96 27 C96 44 82 66 50 90 Z"
            fill={color}
          />
        </svg>
      );
  }
}
