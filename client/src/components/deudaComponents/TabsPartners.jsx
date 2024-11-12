import React, { useRef, useState, useContext, useEffect } from "react";
import { Partners } from "./Partners";
//import { DeudaGlobal } from "./DeudaGlobal";
import { CrearPartner } from "./CrearPartner";
import { EditarPartner } from "./EditarPartner";
import { PartnersContext } from "../../context/PartnersContext";
import { PartnerInfo } from "./PartnerInfo";
import { EditPago } from "./EditPago";
import { NuevaRonda } from "./NuevaRonda";
import { FinalizarRonda } from "./FinalizarRonda";
import { PagosFinalestabs } from "./PagosFinalestabs";
import { LoaderModal } from "../LoaderModal";
import { LoaderContext } from "../../context/LoaderContext";
import { RondaAmortizacion } from "./RondaAmortizacion";
import { TabsRondaAmortizacion } from "./TabsRondaAmortizacion";
import { CrearPartnerV1 } from "./CrearPartnerV1";

export const TabsPartners = () => {
    const { partners, loadingPartners, setPartners } =
    useContext(PartnersContext);
    const {setloaderContext} = useContext(LoaderContext)
  const [partnersData, setPartnersData] = useState(partners);
  const [selectedTab, setSelectedTab] = useState(0);
  const [partnerInfo, setpartnerInfo] = useState({});
  const [pagos, setPagos] = useState([]);
  const [pagoData, setpagoData] = useState({});
  const [pagoIndex, setpagoIndex] = useState(0);
  const [corridaIndex, setcorridaIndex] = useState(0);
  const [corridas, setCorridas] = useState([]);

  const firstBtnRef = useRef();

  useEffect(() => {
    console.log("partners", partners);
    // Actualizar partnersData cuando partners cambie
    setPartnersData(partners);
  }, [partners]);

  const data = [
   
    {
      label: "PARTNERS",
      value: "PARTNERS",
    },
  ];

  const handleTabClick = (index) => {
    setSelectedTab(index);
  };

  // Función para renderizar el contenido de acuerdo al paso actual
  const renderStepContent = () => {
    switch (selectedTab) {
      case 1:
        return <div>nada</div>;
      case 0:
        return (
          <Partners
            setSelectedTab={setSelectedTab}
            setpartnerInfo={setpartnerInfo}
            partnersData={partnersData}
            partners={partners}
            setPartners={setPartners}
            setcorridaIndex={setcorridaIndex}
            setCorridas={setCorridas}
          />
        );
      case 2:
        return (
          <CrearPartnerV1
            setSelectedTab={setSelectedTab}
            partners={partners}
            setPartners={setPartners}
            setloaderContext={setloaderContext}
          /> 
        );
      case 3:
        return (
          <EditarPartner
            setSelectedTab={setSelectedTab}
            partnerInfo={partnerInfo}
            partners={partners}
            setPartners={setPartners}
            corridaIndex={corridaIndex}
            setpartnerInfo={setpartnerInfo}
          />
        );
      case 4:
        return (
          <PartnerInfo
            setSelectedTab={setSelectedTab}
            partnerInfo={partnerInfo}
            setpartnerInfo={setpartnerInfo}
            partners={partners}
            setPartners={setPartners}
            pagos={pagos}
            setPagos={setPagos}
            setpagoData={setpagoData}
            setpagoIndex={setpagoIndex}
            corridaIndex={corridaIndex}
            setcorridaIndex={setcorridaIndex}
          />
        );
      case 5:
        return (
          <EditPago
            setSelectedTab={setSelectedTab}
            partnerInfo={partnerInfo}
            setpartnerInfo={setpartnerInfo}
            partners={partners}
            setPartners={setPartners}
            pagoData={pagoData}
            pagoIndex={pagoIndex}
            corridaIndex={corridaIndex}
            setloaderContext={setloaderContext}
          />
        );
      case 6:
        return (
          <NuevaRonda
            setSelectedTab={setSelectedTab}
            partnerInfo={partnerInfo}
            partners={partners}
            setPartners={setPartners}
            corridaIndex={corridaIndex}
          />
        );
      case 7:
        return (
          <TabsRondaAmortizacion
            setSelectedTab={setSelectedTab}
            setpartnerInfo={setpartnerInfo}
            partnerInfo={partnerInfo}
            partners={partners}
            setPartners={setPartners}
            corridaIndex={corridaIndex}
            setloaderContext={setloaderContext}
          />  
        );
      case 8:
        return (
          <PagosFinalestabs
            setSelectedTab={setSelectedTab}
            partnerInfo={partnerInfo}
            setpartnerInfo={setpartnerInfo}
            partners={partners}
            setPartners={setPartners}
            pagoData={pagoData}
            pagoIndex={pagoIndex}
            corridaIndex={corridaIndex}
            setloaderContext={setloaderContext}
          />
        );

      default:
        return null;
    }
  };
  return (
    <>
      {/* EMPIEZA EL CODIGO DE DISEÑO PARA TABS */}
      <div className="flex p-3 justify-between items-center gap-x-2 bg-gray-200 overflow-x-auto ">
        {data.map((item, index) => (
          <button
            ref={index === selectedTab ? firstBtnRef : null}
            key={index}
            onClick={() => handleTabClick(index)}
            className={`outline-none w-full p-2 hover:bg-gray-300 hover:text-black rounded-xl text-center  ${
              selectedTab === index ? "  bg-black text-white" : ""
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {/* TERMINA DISEÑO DE TABS */}
      {/* EMPIEZA DISEÑO DE STEPPER */}
      <div className="flex flex-col items-center gap-10  mt-1">
        {/* Mostrar contenido dinámico según el paso actual */}
        <div className="step-content  p-4 mt-1">{renderStepContent()}</div>
      </div>
      <LoaderModal/>
    </>
  );
}
