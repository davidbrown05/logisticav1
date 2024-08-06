import React from "react";

export const VerPropiedadModal = ({ openModal, setopenModal, item }) => {
  return (
    <>
      {openModal && (
        <div
          onClick={() => setopenModal(!openModal)}
          className="w-full h-screen fixed top-0 left-0 bg-[rgba(0,0,0,.5)] flex items-center justify-center overflow-y-auto z-30"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="form-container mt-10 flex flex-col items-center bg-[#f3f4f6] rounded-md"
          >
            <div className="form-header bg-black text-white w-[1000px] h-10 p-2 rounded-tl-md rounded-tr-md flex items-center justify-between">
              <h1> INFORMACION DE LA PROPIEDAD</h1>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setopenModal(!openModal);
                  }}
                  className=" bg-red-500 rounded-lg px-4"
                >
                  Cerrar
                </button>
              </div>
            </div>

            {/* informacion general */}
            <div className="w-[950px] p-5">
              <img src={item.foto} className=" rounded-xl lg:w-[150px]" />
              <div className=" flex flex-col items-start gap-5 mt-5">
              <p>
                <span className="font-bold">CALLE:</span>{" "}
                <span className="text-blue-500">{item.direccion}</span>
              </p>
              <p>
                <span className="font-bold">COLONIA:</span>{" "}
                <span className="text-blue-500">{item.colonia}</span>
              </p>
              <p>
                <span className="font-bold">PRECIO:</span>{" "}
                <span className="text-blue-500">{item.precioFinal}</span>
              </p>
              </div>
            </div>

            {/* descripcion */}
            <div className=" w-full p-5 ">
              <div className="w-full bg-black rounded-md">
                <h3 className=" text-white p-3">DESCRIPCION</h3>
              </div>
              <div className=" flex flex-col items-start gap-5 p-5">
              <p>
                <span className="font-bold">METROS DE TERRENO:</span>{" "}
                <span className="text-blue-500">{item.metrosTerreno}</span>
              </p>
              <p>
                <span className="font-bold">METROS DE CONSTRUCCION:</span>{" "}
                <span className="text-blue-500">{"metros construccion"}</span>
              </p>
              <p>
                <span className="font-bold">NUMERO RECAMARAS:</span>{" "}
                <span className="text-blue-500">{item.numRecamaras}</span>
              </p>
              <p>
                <span className="font-bold">NUMERO BAÑOS:</span>{" "}
                <span className="text-blue-500">{item.numBanos}</span>
              </p>
              <p>
                <span className="font-bold">FORMA DE PAGO:</span>{" "}
                <span className="text-blue-500">{item.formaPago}</span>
              </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
