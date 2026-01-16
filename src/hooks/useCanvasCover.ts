import { useEffect, useState, useCallback, RefObject } from "react";
import { CoverSettings, CANVAS_SIZE } from "../constants/cover";

export const useCanvasCover = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  settings: CoverSettings
) => {
  const [paeImage, setPaeImage] = useState<HTMLImageElement | null>(null);
  const [centerImg, setCenterImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const pae = new Image();
    pae.src = "/pae.png";
    pae.onload = () => setPaeImage(pae);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = settings.centerImage;
    img.onload = () => setCenterImg(img);
  }, [settings.centerImage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.fillStyle = settings.bgColor;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    if (centerImg) {
      const imgSize = CANVAS_SIZE * 0.7;
      const x = (CANVAS_SIZE - imgSize) / 2;
      const y = (CANVAS_SIZE - imgSize) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, imgSize, imgSize, 12);
      ctx.clip();
      ctx.drawImage(centerImg, x, y, imgSize, imgSize);
      ctx.restore();

      ctx.fillStyle = `rgba(0, 0, 0, ${settings.overlayOpacity})`;
      ctx.beginPath();
      ctx.roundRect(x, y, imgSize, imgSize, 12);
      ctx.fill();
    }

    if (paeImage) {
      const paeWidth = 80;
      const paeHeight = (paeImage.height / paeImage.width) * paeWidth;
      const paeX = CANVAS_SIZE - paeWidth - 15;
      const paeY = CANVAS_SIZE - paeHeight - 15;
      ctx.drawImage(paeImage, paeX, paeY, paeWidth, paeHeight);
    }

    if (settings.borderWidth > 0) {
      ctx.strokeStyle = settings.borderColor;
      ctx.lineWidth = settings.borderWidth;
      ctx.strokeRect(
        settings.borderWidth / 2,
        settings.borderWidth / 2,
        CANVAS_SIZE - settings.borderWidth,
        CANVAS_SIZE - settings.borderWidth
      );
    }
  }, [settings, paeImage, centerImg, canvasRef]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "cover.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [canvasRef]);

  return { handleDownload };
};
