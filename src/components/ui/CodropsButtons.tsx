import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "winona" | "ujarak" | "wayra" | "tamaya" | "default";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

// Winona Button - Effect from ButtonStylesInspiration
export const WinonaButton: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "winona",
  size = "md",
  ...props
}) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(
        "relative overflow-hidden border-2 border-primary bg-transparent text-primary font-semibold rounded-lg transition-all duration-300",
        "hover:text-white hover:bg-primary",
        "before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-primary before:-translate-x-full hover:before:translate-x-0",
        "before:transition-transform before:duration-300 before:ease-out",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

// Ujarak Button - Border animation effect
export const UjarakButton: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "ujarak",
  size = "md",
  ...props
}) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(
        "relative border-2 border-primary bg-transparent text-primary font-semibold rounded-lg overflow-hidden group",
        "hover:text-white transition-colors duration-300",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </button>
  );
};

// Wayra Button - Corner animation
export const WayraButton: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "wayra",
  size = "md",
  ...props
}) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(
        "relative border-2 border-primary bg-transparent text-primary font-semibold rounded-lg overflow-hidden group",
        "hover:text-white transition-colors duration-300",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {/* Corner animations */}
      <div className="absolute top-0 left-0 w-0 h-0 border-l-2 border-t-2 border-primary group-hover:w-4 group-hover:h-4 transition-all duration-300"></div>
      <div className="absolute top-0 right-0 w-0 h-0 border-r-2 border-t-2 border-primary group-hover:w-4 group-hover:h-4 transition-all duration-300"></div>
      <div className="absolute bottom-0 left-0 w-0 h-0 border-l-2 border-b-2 border-primary group-hover:w-4 group-hover:h-4 transition-all duration-300"></div>
      <div className="absolute bottom-0 right-0 w-0 h-0 border-r-2 border-b-2 border-primary group-hover:w-4 group-hover:h-4 transition-all duration-300"></div>
      <div className="absolute inset-0 bg-primary transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100"></div>
    </button>
  );
};

// Tamaya Button - Text animation
export const TamayaButton: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "tamaya",
  size = "md",
  ...props
}) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(
        "relative border-2 border-primary bg-transparent text-primary font-semibold rounded-lg overflow-hidden group",
        "hover:text-white transition-colors duration-300",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span className="relative z-10 transform group-hover:translate-x-1 transition-transform duration-300">
        {children}
      </span>
      <div className="absolute inset-0 bg-primary transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
    </button>
  );
};

// Magnetic Button Effect
export const MagneticButton: React.FC<ButtonProps> = ({
  children,
  className,
  ...props
}) => {
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "translate(0px, 0px)";
  };

  return (
    <button
      className={cn(
        "bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};

// Ripple Button Effect
export const RippleButton: React.FC<ButtonProps> = ({
  children,
  className,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple-effect");

    const ripple = button.getElementsByClassName("ripple-effect")[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  };

  return (
    <button
      className={cn(
        "relative overflow-hidden bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
      <style jsx>{`
        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.6);
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        }

        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
};

// Main Button Component with variants
export const CodropsButton: React.FC<ButtonProps> = ({
  variant = "default",
  ...props
}) => {
  switch (variant) {
    case "winona":
      return <WinonaButton {...props} />;
    case "ujarak":
      return <UjarakButton {...props} />;
    case "wayra":
      return <WayraButton {...props} />;
    case "tamaya":
      return <TamayaButton {...props} />;
    default:
      return (
        <button
          className={cn(
            "bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105",
            props.className
          )}
          {...props}
        >
          {props.children}
        </button>
      );
  }
};

export default CodropsButton;
