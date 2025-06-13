import { handleResponse } from "@/utils/api";
import ReactDOMServer from "react-dom/server";

const API_URL =
  "https://script.google.com/macros/s/AKfycbxDBOfSUnhWKrcvVYN6WpJTEjBOHXfXYC_1wY91u2mufHPrV8FdAJKgf2lJF7rueA-K/exec";

const defaultPostOptions = (body: any): RequestInit => ({
  method: "POST",
  body: JSON.stringify(body),
});

export async function generatePDF(component: JSX.Element) {
  const htmlString = ReactDOMServer.renderToString(component);

  const res = await fetch(
    API_URL,
    defaultPostOptions({
      action: "generatePDF",
      html: htmlString,
    })
  );

  const data = await handleResponse(res);

  if (!data.success) throw new Error(data.error || "Error generando PDF");

  return data; // ahora devuelve { success: true, url: "https://..." }
}
