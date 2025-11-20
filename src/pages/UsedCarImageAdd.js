import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


export default function UsedCarImageAdd() {
  const { id: carId } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [tempId, setTempId] = useState("");

  useEffect(() => {
    if (!carId) {
      let existingTempId = localStorage.getItem("tempId");
      if (!existingTempId) {
        const newId = crypto.randomUUID(); 
        localStorage.setItem("tempId", newId);
        existingTempId = newId;
      }
      setTempId(existingTempId);
    }
}, [carId]);
useEffect(() => {
  if (!carId && !tempId) return;

  const fetchImages = async () => {
    try {
      if (carId) {
const response = await axios.get(`https://carguru.up.railway.app/api/images/${carId}`);
        setUploadedImages(response.data || []);
      } else if (tempId) {
const response = await axios.get(`https://carguru.up.railway.app/api/images/temp/${tempId}`);
        setUploadedImages(response.data || []);
      }
    } catch (err) {
      console.error("Hiba a képek lekérése:", err);
    }
  };

  fetchImages();
}, [carId, tempId]); 



  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (files.length + selected.length + uploadedImages.length > 12) {
      alert("Maximum 12 képet tölthetsz fel összesen!");
      return;
    }
    setFiles([...files, ...selected]);
  };

  
const handleUpload = async () => {
  if (files.length === 0 && uploadedImages.length === 0) {
    alert("Előbb válassz ki legalább egy képet!");
    return;
  }

  if (files.length === 0 && uploadedImages.length > 0) {
    navigate(`/used-cars/summary?tempId=${tempId}`);
    return;
  }

  setUploading(true);
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  try {
    const token = localStorage.getItem("token");

    if (carId) {
await axios.post(`https://carguru.up.railway.app/api/images/upload/${carId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
await axios.post(`https://carguru.up.railway.app/api/images/temp/${tempId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
    }

    alert("Képek sikeresen feltöltve!");
    navigate(`/used-cars/summary?tempId=${tempId}`);
  } catch (err) {
    console.error("Feltöltési hiba:", err);
    alert("Hiba történt a feltöltéskor!");
  } finally {
    setUploading(false);
  }
};



  return (
    <div className="image-upload-page">
      <Navbar />
      <div className="upload-container">
        <div className="steps">
          <div className="step active">1 Jármű adatai</div>
          <div className="step current">2 Képek feltöltése</div>
        </div>
        <h2>Képek feltöltése</h2>
        <p>Tölts fel maximum 12 képet a hirdetéshez.</p>
        <div className="upload-box">
          <label htmlFor="file-input" className="file-drop">
            <div className="icon"></div>
            <span>Húzd ide a képeket vagy kattints a tallózáshoz</span>
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        {uploadedImages.length > 0 && (
          <>
            <h4>Már feltöltött képek:</h4>
            <div className="preview">
              {uploadedImages.map((img, index) => (
                <div key={index} className="preview-item">
                  <img src={`https://carguru.up.railway.app${img.image}`} alt={`uploaded-${index}`} />
                </div>
              ))}
            </div>
          </>
        )}

        {files.length > 0 && (
          <>
            <h4>Feltöltésre váró képek:</h4>
            <div className="preview">
              {files.map((file, index) => (
                <div key={index} className="preview-item">
                  <img src={URL.createObjectURL(file)} alt={`preview-${index}`} />
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="buttons">
          <button onClick={() => navigate(-1)}>Vissza</button>
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Feltöltés..." : "Tovább"}
          </button>
        </div>
      </div>

      <style>{`
        .image-upload-page {
          padding-top: 100px;
        }
        .upload-container {
          max-width: 900px;
          margin: auto;
          padding: 30px;
        }
        .steps { display: flex; gap: 10px; margin-bottom: 20px; }
        .step { padding: 10px 15px; border-radius: 5px; font-size: 14px; }
        .step.active { background: #4caf50; color: white; }
        .step.current { background: #81c784; color: white; }

        .upload-box {
          border: 2px dashed #888;
          border-radius: 10px;
          padding: 30px;
          text-align: center;
          cursor: pointer;
          margin-bottom: 20px;
        }
        .icon { font-size: 40px; margin-bottom: 10px; }
        .preview { display: flex; flex-wrap: wrap; gap: 15px; }
        .preview-item { width: 120px; text-align: center; }
        .preview-item img {
          width: 100%; height: 80px; object-fit: cover; border-radius: 5px;
        }
        .buttons { display: flex; justify-content: space-between; margin-top: 20px; }
        .buttons button {
          padding: 10px 20px; background: #1976d2; color: white;
          border: none; border-radius: 5px; cursor: pointer;
        }
        .buttons button:hover { background: #125aa0; }
      `}</style>
    </div>
  );
}
