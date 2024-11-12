import { TabsPartners } from "../components/deudaComponents/TabsPartners";
import PartnersProvider from "../context/PartnersContext";
import React from "react";

function Partners() {
  return (
    <>
      <PartnersProvider>
       <TabsPartners/>
      </PartnersProvider>
    </>
  );
}

export default Partners;
