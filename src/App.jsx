import { useRef, useEffect } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // ctx.fillStyle = "rgb(208,208,208)";
    // ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    const img = new Image();
    // 定義attribute crossOrigin是anonymous，讓圖片可以跨域存取
    img.crossOrigin = "";
    img.onload = function () {
      ctx.drawImage(img, 0, 0, canvas.clientWidth, canvas.clientHeight);
      ctx.fillText("刮刮卡", 180, 50);
    };
    img.src = "https://picsum.photos/id/23/400/400";

    let isDrawing = false;
    let lastPoint = null;

    const startDraw = (event) => {
      isDrawing = true;
      lastPoint = getClientOffset(event);
    };

    const draw = (event) => {
      if (!isDrawing) return;
      const point = getClientOffset(event);
      const x = point?.x;
      const y = point?.y;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();

      if (lastPoint) {
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(x, y);
        ctx.lineWidth = 20;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.stroke();
      }

      lastPoint = { x, y };
    };

    const endDraw = () => {
      isDrawing = false;
      lastPoint = null;
      // 檢查透明像素的比例
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let count = 0;
      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] < 10) count++;
      }
      if (count / (imageData.data.length / 4) > 0.7) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log(imageData);
        alert("刮刮卡已經被刮開了");
      }
    };

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDraw);
    canvas.addEventListener("mouseout", endDraw);
    canvas.addEventListener("touchstart", startDraw);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", endDraw);

    return () => {
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", endDraw);
      canvas.removeEventListener("touchstart", startDraw);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", endDraw);
    };
  }, [canvasRef]);
  /** 取得位置 */
  const getClientOffset = (event) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const point = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      return point;
    }
  };
  return (
    <>
      <div className="container">
        <div className="content">
          <img
            src="https://picsum.photos/id/237/400/400"
            width="400"
            height="400"
          />
          <canvas ref={canvasRef} width="400" height="400"></canvas>
        </div>
      </div>
    </>
  );
}

export default App;
