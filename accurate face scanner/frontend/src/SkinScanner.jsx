import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export default function SkinScanner() {
  const webcamRef = useRef(null);
  const [scanStep, setScanStep] = useState(1);
  const [isFaceAligned, setIsFaceAligned] = useState(false);
  const [capturedFullFace, setCapturedFullFace] = useState(null);
  const [capturedCloseUp, setCapturedCloseUp] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Loading diagnostic tracking modules...");
  
  const stepRef = useRef(scanStep);
  useEffect(() => { stepRef.current = scanStep; }, [scanStep]);

  useEffect(() => {
    let landmarker;
    let animationId;

    const initializeFaceMesh = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );
        landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numFaces: 1
        });
        
        setStatusMessage("SETUP IN LIGHT SIDE: Position your full face inside the circle frame.");
        detectFace();
      } catch (err) {
        setStatusMessage("Error loading camera tracking modules.");
      }
    };

    const detectFace = () => {
      if (webcamRef.current && webcamRef.current.video.readyState === 4) {
        const video = webcamRef.current.video;
        const results = landmarker.detectForVideo(video, performance.now());
        const currentStep = stepRef.current;

        if (currentStep < 3) {
          if (results.faceLandmarks && results.faceLandmarks.length === 1) {
            const landmarks = results.faceLandmarks[0];
            
            const xs = landmarks.map(l => l.x);
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const faceWidth = maxX - minX;

            if (currentStep === 1) {
              if (minX < 0.15) {
                setIsFaceAligned(false);
                setStatusMessage("Your face is half in image. Move a little bit more to the right.");
              } else if (maxX > 0.85) {
                setIsFaceAligned(false);
                setStatusMessage("Your face is half in image. Move a little bit more to the left.");
              } else if (faceWidth < 0.35) {
                setIsFaceAligned(false);
                setStatusMessage("You are too far. Come a little bit closer to the camera.");
              } else if (faceWidth > 0.65) {
                setIsFaceAligned(false);
                setStatusMessage("You are too close. Move back slightly for the full face image.");
              } else {
                setIsFaceAligned(true);
                setStatusMessage("Face aligned successfully! Keep still in the light and capture.");
              }
            } else if (currentStep === 2) {
              if (faceWidth < 0.70) {
                setIsFaceAligned(false);
                setStatusMessage("COME CLOSER: Bring the camera very close to your skin for a clear texture image.");
              } else {
                setIsFaceAligned(true);
                setStatusMessage("Perfect close-up! Keep still in the light and analyze.");
              }
            }
          } else if (results.faceLandmarks && results.faceLandmarks.length > 1) {
            setIsFaceAligned(false);
            setStatusMessage("Multiple faces detected. Please ensure a clear background.");
          } else {
            setIsFaceAligned(false);
            setStatusMessage(currentStep === 1 
              ? "SETUP IN LIGHT SIDE: Center your full face in the camera." 
              : "COME CLOSER: Move the camera very close to your skin.");
          }
        }
      }
      
      if (stepRef.current < 3) {
        animationId = requestAnimationFrame(detectFace);
      }
    };

    if (scanStep < 3) {
      initializeFaceMesh();
    }
    
    return () => cancelAnimationFrame(animationId);
  }, [scanStep]);

  const captureFirstImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedFullFace(imageSrc);
    setScanStep(2);
    setIsFaceAligned(false); 
  };

 const captureSecondImageAndAnalyze = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedCloseUp(imageSrc);
    setStatusMessage("Analyzing structural matrix and skin texture...");
    setScanStep(3);

    try {
      // THIS IS THE UPDATED LINE WITH YOUR RENDER URL
      const response = await fetch('https://glownest-facial-product.onrender.com/api/analyze-skin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fullFaceImage: capturedFullFace,
          closeUpImage: imageSrc 
        })
      });
      
      const data = await response.json();
      setScanResult(data);
    } catch (error) {
      setScanResult({ error: "Connection error. Ensure your backend server is running." });
    }
  };

  const resetScanner = () => {
    setCapturedFullFace(null);
    setCapturedCloseUp(null);
    setScanResult(null);
    setScanStep(1);
    setIsFaceAligned(false);
  };

  const getSkinAdvice = (skinType) => {
    switch (skinType) {
      case "Oily Skin":
        return "Your skin produces excess oil. We recommend purchasing lightweight, oil-free moisturizers and salicylic acid cleansers to keep your pores clear.";
      case "Dry Skin":
        return "Your skin needs deep hydration. We recommend purchasing rich creams with ceramides and hyaluronic acid to repair your moisture barrier.";
      case "Combination Skin":
        return "You have varying zones of oil and dryness. We recommend a gentle daily cleanser and targeted treatments for your oily T-Zone.";
      case "Sensitive Skin":
        return "Your skin is highly reactive. We recommend purchasing fragrance-free, soothing products with aloe or niacinamide to calm redness.";
      default:
        return "Maintain a balanced routine with a gentle cleanser and daily SPF sunscreen.";
    }
  };

  return (
    // Changed container background to white for contrast against the pink app background
    <div style={{ maxWidth: '500px', margin: '40px auto', backgroundColor: '#ffffff', color: '#333', padding: '30px', borderRadius: '12px', textAlign: 'center', border: '2px solid #ffccd5', boxShadow: '0 4px 15px rgba(200, 150, 160, 0.2)', fontFamily: 'sans-serif' }}>
      
      {/* Title in Red Wine color */}
      <h2 style={{ margin: '0 0 5px 0', fontSize: '26px', color: '#722f37' }}>Clinical Skin Analyzer</h2>
      <p style={{ margin: '0 0 25px 0', fontSize: '13px', color: '#9e4751', textTransform: 'uppercase', letterSpacing: '1px' }}>Advanced Multi-Zone Scanner</p>
      
      {/* Status Box in Baby Pink with Wine text */}
      <div style={{ padding: '14px', marginBottom: '25px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', border: '1px solid #ff99aa', backgroundColor: '#ffccd5', color: '#722f37', minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {statusMessage}
      </div>

      {scanStep < 3 && (
        <div style={{ position: 'relative', width: '320px', height: '320px', margin: '0 auto', overflow: 'hidden', borderRadius: '50%', border: isFaceAligned ? '5px solid #10b981' : '5px solid #ff99aa', transition: 'border-color 0.3s' }}>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/png"
            videoConstraints={{ width: 640, height: 640, facingMode: "user" }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {scanStep === 1 && (
        <button 
          onClick={captureFirstImage} 
          disabled={!isFaceAligned}
          style={{
            marginTop: '30px', width: '100%', padding: '15px', fontSize: '16px', fontWeight: 'bold',
            backgroundColor: isFaceAligned ? '#722f37' : '#f8e6e8', // Wine if ready, pale pink if not
            color: isFaceAligned ? '#ffffff' : '#a37c82', 
            border: 'none', cursor: isFaceAligned ? 'pointer' : 'not-allowed', borderRadius: '8px', transition: 'background-color 0.3s'
          }}
        >
          CAPTURE FULL FACE (IMAGE 1)
        </button>
      )}

      {scanStep === 2 && (
        <button 
          onClick={captureSecondImageAndAnalyze}
          disabled={!isFaceAligned}
          style={{
            marginTop: '30px', width: '100%', padding: '15px', fontSize: '16px', fontWeight: 'bold',
            backgroundColor: isFaceAligned ? '#722f37' : '#f8e6e8', 
            color: isFaceAligned ? '#ffffff' : '#a37c82', 
            border: 'none', cursor: isFaceAligned ? 'pointer' : 'not-allowed', borderRadius: '8px', transition: 'background-color 0.3s'
          }}
        >
          CAPTURE CLOSE-UP & ANALYZE (IMAGE 2)
        </button>
      )}

      {scanStep === 3 && (
        <div style={{ marginTop: '10px', textAlign: 'left', padding: '20px', backgroundColor: '#fff5f7', borderRadius: '10px', border: '1px solid #ffccd5' }}>
          {!scanResult ? (
            <h3 style={{ textAlign: 'center', color: '#722f37' }}>Calculating precise AI metrics...</h3>
          ) : scanResult.error ? (
            <h3 style={{ textAlign: 'center', color: '#ef4444' }}>{scanResult.error}</h3>
          ) : (
            <>
              <h3 style={{ margin: '0 0 15px 0', color: '#722f37', borderBottom: '2px solid #ffccd5', paddingBottom: '8px' }}>Your Accurate Skin Profile:</h3>
              
              <div style={{ margin: '12px 0', fontSize: '16px' }}>
                <span style={{ color: '#9e4751' }}>Skin Classification: </span> 
                <strong style={{ color: '#722f37', fontSize: '18px' }}>{scanResult.skinType}</strong>
              </div>
              
              <div style={{ margin: '12px 0', fontSize: '15px' }}>
                <span style={{ color: '#9e4751' }}>T-Zone Sebum Indicator: </span> 
                <strong style={{ color: '#333' }}>{scanResult.sebumLevel}%</strong>
              </div>
              
              <div style={{ margin: '12px 0', fontSize: '15px' }}>
                <span style={{ color: '#9e4751' }}>U-Zone Moisture Level: </span> 
                <strong style={{ color: '#333' }}>{scanResult.hydrationLevel}%</strong>
              </div>

              {/* Advice Box in Baby Pink */}
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#ffe4e5', borderRadius: '8px', borderLeft: '5px solid #722f37' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#722f37' }}>What You Need To Purchase:</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#5e1914', lineHeight: '1.6' }}>
                  {getSkinAdvice(scanResult.skinType)}
                </p>
              </div>
            </>
          )}

          <button 
            onClick={resetScanner}
            style={{ marginTop: '25px', width: '100%', padding: '14px', backgroundColor: '#ffb3c6', color: '#722f37', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
          >
            Take New Images
          </button>
        </div>
      )}
    </div>
  );
}