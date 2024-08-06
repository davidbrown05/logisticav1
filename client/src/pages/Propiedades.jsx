import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PropiedadesTable } from "../components/PropiedadesTable";
import { SearchControllers } from "../components/SearchControllers";
import { JuridicoThunk } from "../components/JuridicoThunk";
import { PostsList } from "../components/PostsList";

import { LatePaymentsListe } from "../components/LatePaymentsListe";

export const Propiedades = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log("CurrentUserPropiedades", currentUser);
  return (
    <>
      <div className="flex flex-col items-center p-5">
        <SearchControllers />
        <div className="flex flex-col items-start">
          <PropiedadesTable />
          <div className="flex p-5">
            <PostsList />
            <LatePaymentsListe />
          </div>
        </div>
      </div>
    </>
  );
};
