import Papa from "papaparse";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { LogEntry } from "@/types/domain";

export function exportCsv(entries: LogEntry[], fileName: string) {
  const csv = Papa.unparse(entries);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

export async function exportPdf(container: HTMLElement, fileName: string) {
  const canvas = await html2canvas(container, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  pdf.addImage(imgData, "PNG", 5, 5, 287, 200);
  pdf.save(fileName);
}
