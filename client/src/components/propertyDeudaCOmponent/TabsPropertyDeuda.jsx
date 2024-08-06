import React, { useState, useEffect, useRef, useContext } from "react";
import { PropertyDeudaLista } from "./PropertyDeudaLista";
import { EditPropertyDeuda } from "./EditPropertyDeuda";
import { PropertyDeudaContext } from "../../context/PropertyDeudaContext";

export const TabsPropertyDeuda = ({ id,product }) => {
  const { propertyDeuda, setpropertyDeuda, loadingPropertyDeuda } =
    useContext(PropertyDeudaContext);
  const [propertyDeudaData, setpropertyDeudaData] = useState(propertyDeuda);

  const [selectedTab, setSelectedTab] = useState(0);
  const firstBtnRef = useRef();

  const [currentStep, setcurrentStep] = useState(0);
  const [deudaInfo, setdeudaInfo] = useState({});

  const [pagoIndex, setpagoIndex] = useState(0);
  const [deudaListaIndex, setdeudaListaIndex] = useState(0);

  const [checkpropertyDeuda, setCheckpropertyDeuda] = useState(false);
  const [checkpropertyDeudaDelete, setcheckpropertyDeudaDelete] =
    useState(false);
  const [loadingUpload, setloadingUpload] = useState(false);

  const data = [
    {
      label: "DEUDAS DE LA PROPIEDAD",
      value: "DEUDAS DE LA PROPIEDAD",
    },
  ];

  const handleTabClick = (index) => {
    setcurrentStep(index);
  };

  // Función para renderizar el contenido de acuerdo al paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <PropertyDeudaLista
            id={id}
            currentStep={currentStep}
            setcurrentStep={setcurrentStep}
            setdeudaInfo={setdeudaInfo}
            propertyDeudaData={propertyDeudaData}
            setpropertyDeudaData={setpropertyDeudaData}
            setpropertyDeuda={setpropertyDeuda}
            setdeudaListaIndex={setdeudaListaIndex}
            checkpropertyDeuda={checkpropertyDeuda}
            checkpropertyDeudaDelete={checkpropertyDeudaDelete}
            setCheckpropertyDeuda={setCheckpropertyDeuda}
            setcheckpropertyDeudaDelete={setcheckpropertyDeudaDelete}
            loadingUpload={loadingUpload}
            setloadingUpload={setloadingUpload}
            product={product}
          />
        );
      case 1:
      
        return (
          <EditPropertyDeuda
            id={id}
            currentStep={currentStep}
            setcurrentStep={setcurrentStep}
            deudaInfo={deudaInfo}
            setdeudaInfo={setdeudaInfo}
            setpropertyDeudaData={ setpropertyDeudaData}
            setpropertyDeuda={setpropertyDeuda}
            propertyDeudaData={propertyDeudaData}
            deudaListaIndex={deudaListaIndex}
            checkpropertyDeuda={checkpropertyDeuda}
            checkpropertyDeudaDelete={checkpropertyDeudaDelete}
            setCheckpropertyDeuda={setCheckpropertyDeuda}
            setcheckpropertyDeudaDelete={setcheckpropertyDeudaDelete}
            loadingUpload={loadingUpload}
            setloadingUpload={setloadingUpload}
          />
        );

      default:
        return null;
    }
  };
  return (
    <>
      {/* EMPIEZA EL CODIGO DE DISEÑO PARA TABS */}
      <div className="flex p-3 justify-between items-center gap-x-2 bg-gray-200 overflow-x-auto ">
        {data.map((item, index) => (
          <button
            ref={index === currentStep ? firstBtnRef : null}
            key={index}
            onClick={() => handleTabClick(index)}
            className={`outline-none w-full p-2 hover:bg-gray-300 hover:text-black rounded-xl text-center  ${
              selectedTab === index ? "  bg-black text-white" : ""
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {/* TERMINA DISEÑO DE TABS */}
      {/* EMPIEZA DISEÑO DE STEPPER */}
      <div className="flex flex-col items-center gap-10  mt-1">
        {/* Mostrar contenido dinámico según el paso actual */}
        <div className="step-content  p-4 mt-1">{renderStepContent()}</div>
      </div>
    </>
  );
};
