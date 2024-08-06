import React, { useState } from "react";
import { Seguimiento } from "./Seguimiento";
import { EditarTarea } from "./EditarTarea";

import { useDispatch, useSelector } from "react-redux";


export const SeguimientoTabs = ({ id }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [currentStep, setCurrentStep] = useState(0);
  const [editTask, setEditTask] = useState({});

 

  const steps = ["seguimiento", "editar"];

  // Función para renderizar el contenido de acuerdo al paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Seguimiento
            setCurrentStep={setCurrentStep}
            setEditTask={setEditTask}
            currentUser={currentUser}
            id={id}
          />
        );
      case 1:
        return (
          <EditarTarea setCurrentStep={setCurrentStep} editTask={editTask} />
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
