import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import './App.css';
import hatImage from './assets/hat.png'; // Import the default hat image

const App = () => {
  const [image, setImage] = useState(null);
  const [hat, setHat] = useState({ x: 50, y: 50, width: 0, height: 0, rotate: 0 });
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const screenRef = useRef(null);

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
          const newHatWidth = 120;
          const aspectRatio = hatImg.width / hatImg.height;
          const newHatHeight = newHatWidth / aspectRatio;

          setHat({ x: 50, y: 50, width: newHatWidth, height: newHatHeight, rotate: 0, });
        };
      };

      // document.querySelector('.screen').addEventListener('click', (e) => {
      //   if (!document.querySelector('.modal').contains(e.target)) {
      //     document.querySelector('.screen').style.display = 'none'
      //     setImage(null);
      //   }
      // })

      setTimeout(() => {
        screenRef.current.addEventListener('click', (e) => {
          if (!document.querySelector('.modal').contains(e.target)) {
            setImage(null);
          }
        })
      }, 100)
    }
  };

  const handleDownload = async () => {
    const img = imageRef.current;
    const hatImg = new Image();
    hatImg.src = hatImage;

    // Wait for both the main image and hat image to load
    await Promise.all([
      new Promise((resolve) => (img.complete ? resolve() : (img.onload = resolve))),
      new Promise((resolve) => (hatImg.complete ? resolve() : (hatImg.onload = resolve))),
    ]);

    // Create a new canvas with higher dimensions
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = img.width; // Increase canvas width (example: double the width)
    canvas.height = img.height; // Increase canvas height (example: double the height)
    context.drawImage(img, 0, 0, canvas.width, canvas.height);

    const { x, y, width, height, rotate } = hat;
    context.save();
    context.translate(x + width / 2, y + height / 2);
    context.rotate((rotate * Math.PI) / 180);
    context.drawImage(hatImg, -width / 2, -height / 2, width, height);
    context.restore();

    // Convert canvas to Blob and download
    canvas.toBlob((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'image_with_hat.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Clean up the URL.createObjectURL reference
    }, 'image/png');
  };



  return (
    <>
      <div className="">
        <div className='h-screen z-40 bg-[url(./assets/mbg1.png)] md:bg-[url(./assets/bg1.webp)] bg-no-repeat bg-center bg-cover bg-fixed flex items-center justify-center'>

          <div className="flex flex-col backdrop-blur-[5px h-[35rem] text-white rounded-lg w-[35rem] justify-center items-center gap-6">
            <p className="text-center text-2xl font-semibold">Upload an image to add pepe hat</p>
            <label htmlFor='file' className='text-white cursor-pointer px-5 rounded-3xl py-3 bg-[#32A430] font-semibold'>Upload an image</label>
            <input id='file' type="file" accept="image/*" onChange={handleImageChange} className='invisible' />

            {
              image &&
              <>
                <div ref={screenRef} className='screen z-50 w-screen h-screen fixed left-0 top-0 flex flex-col gap-4 items-center justify-center backdrop-blur-sm'>
                  <div className="modal border-slate-400/20 rounded-lg border flex flex-col gap-4 items-center justify-center mx-auto p-5 w-full xs:w-[70vw] md:w-[50vw] 2xl:w-[40vw] h-[20rem]">
                    <div className="h-auto w-auto max-h-[13.5rem] max-w-[24rem] overflow-hidden" style={{ position: 'relative', display: 'inline-block' }}>
                      <img ref={imageRef} src={image} alt="Uploaded" crossOrigin="anonymous" className='w-full h-full object-cover' />
                      <canvas ref={canvasRef} style={{ display: 'none' }} />
                      {
                        hat.width > 0 && hat.height > 0 && (
                          <Rnd
                            size={{ width: hat.width, height: hat.height }}
                            position={{ x: hat.x, y: hat.y }}
                            onDragStop={(e, d) => setHat({ ...hat, x: d.x, y: d.y })}
                            onResizeStop={(e, direction, ref, delta, position) => {
                              setHat({
                                width: parseInt(ref.style.width, 10),
                                height: parseInt(ref.style.height, 10),
                                ...position,
                              });
                            }}
                            onResize={(e, direction, ref, delta, position) => {
                              setHat({
                                width: parseInt(ref.style.width, 10),
                                height: parseInt(ref.style.height, 10),
                                ...position,
                              });
                            }}
                            onDoubleClick={() => setHat({ ...hat, rotate: hat.rotate + 45 })}
                            // rotatehandleclassName="rotate-handle"
                            resizeHandleWrapperClass="resize-handle-wrapper"
                            resizeHandleStyles={{
                              bottomRight: {
                                width: '10px',
                                height: '10px',
                                background: 'red',
                                borderRadius: '50%',
                              },
                              topRight: {
                                width: '10px',
                                height: '10px',
                                background: 'red',
                                borderRadius: '50%',
                              },
                              bottomLeft: {
                                width: '10px',
                                height: '10px',
                                background: 'red',
                                borderRadius: '50%',
                              },
                              topLeft: {
                                width: '10px',
                                height: '10px',
                                background: 'red',
                                borderRadius: '50%',
                              },
                            }}
                            style={{
                              backgroundImage: `url(${hatImage})`,
                              backgroundSize: 'cover',
                              cursor: 'move',
                            }}
                          >
                            <div className="rotate-handle"></div>
                          </Rnd>
                        )}
                    </div>
                    <button onClick={handleDownload} className='text-white cursor-pointer px-5 rounded-3xl py-3 bg-[#32A430] font-semibold'>Download</button>
                  </div>
                </div>
              </>
            }

          </div>
        </div>
        <div className='h-screen z-40 bg-[url(./assets/bg2.jpg)] bg-no-repeat bg-center bg-cover bg-fixed flex items-center justify-center'>

          <div className="flex flex-col backdrop-blur-[5px h-[35rem] text-white rounded-lg w-[35rem] justify-center items-center gap-6">
            <p className="text-center text-2xl font-semibold">Upload an image to add pepe hat</p>
            <div onClick={() => { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });console.log('click') }} className='text-white cursor-pointer px-5 rounded-3xl py-3 bg-[#32A430] font-semibold'>Upload an image</div>

          </div>
        </div>
      </div>
    </>
  );
};

export default App;
