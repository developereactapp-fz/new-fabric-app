import { useState, useCallback, useEffect } from "react";

import axios from "axios";



import PreviewArea from "../../components/PreviewArea";

import FabricPanel from "../../components/FabricPanel";



export default function ShirtCustomizePage() {

  const [fabrics, setFabrics] = useState([]);

  const [selectedFabric, setSelectedFabric] = useState(null);

  const [focusArea, setFocusArea] = useState(null);

  const [customLayers, setCustomLayers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");



  const API = "https://apperal-clothing-app-production.up.railway.app";



  const requestHeaders = {

    "x-tenant-slug": "test-tenant",

    Accept: "*/*",

  };



  const fetchProductDetail = async (productId) => {

    const res = await axios.get(`${API}/api/catalog/products/${productId}`, {

      headers: requestHeaders,

    });

    return res?.data?.data || res?.data;

  };



  useEffect(() => {

    let isMounted = true;

    const run = async () => {

      setLoading(true);

      setError("");

      try {

        const res = await axios.get(`${API}/api/catalog/products?category=shirt`, {

          headers: requestHeaders,

        });


        const products = Array.isArray(res.data) ? res.data : (res.data?.data || []);

        const mapped = products.map((p) => {
          const serverUrl = p?.asset?.url || "";
          const parts = Array.isArray(p?.parts) ? p.parts : [];

          const mappedLayers = [
            serverUrl || "/assets/shirt/body.avif",
            "/assets/shirt/hands-bluestripe.png",
            "/assets/shirt/collar-bluestripe.png",
            "/assets/shirt/cuff-bluestripe.png",
            "/assets/shirt/button-bluestripe.png",
            "", // Placeholder for placket layer (index 5)
          ];

          const collarPart = parts.find((part) => part.name === "Collar");
          const cuffPart = parts.find((part) => part.name === "Cuff");

          const cleanName = (rawName) => {
            if (!rawName) return "Premium Shirt";
            return rawName.trim() || "Premium Shirt";
          };

          const mappedObj = {
            id: p?.id || p?.slug,
            name: cleanName(p?.name),
            image: serverUrl || "/assets/shirt/body.avif",
            thumbnail: serverUrl || "/assets/shirt/body.avif",
            color: "#4A90E2",
            pattern: "solid",
            layers: mappedLayers,
            parts: parts, // Store parts for dynamic UI generation
            raw: p,
          };

          const placketPart = parts.find((part) => part.name.toLowerCase() === "placket");
          if (placketPart) {
            const defaultPlacket = placketPart.types?.find((t) => t.isDefault);
            if (defaultPlacket) {
              const url = defaultPlacket.asset?.url || defaultPlacket.imageUrl;
              if (url) mappedObj.layers[5] = url;
            }
          }

          return mappedObj;
        });

        if (!isMounted) return;

        setFabrics(mapped);

        const first = mapped[0] || null;

        if (first?.id) {
          try {
            const detail = await fetchProductDetail(first.id);

            const mergedFirst = {
              ...first,
              parts: Array.isArray(detail?.parts) ? detail.parts : first.parts,
              raw: detail || first.raw,
            };

            if (!isMounted) return;

            setSelectedFabric(mergedFirst);

            setCustomLayers(mergedFirst?.layers ? [...mergedFirst.layers] : []);

            setFabrics((prev) =>
              prev.map((f) => (f.id === mergedFirst.id ? mergedFirst : f))
            );
          } catch {
            if (!isMounted) return;

            setSelectedFabric(first);

            setCustomLayers(first?.layers ? [...first.layers] : []);
          }
        } else {
          setSelectedFabric(first);

          setCustomLayers(first?.layers ? [...first.layers] : []);
        }
      } catch (e) {
        if (!isMounted) return;

        setError(e?.response?.data?.message || e?.message || "Failed to load fabrics");

        setFabrics([]);

        setSelectedFabric(null);

        setCustomLayers([]);
      } finally {
        if (!isMounted) return;

        setLoading(false);
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!selectedFabric?.id) return;

      const hasTypes = (selectedFabric.parts || []).some(
        (p) => Array.isArray(p?.types) && p.types.length > 0
      );

      if (hasTypes) return;

      try {
        const detail = await fetchProductDetail(selectedFabric.id);

        const merged = {
          ...selectedFabric,
          parts: Array.isArray(detail?.parts) ? detail.parts : selectedFabric.parts,
          raw: detail || selectedFabric.raw,
        };

        if (!isMounted) return;

        setSelectedFabric(merged);

        setFabrics((prev) => prev.map((f) => (f.id === merged.id ? merged : f)));
      } catch {
        // ignore
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [selectedFabric?.id]);

  useEffect(() => {
    if (!selectedFabric?.layers) return;

    setCustomLayers([...selectedFabric.layers]);
  }, [selectedFabric]);

  const handlePieceChange = useCallback((category, option, isContrast) => {
    if (!selectedFabric) return;
    setCustomLayers((prev) => {
      const newLayers = [...prev];

      const layerImage =
        option.image || option.raw?.asset?.url || option.raw?.imageUrl;

      if (category === "collar") {
        if (isContrast) {
          newLayers[2] =
            option.id === "no-contrast" ? selectedFabric.layers[2] : "/assets/shirt/collar-white.png";
        } else {
          newLayers[2] = layerImage || prev[2];
        }
      } else if (category === "cuff") {
        if (isContrast) {
          newLayers[3] =
            option.id === "no-contrast" ? selectedFabric.layers[3] : "/assets/shirt/cuff-white.png";
        } else {
          newLayers[3] = layerImage || prev[3];
        }
      } else if (category === "button" || category === "buttons") {
        newLayers[4] = layerImage || prev[4];
      } else if (category === "placket") {
        if (layerImage) {
          newLayers[5] = layerImage;
        }
      } else if (category === "backDetails" || category === "chestPocket" || category === "hem" || category === "sleeve") {
        if (layerImage) {
          newLayers[0] = layerImage;
        }
      }

      return newLayers;
    });
  }, [selectedFabric]);

  return (
    <div className="custom-page">

      <div className="custom-body">

        {/* LEFT */}

        <div className="preview-section">

          <PreviewArea

            layers={customLayers}

            fabricName={selectedFabric?.name || ""}

            focusArea={focusArea}

          />

        </div>



        {/* RIGHT */}

        <div className="panel-section">

          {loading ? (

            <div style={{ padding: 16 }}>Loading...</div>

          ) : error ? (

            <div style={{ padding: 16 }}>{error}</div>

          ) : (

          <FabricPanel

            fabrics={fabrics}

            selected={selectedFabric}

            onSelect={setSelectedFabric}

            garmentType="shirt"

            onFocusAreaChange={setFocusArea}

            onPieceChange={handlePieceChange}

          />

          )}

        </div>

      </div>

    </div>

  );

}