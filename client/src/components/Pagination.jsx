import React, { useContext } from "react";
import { InmuebleContext } from "../context/InmuebleContext";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

export const Pagination = () => {
  const { page, setPage, totalPages, fetchProducts } =
    useContext(InmuebleContext);

  const handlePreviousPage = () => {
    if (page > 1) {
      fetchProducts(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      fetchProducts(page + 1);
    }
  };

  return (
    <div className=" mt-5 flex items-center gap-5">
      <button className="flex items-center" onClick={handlePreviousPage} disabled={page === 1}>
        <GrFormPrevious />
        Regresar
      </button>
      <span className=" font-semibold">
        Pagina {page} de {totalPages}
      </span>
      <button className="flex items-center" onClick={handleNextPage} disabled={page === totalPages}>
        Siguiente
        <GrFormNext />
      </button>
    </div>
  );
};
