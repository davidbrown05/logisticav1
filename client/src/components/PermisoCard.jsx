import React, { useState } from "react";

// DnD
import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

export const PermisoCard = ({ permiso }) => {
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: permiso._id,
    data: {
      type: "permiso",
      permiso,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative p-4 mt-8 shadow-md rounded-md cursor-grab border"
    >
      <p>{permiso.permiso}</p>
      <p>Modulo:{permiso.modulo}</p>
    </div>
  );
};
