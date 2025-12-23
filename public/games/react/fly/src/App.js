import React from "react";
import NeonFlightGame from "./components/NeonFlightGame";

export default function App() {
  return (
    <div className="bg-black w-full min-h-screen">
      <NeonFlightGame />

      <div className="relative z-10">
        <section className="h-screen flex items-center p-8 md:p-20 w-full bg-gradient-to-b from-black to-[#050505] text-white">
          <div className="w-full md:w-1/2">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
              GLASS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
                PRISM
              </span>
            </h2>
            <p className="text-gray-500 max-w-md leading-relaxed">
              Design minimalista e física de voo integrada. Role para baixo para
              explorar os componentes estáticos.
            </p>
          </div>
        </section>

        <section className="h-[50vh] bg-black flex items-center justify-center text-white">
          <p className="font-mono text-gray-700 text-xs tracking-widest">
            END OF PROTOTYPE
          </p>
        </section>
      </div>
    </div>
  );
}
