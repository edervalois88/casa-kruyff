export type Ambiente = "calido" | "dramatico" | "contemporaneo";
export type Tono = "claro" | "oscuro";

export interface RevisionImagen {
  archivo: string;
  ancho: number;
  alto: number;
  ambiente: Ambiente;
  tono: Tono;
}

export const AMBIENTES: Ambiente[] = ["calido", "dramatico", "contemporaneo"];

// 10.jpg queda fuera: es un recorte de 03.jpg.
export const REVISION_IMAGENES: RevisionImagen[] = [
  { archivo: "01.jpg", ancho: 554, alto: 554, ambiente: "calido", tono: "claro" },
  { archivo: "02.jpg", ancho: 226, alto: 223, ambiente: "calido", tono: "claro" },
  { archivo: "03.jpg", ancho: 736, alto: 734, ambiente: "calido", tono: "claro" },
  { archivo: "04.jpg", ancho: 449, alto: 445, ambiente: "calido", tono: "claro" },
  { archivo: "05.jpg", ancho: 447, alto: 447, ambiente: "calido", tono: "claro" },
  { archivo: "06.jpg", ancho: 463, alto: 661, ambiente: "calido", tono: "claro" },
  { archivo: "07.jpg", ancho: 900, alto: 900, ambiente: "dramatico", tono: "oscuro" },
  { archivo: "08.jpg", ancho: 554, alto: 554, ambiente: "dramatico", tono: "oscuro" },
  { archivo: "09.jpg", ancho: 900, alto: 900, ambiente: "dramatico", tono: "claro" },
  { archivo: "11.jpg", ancho: 236, alto: 419, ambiente: "dramatico", tono: "oscuro" },
  { archivo: "12.jpg", ancho: 900, alto: 900, ambiente: "contemporaneo", tono: "claro" },
  { archivo: "13.jpg", ancho: 900, alto: 677, ambiente: "contemporaneo", tono: "oscuro" },
  { archivo: "14.jpg", ancho: 900, alto: 846, ambiente: "contemporaneo", tono: "oscuro" },
  { archivo: "15.jpg", ancho: 415, alto: 739, ambiente: "contemporaneo", tono: "oscuro" },
  { archivo: "16.jpg", ancho: 554, alto: 554, ambiente: "contemporaneo", tono: "claro" },
];
