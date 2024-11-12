import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PropiedadesTable } from "../components/PropiedadesTable";
import { SearchControllers } from "../components/SearchControllers";
import { JuridicoThunk } from "../components/JuridicoThunk";
import { PostsList } from "../components/PostsList";

import { LatePaymentsListe } from "../components/LatePaymentsListe";
import { JuridicoNotPreview } from "../components/JuridicoNotPreview";
import PagosNotPreview from "../components/PagosNotPreview";
//import { Button } from "@/components/ui/button";
import{Button} from ".././components/ui/button"
import { RecordatoriosNot } from "../components/RecordatoriosNot";
import InmuebleProvider from "../context/InmuebleContext"

export const Propiedades = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log("CurrentUserPropiedades", currentUser);
  return (
    <>
    <InmuebleProvider>
      <div className="flex flex-col items-center p-5 ">
        <SearchControllers />
       
        <div className="flex flex-col items-start">
          <PropiedadesTable />
          <div className="flex flex-col lg:flex-row p-5">
            {/* <PostsList /> */}
            <JuridicoNotPreview/>
            {/* <LatePaymentsListe /> */}
            <PagosNotPreview/>
            <RecordatoriosNot/>
          </div>
        </div>
      </div>
      </InmuebleProvider>
    </>
  );
};
