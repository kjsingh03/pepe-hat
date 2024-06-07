import React, { useState, useRef, useEffect } from "react";
import Moveable from "react-moveable";
import "./App.css";
import hatImage from "./assets/hat.png";

const App = () => {
  const [image, setImage] = useState(null);
  const [hat, setHat] = useState({
    x: 50,
    y: 50,
    width: 0,
    height: 0,
    rotate: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const hatRef = useRef(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);

      const img = new Image();
      img.src = url;
      img.onload = () => {
        const hatImg = new Image();
        hatImg.src = hatImage;
        hatImg.onload = () => {
          const maxDimension = 120;
          const aspectRatio = hatImg.width / hatImg.height;
          let newHatWidth, newHatHeight;

          if (aspectRatio > 1) {
            newHatWidth = maxDimension;
            newHatHeight = maxDimension / aspectRatio;
          } else {
            newHatWidth = maxDimension * aspectRatio;
            newHatHeight = maxDimension;
          }

          setHat({
            x: 50,
            y: 50,
            width: newHatWidth,
            height: newHatHeight,
            rotate: 0,
          });
        };
      };

      fileInputRef.current.value = null;
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = imageRef.current;
    const hatImg = new Image();
    hatImg.src = hatImage;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(hat.x + hat.width / 2, hat.y + hat.height / 2);
    ctx.rotate((hat.rotate * Math.PI) / 180);
    ctx.drawImage(
      hatImg,
      -hat.width / 2,
      -hat.height / 2,
      hat.width,
      hat.height
    );
    ctx.restore();

    const link = document.createElement("a");
    link.download = "image-with-hat.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  useEffect(() => {
    if (hatRef.current) {
      hatRef.current.style.transform = `translate(${hat.x}px, ${hat.y}px) rotate(${hat.rotate}deg)`;
    }
  }, [hat]);

  useEffect(() => {
    if (hat.width > 0 && hat.height > 0) {
      setHat(prevHat => ({ ...prevHat }))
    }
  }, [hat.width, hat.height]);

  return (
    <>
      <div className={`h-screen overflow-y-auto z-40 flex flex-col items-center justify-center py-12`}>

        <div className=" flex flex-col justify-between items-center h-full text-white rounded-lg w-[95vw] xs:w-[80vw] md:w-[40rem]">
          <div className="flex flex-col justify-center items-center gap-6 w-full">
            <p className="text-center text-4xl font-semibold">$MEP</p>
            <div className="w-28">
              <img src="logo.png" className="w-full h-full object-cover" alt="" />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-6 w-full relative">
            <p className="text-center text-xl md:text-2xl font-semibold">Upload an image to add pepe hat</p>
            <label htmlFor="file" className="text-white cursor-pointer px-5 rounded-3xl py-3 bg-[#32A430] font-semibold">Upload an image</label>
            <input ref={fileInputRef} id="file" type="file" accept="image/*" onChange={handleImageChange} className="invisible" />
            {image && (
              <div className="screen z-50 w-screen h-screen fixed left-0 top-0 flex flex-col gap-4 items-center justify-center backdrop-blur-sm">
                <div className="modal border-slate-400/20 rounded-lg border flex flex-col gap-4 items-center justify-center mx-auto p-2 2xl:p-5 w-[95vw] sm:w-[75vw] md:w-[60vw] lg:w-[50vw] 2xl:w-[40vw] h-[60vh] relative">
                  <div className="text-right w-full px-2">
                    <button onClick={() => setImage(null)} className="md:absolute top-3 right-4 text-red-500 text-3xl font-bold">&times;</button>
                    </div>
                  <div className="h-auto w-auto xl:max-h-[60vh] max-w-[80vw] 2xl:max-w-[70vw] overflow-hidden" style={{ position: "relative", display: "inline-block" }}>
                    <img ref={imageRef} src={image} alt="Uploaded" crossOrigin="anonymous" className="w-full h-full object-cover"/>
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                    {hat.width > 0 && hat.height > 0 && (
                      <>
                        <Moveable
                          target={hatRef.current}
                          container={null}
                          origin={false}
                          edge={false}
                          draggable={true}
                          resizable={true}
                          rotatable={true}
                          throttleDrag={0}
                          throttleResize={0}
                          throttleRotate={0}
                          onDragStart={({ target }) => {
                            setIsDragging(true);
                          }}
                          onDrag={({ target, beforeTranslate }) => {
                            setHat((prevHat) => ({
                              ...prevHat,
                              x: beforeTranslate[0],
                              y: beforeTranslate[1],
                            }));
                          }}
                          onDragEnd={({ target }) => {
                            setIsDragging(false);
                          }}
                          onResize={({ target, width, height, drag }) => {
                            const beforeTranslate = drag.beforeTranslate;
                            setHat((prevHat) => ({
                              ...prevHat,
                              width,
                              height,
                              x: beforeTranslate[0],
                              y: beforeTranslate[1],
                            }));
                          }}
                          onResizeEnd={({ target }) => {
                            // Resize end logic
                          }}
                          onRotate={({ target, beforeRotate }) => {
                            setHat((prevHat) => ({
                              ...prevHat,
                              rotate: beforeRotate,
                            }));
                          }}
                          onRotateEnd={({ target }) => {
                            // Rotate end logic
                          }}
                          renderDirections={["nw", "ne", "sw", "se", "n", "w", "s", "e"]}
                          rotationPosition="top"
                        />
                        <div
                          ref={hatRef}
                          className="hat"
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: `${hat.width}px`,
                            height: `${hat.height}px`,
                            transform: `translate(${hat.x}px, ${hat.y}px) rotate(${hat.rotate}deg)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img
                            src={hatImage}
                            alt="Hat"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              pointerEvents: "none",
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <button onClick={handleDownload} className="text-white cursor-pointer px-5 rounded-3xl py-3 bg-[#32A430] font-semibold">
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="w-full text-center text-2xl font-semibold">
            <a href="https://www.memesinapepe.world/" target="_blank">website</a>
          </div>
        </div>

      </div>
      {/* <div className="h-screen z-40 bg-[url(./assets/bg2.jpg)] bg-no-repeat bg-center bg-cover bg-fixed flex items-center justify-center"></div> */}
    </>
  );
};

export default App;
