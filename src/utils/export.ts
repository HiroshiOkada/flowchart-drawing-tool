/**
 * Export SVG element to High-Resolution PNG image
 */
export async function exportSvgToPng(
  svgElement: SVGSVGElement,
  filename = 'flowchart.png',
  scale = 2
): Promise<void> {
  const svgRect = svgElement.getBoundingClientRect();
  const width = (svgElement.viewBox.baseVal.width || svgRect.width) * scale;
  const height = (svgElement.viewBox.baseVal.height || svgRect.height) * scale;

  // Clone SVG to avoid mutating DOM during export
  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('width', `${width}`);
  clone.setAttribute('height', `${height}`);

  // Hide UI overlays in cloned SVG (resize handles, anchor points, grid overlays)
  const interactiveOverlays = clone.querySelectorAll('.resize-handles, .anchor-point, .grid-dots, .a4-border-guide');
  interactiveOverlays.forEach((el) => el.remove());

  // Serialize cloned SVG to XML string
  const svgData = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to create 2d canvas context'));
        return;
      }

      // Fill dark background for PNG output
      ctx.fillStyle = '#0b1120';
      ctx.fillRect(0, 0, width, height);

      // Draw SVG image onto canvas
      ctx.drawImage(img, 0, 0, width, height);

      URL.revokeObjectURL(url);

      // Convert canvas to PNG Blob and trigger download
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to convert canvas to blob'));
          return;
        }
        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(pngUrl);
        resolve();
      }, 'image/png');
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}
