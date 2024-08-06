import React, { useState } from "react";
import { useDrag } from "react-dnd";

export const PermitCard = ({permiso}) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "permiso",
        item: { id: permiso._id },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        }),
      }));
    
      console.log("isDraggin", isDragging);
    
      return (
        <div
          ref={drag}
          className={`relative p-4 mt-8 shadow-md rounded-md cursor-grab border bg-white  ${
            isDragging ? "opacity-50 cursor-grab" : "opacity-100 cursor-grab"
          }`}
        >
          <p className=" font-bold underline">{permiso.permiso}</p>
          <span className=" font-semibold">Modulo:</span> <span className=" font-medium text-blue-600">{permiso.modulo}</span>
        </div>
      );
}
