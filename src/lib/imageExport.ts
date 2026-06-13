import { toPng } from "html-to-image";

export async function exportNodeAsPng(node: HTMLElement, filename: string) {
  await waitForExportAssets(node);

  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#ffffff",
  });
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function waitForExportAssets(node: HTMLElement) {
  const fontReady = "fonts" in document ? document.fonts.ready.catch(() => undefined) : Promise.resolve();
  const imagePromises = Array.from(node.querySelectorAll("img")).map((image) => {
    if (image.complete && image.naturalWidth > 0) return Promise.resolve();
    return image.decode().catch(() => undefined);
  });

  await Promise.all([fontReady, ...imagePromises]);
}
