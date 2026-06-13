import { toPng } from "html-to-image";

export async function exportNodeAsPng(node: HTMLElement, filename: string) {
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#ffffff",
  });
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
