import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "xsm" | "sm" | "md"; // Button size
  variant?: "primary" | "outline" | "secondary" | "danger" | "rounded"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Additional class names
  type?: "button" | "submit" | "reset"; // Button type
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  type = "button", // Default type is "button"
}) => {
  // Size Classes
  const sizeClasses = {
    xsm: "px-2 py-1 text-xs",
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    rounded:
      "bg-orange-500 text-white shadow-theme-xs hover:bg-orange-600 disabled:bg-orange-300",
    primary:
      "bg-orange-500 text-white shadow-theme-xs hover:bg-orange-600 disabled:bg-orange-300",
    secondary:
      "bg-green-500 text-white shadow-theme-xs hover:bg-green-600 disabled:bg-green-300",
    danger:
      "bg-red-500 text-white shadow-theme-xs hover:bg-red-600 disabled:bg-red-300",
    outline:
      "bg-white text-orange-700 ring-1 ring-inset ring-orange-300 hover:bg-orange-50 dark:bg-gray-800 dark:text-orange-400 dark:ring-orange-700 dark:hover:bg-white/[0.03] dark:hover:text-orange-300",
  };

  return (
    <button
      type={type} // Set the button type
      className={`inline-flex items-center justify-center gap-2 transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        variant === "rounded" ? "rounded-full" : "rounded-lg"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
