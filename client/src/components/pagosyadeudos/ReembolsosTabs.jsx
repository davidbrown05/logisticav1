import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Reembolsos } from "./Reembolsos";
import { ReciboReembolsos } from "./ReciboReembolsos";


export const ReembolsosTabs = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [currentStep, setCurrentStep] = useState(0);
  const [reciboInfo, setReciboInfo] = useState({});

  const steps = ["pagos", "recibo"];
  // Función para renderizar el contenido de acuerdo al paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <Reembolsos setCurrentStep={setCurrentStep} setReciboInfo={setReciboInfo} currentUser={currentUser}/> ; 
      case 1:
        return <ReciboReembolsos setCurrentStep={setCurrentStep} reciboInfo={reciboInfo} /> ; 

      default:
        return null;
    }
  };

  return (
    <>
      {/* EMPIEZA DISEÑO DE STEPPER */}
      <div className="flex flex-col items-center gap-10  mt-1">
        {/* Mostrar contenido dinámico según el paso actual */}
        <div className="step-content  p-4 mt-1">{renderStepContent()}</div>
      </div>
    </>
  );
};

