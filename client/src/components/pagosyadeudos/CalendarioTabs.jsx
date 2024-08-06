import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendario } from "./Calendario";
import { EditarCal } from "./EditarCal";

export const CalendarioTabs = ({id,product}) => {
  const { currentUser } = useSelector((state) => state.user);
  const [currentStep, setCurrentStep] = useState(0);
  const [editTask, setEditTask] = useState({});

  const steps = ["calendario", "editar"];

  // Función para renderizar el contenido de acuerdo al paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Calendario
            setCurrentStep={setCurrentStep}
            setEditTask={setEditTask}
            currentUser={currentUser}
            id={id}
            product={product}
            
          />
        );
      case 1:
        return (
          <EditarCal setCurrentStep={setCurrentStep} editTask={editTask} />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* EMPIEZA DISEÑO DE STEPPER */}
      <div className="flex flex-col items-center gap-10  ">
        {/* Mostrar contenido dinámico según el paso actual */}
        <div className="step-content  p-4 ">{renderStepContent()}</div>
      </div>
    </>
  );
};
