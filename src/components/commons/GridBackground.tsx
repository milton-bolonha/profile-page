import React from "react";

interface GridBackgroundProps {
    inverted?: boolean;
}

export const GridBackground = ({ inverted = false }: GridBackgroundProps) => {
    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            <div
                className={`
          absolute inset-0 
          bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] 
          bg-[size:100px_100px]
        `}
                style={{
                    maskImage: inverted
                        ? 'linear-gradient(to right, transparent 0%, black 40%, black 100%)' // Inverted: Transparent Left -> Visible Right
                        : 'linear-gradient(to right, black 0%, black 40%, transparent 100%)', // Standard: Visible Left -> Transparent Right
                    WebkitMaskImage: inverted
                        ? 'linear-gradient(to right, transparent 0%, black 40%, black 100%)'
                        : 'linear-gradient(to right, black 0%, black 40%, transparent 100%)'
                }}
            />
        </div>
    );
};
