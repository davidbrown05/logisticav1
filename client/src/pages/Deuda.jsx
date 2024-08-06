import React from "react";
//import useParams
import { Link, useParams } from "react-router-dom";
import { TabsDeuda } from "../components/deudaComponents/TabsDeuda";
import PartnersProvider from "../context/PartnersContext";

export const Deuda = () => {
  //get product id from url
  const { id } = useParams();
  console.log(id);
  return (
    <>
      <PartnersProvider>
        <TabsDeuda></TabsDeuda>
      </PartnersProvider>
    </>
  );
};
