import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ReciboPagos } from "./ReciboPagos";
import { Pagos } from "./Pagos";
import { ReciboPagosReactPdf } from "./ReciboPagosReactPdf";

export const PagosTabs = ({id,product}) => {
  const { currentUser } = useSelector((state) => state.user);
  const [currentStep, setCurrentStep] = useState(0);
  const [reciboInfo, setReciboInfo] = useState({});

  const steps = ["pagos", "recibo"];
  // Función para renderizar el contenido de acuerdo al paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <Pagos setCurrentStep={setCurrentStep} setReciboInfo={setReciboInfo} currentUser={currentUser}/>; 
      case 1:
        return <ReciboPagosReactPdf setCurrentStep={setCurrentStep} reciboInfo={reciboInfo} product={product} />; 

      default:
        return null;
    }
  };

  return (
    <>
      {/* EMPIEZA DISEÑO DE STEPPER */}
      <div className="flex flex-col items-center gap-8  mt-1 ">
        {/* Mostrar contenido dinámico según el paso actual */}
        <div className="step-content  p-4 mt-1 ">{renderStepContent()}</div>
      </div>
    </>
  );
};
