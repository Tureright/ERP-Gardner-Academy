import columns from "./Home/schema";

const Settings = () => {
  async function postInvoices() {
    try {
      console.log("hola");
      const respuesta = await fetch(
        "https://script.google.com/macros/s/AKfycbwwuh0nEZrzCr1Md4NWprm95lPer_-emT6zunYLWVGt1LGkm5ArOpQ85LCRFL2uAtVNKg/exec?path=createItem",
        {
          method: "POST", // Solicitud,
          /*
          headers: {
            'Content-Type': 'application/json', // Especifica que los datos enviados son en formato JSON
          },*/
          body: JSON.stringify({
            establecimiento: "001",
            punto_emision: "001",
            fecha_emision: "2025-03-28",
            guia_remision: null,
            es_borrador: true,
          }),
        }
      );

      // Manejo de la respuesta

      const json = await respuesta.json();
      console.log(json, "json");
      console.log(json.errorResponse, "json");
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <p className="color-primary bg-red-500 p-4">This is a test</p>
      <button
        onClick={() => postInvoices()}
        className="bg-blue-500 text-white p-4 rounded-lg"
      >
        alert
      </button>
    </>
  );
};

export default Settings;
