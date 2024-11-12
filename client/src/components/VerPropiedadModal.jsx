import React, { useEffect } from "react";

export const VerPropiedadModal = ({ openModal, setopenModal, item }) => {

  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openModal]);

  return (
    <>
      {openModal && (
        <div
          onClick={() => setopenModal(!openModal)}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-4 sm:pt-8 md:pt-16 lg:pt-24 z-30"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#f3f4f6] rounded-md w-full max-w-[300px] sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] mx-4 mb-4"
          >
            <div className="bg-black text-white p-2 rounded-t-md flex items-center justify-between">
              <h1 className="text-sm sm:text-base">INFORMACION DE LA PROPIEDAD</h1>
              <button
                onClick={() => setopenModal(!openModal)}
                className="bg-red-500 rounded-lg px-4 py-1 text-sm"
              >
                Cerrar
              </button>
            </div>

            <div className="max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-10rem)] md:max-h-[calc(100vh-12rem)] lg:max-h-[calc(100vh-14rem)] overflow-y-auto">
              <div className="p-4 sm:p-5">
                <img src={item.foto} className="rounded-xl w-full max-w-[150px] mx-auto mb-4" alt="Propiedad" />
                <div className="space-y-3 sm:space-y-4">
                  <p><span className="font-bold">CALLE:</span> <span className="text-blue-500">{item.direccion}</span></p>
                  <p><span className="font-bold">COLONIA:</span> <span className="text-blue-500">{item.colonia}</span></p>
                  <p><span className="font-bold">PRECIO:</span> <span className="text-blue-500">{item.precioFinal}</span></p>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <div className="w-full bg-black rounded-md mb-4">
                  <h3 className="text-white p-3">DESCRIPCION</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <p><span className="font-bold">METROS DE TERRENO:</span> <span className="text-blue-500">{item.metrosTerreno}</span></p>
                  <p><span className="font-bold">METROS DE CONSTRUCCION:</span> <span className="text-blue-500">{"metros construccion"}</span></p>
                  <p><span className="font-bold">NUMERO RECAMARAS:</span> <span className="text-blue-500">{item.numRecamaras}</span></p>
                  <p><span className="font-bold">NUMERO BAÑOS:</span> <span className="text-blue-500">{item.numBanos}</span></p>
                  <p><span className="font-bold">FORMA DE PAGO:</span> <span className="text-blue-500">{item.formaPago}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
