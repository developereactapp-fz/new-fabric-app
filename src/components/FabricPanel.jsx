import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuickAccessToolbar from "./fabric/subcomponents/QuickAccessToolbar";
import FabricFilterPanel from "./fabric/subcomponents/FabricFilterPanel";
import FabricDetailModal from "./fabric/subcomponents/FabricDetailModal";



// Customization options for each garment type with descriptions

const customizationOptions = {

  shirt: {

    collar: {

      title: "Collar",

      hasContrast: true,

      options: [

        { id: "classic", name: "Classic", description: "This versatile collar features a short spread and classic sharp points.", image: "/assets/shirt/collar-bluestripe.png", selected: true },

        { id: "widespread", name: "Classic Widespread", description: "This collar style features ample space between subtly outward oriented points.", image: "/assets/shirt/collar-bluestripe.png" },

        { id: "cutaway", name: "Curved Cutaway", description: "The curved cutaway collar features a single button and notably wide spread.", image: "/assets/shirt/collar-bluestripe.png" },

        { id: "high", name: "High Widespread", description: "Like the classic wide collar, but carries a slightly shorter collar length.", image: "/assets/shirt/collar-bluestripe.png" },

        { id: "point", name: "Point", description: "This straight collar features typical sharply angled points and narrow spread.", image: "/assets/shirt/collar-bluestripe.png" },

        { id: "button-down", name: "Button Down", description: "This style features a relatively short spread, small buttons, and a more pronounced rolling gap.", image: "/assets/shirt/collar-bluestripe.png" },

      ],

      contrastOptions: [

        { id: "no-contrast", name: "No", description: "Collar is constructed with the selected fabric", image: "/assets/shirt/collar-bluestripe.png", selected: true },

        { id: "contrast-white", name: "White", description: "Classic white contrast collar for a formal look", image: "/assets/shirt/collar-bluestripe.png" },

        { id: "contrast-black", name: "Black", description: "Sophisticated black contrast collar", image: "/assets/shirt/collar-bluestripe.png" },

      ]

    },

    cuff: {

      title: "Cuff",

      hasContrast: true,

      options: [

        { id: "single-one", name: "Single Cuff One Button", description: "A classic single cuff with a single button closure and rounded edges.", image: "/assets/shirt/cuff-bluestripe.png" },

        { id: "single-ellipse", name: "Single Cuff Ellipse", description: "A boat-shaped cuff with a single button closure and a rounded cleft edge for some subtle refinement.", image: "/assets/shirt/cuff-bluestripe.png" },

        { id: "single-chisel", name: "Single Chisel", description: "Formal & business-ready squared cuffs feature a broad angled closure.", image: "/assets/shirt/cuff-bluestripe.png" },

        { id: "single-round", name: "Single Round Adjustable", description: "The adjustable cuff has a practical second button, allowing you to adjust the tightness of the cuff.", image: "/assets/shirt/cuff-bluestripe.png", selected: true },

        { id: "single-chisel-adj", name: "Single Chisel Adjustable", description: "The adjustable cuff has a practical second button, allowing you to adjust the tightness of the cuff.", image: "/assets/shirt/cuff-bluestripe.png" },

        { id: "double-round", name: "Double Cuff Round", description: "Double cuffs feature fabric folded back onto itself which must be fastened with cufflinks.", image: "/assets/shirt/cuff-bluestripe.png" },

      ],

      contrastOptions: [

        { id: "no-contrast", name: "No", description: "Cuff is constructed with the selected fabric", image: "/assets/shirt/cuff-bluestripe.png", selected: true },

        { id: "contrast-white", name: "White", description: "Classic white contrast cuffs for a formal look", image: "/assets/shirt/cuff-bluestripe.png" },

        { id: "contrast-black", name: "Black", description: "Sophisticated black contrast cuffs", image: "/assets/shirt/cuff-bluestripe.png" },

      ]

    },

    placket: {

      title: "Placket",

      options: [

        { id: "plain", name: "Plain", description: "Our standard style, placket-less fronts make for a clean, highly versatile minimalist look.", image: "/assets/shirt/body-bluestripe.png", selected: true },

        { id: "hidden", name: "Hidden Button", description: "Often found on tux shirts, hidden placket features a layer of fabric folded over to hide the buttons.", image: "/assets/shirt/body-bluestripe.png" },

        { id: "stitched", name: "Stitched-On", description: "A box placket features a visible strip of raised fabric—ideal for everyday casual shirts.", image: "/assets/shirt/body-bluestripe.png" },

      ]

    },

    backDetails: {

      title: "Back Details",

      options: [

        { id: "plain-back", name: "Plain Back", description: "Clean back without any pleats for a modern, streamlined look.", image: "/assets/shirt/body-bluestripe.png", selected: true },

        { id: "box-pleat", name: "Box Pleat", description: "Classic box pleat at the center back for added comfort and ease of movement.", image: "/assets/shirt/body-bluestripe.png" },

        { id: "side-pleats", name: "Side Pleats", description: "Two side pleats offering a tailored fit with extra flexibility.", image: "/assets/shirt/body-bluestripe.png" },

      ]

    },

    chestPocket: {

      title: "Chest Pocket",

      options: [

        { id: "no-pocket", name: "No Pocket", description: "Clean minimalist look without a chest pocket.", image: "/assets/shirt/body-bluestripe.png", selected: true },

        { id: "classic-pocket", name: "Classic Pocket", description: "Traditional chest pocket with angular opening.", image: "/assets/shirt/body-bluestripe.png" },

        { id: "rounded-pocket", name: "Rounded Pocket", description: "Modern pocket design with rounded corners.", image: "/assets/shirt/body-bluestripe.png" },

        { id: "patch-pocket", name: "Patch Pocket", description: "Stylish patch pocket for a casual contemporary look.", image: "/assets/shirt/body-bluestripe.png" },

      ]

    },

    sleeve: {

      title: "Sleeve",

      options: [

        { id: "long-sleeve", name: "Long Sleeve", description: "Classic long sleeves for formal and everyday wear.", image: "/assets/shirt/cuff-bluestripe.png", selected: true },

        { id: "short-sleeve", name: "Short Sleeve", description: "Casual short sleeves perfect for warm weather.", image: "/assets/shirt/cuff-bluestripe.png" },

        { id: "rolled-sleeve", name: "Rolled Sleeve", description: "Sleeve designed to be worn rolled up for a relaxed look.", image: "/assets/shirt/cuff-bluestripe.png" },

      ]

    },

    hem: {

      title: "Hem",

      options: [

        { id: "straight-hem", name: "Straight Hem", description: "Classic straight hem for a traditional look.", image: "/assets/shirt/body-bluestripe.png", selected: true },

        { id: "tailored-hem", name: "Tailored Hem", description: "Slightly curved hem that follows the body's natural shape.", image: "/assets/shirt/body-bluestripe.png" },

        { id: "long-tail-hem", name: "Long Tail Hem", description: "Extended back hem to keep shirt tucked in.", image: "/assets/shirt/body-bluestripe.png" },

      ]

    },

    accessories: {

      title: "Accessories",

      options: [

        { id: "collar-stays", name: "Collar Stays", description: "Removable collar stays to keep your collar crisp and in place.", image: "/assets/shirt/collar-bluestripe.png", selected: true },

        { id: "cufflinks", name: "Cufflinks", description: "Elegant cufflinks for French cuff styles.", image: "/assets/shirt/cuff-bluestripe.png" },

        { id: "pocket-square", name: "Pocket Square", description: "Matching pocket square to complete the look.", image: "/assets/shirt/body-bluestripe.png" },

      ]

    },

    button: {

      title: "Button",

      searchable: true,

      options: [

        { id: "b01", name: "Standard White", code: "B01", description: "Classic white button", image: "/assets/shirt/button-bluestripe.png", selected: true },

        { id: "b03", name: "Flat White", code: "B03", description: "Smooth flat white button", image: "/assets/shirt/button-bluestripe.png" },

        { id: "b19", name: "White Flat Mother Of Pearl", code: "B19", description: "Premium mother of pearl with flat finish", image: "/assets/shirt/button-bluestripe.png" },

        { id: "b13", name: "Small Mother of Pearl", code: "B13", description: "Small size mother of pearl button", image: "/assets/shirt/button-bluestripe.png" },

        { id: "b07", name: "White Mother of Pearl", code: "B07", description: "Classic mother of pearl button", image: "/assets/shirt/button-bluestripe.png" },

        { id: "b09", name: "Honey Rimless", code: "B09", description: "Warm honey colored rimless button", image: "/assets/shirt/button-bluestripe.png" },

      ]

    },

  },

  tuxedo: {

    collar: {

      title: "Collar",

      hasContrast: true,

      options: [

        { id: "wing-tip", name: "Wing Tip", description: "The classic black-tie style, tuxedo shirt collars typically feature small, spread points that allow for a bowtie to be shown fully and unencumbered.", image: "/assets/tuxedo/callar.png" },

        { id: "classic", name: "Classic", description: "This versatile collar features a short spread and classic sharp points.", image: "/assets/tuxedo/callar.png", selected: true },

        { id: "high-widespread", name: "High Widespread", description: "Like the classic wide collar, this style offers ample space between subtly outwardly oriented points but carries a slightly shorter collar length.", image: "/assets/tuxedo/callar.png" },

      ]

    },

    placket: {

      title: "Placket",

      options: [

        { id: "hidden", name: "Hidden Button Placket", description: "Often found on tux shirts, hidden placket features a layer of fabric folded over to hide the buttons.", image: "/assets/tuxedo/body.png" },

        { id: "pique", name: "Pique Bib", description: "Finished in a special pique weave, these smart tuxedo shirts bring the perfect blend of traditional elegance and subtly textured style to any black-tie look.", image: "/assets/tuxedo/body.png", selected: true },

        { id: "pleated", name: "Pleated Bib", description: "Pleated bib - a narrow textured ribbed design—brings the perfect blend of modern elegance and subtly textured style to any black-tie look.", image: "/assets/tuxedo/body.png" },

      ]

    },

    buttons: {

      title: "Buttons",

      searchable: true,

      options: [

        { id: "stud-black", name: "Tuxedo Stud Black", code: "BC13", description: "Classic black tuxedo stud buttons for formal occasions.", image: "/assets/tuxedo/button.png", selected: true },

        { id: "stud-white", name: "Tuxedo Stud White Mother Of Pearl", code: "BC17", description: "Elegant white mother of pearl tuxedo studs for refined formal wear.", image: "/assets/tuxedo/button.png" },

      ]

    },

    cuff: {

      title: "Cuff",

      options: [

        { id: "single-one", name: "Single Cuff One Button", description: "A classic single cuff with a single button closure and rounded edges.", image: "/assets/tuxedo/hand.png" },

        { id: "single-chisel", name: "Single Chisel", description: "Formal & business-ready squared cuffs feature a broad angled closure.", image: "/assets/tuxedo/hand.png" },

        { id: "single-boat", name: "Single Boat Adjustable", description: "The single-boat adjustable cuff has a practical second button running parallel to the cuff edge, allowing you to adjust the tightness of the cuff around the wrist, or open it altogether for a casual appeal.", image: "/assets/tuxedo/hand.png" },

        { id: "double-round", name: "Double Cuff Round", description: "Double cuffs feature fabric folded back onto itself which must be fastened with cufflinks.", image: "/assets/tuxedo/hand.png", selected: true },

        { id: "double-square", name: "Double Cuff Square", description: "Double cuffs feature fabric folded back onto itself which must be fastened with cufflinks.", image: "/assets/tuxedo/hand.png" },

      ]

    },

  },

  pant: {

    fit: {

      title: "Fit",

      options: [

        { id: "slim", name: "Slim Fit", description: "Modern slim fit with tapered leg.", image: "/assets/customize/fit.svg", selected: true },

      ]

    },

    pleats: {

      title: "Pleats",

      options: [

        { id: "none", name: "No Pleats", description: "Clean flat front design.", image: "/assets/customize/pleats.svg", selected: true },

      ]

    },

    pockets: {

      title: "Pockets",

      options: [

        { id: "side", name: "Side Pockets", description: "Classic side slash pockets.", image: "/assets/customize/pockets.svg", selected: true },

      ]

    },

    hem: {

      title: "Hem",

      options: [

        { id: "standard", name: "Standard Hem", description: "Traditional finished hem.", image: "/assets/customize/hem.svg", selected: true },

      ]

    },

  },

  "tuxedo-pant": {

    fit: {

      title: "Fit",

      options: [

        { id: "slim", name: "Slim Fit", description: "Formal slim fit tuxedo pant.", image: "/assets/customize/fit.svg", selected: true },

      ]

    },

    pleats: {

      title: "Pleats",

      options: [

        { id: "single", name: "Single Pleat", description: "Elegant single pleat for formal wear.", image: "/assets/customize/pleats.svg", selected: true },

      ]

    },

    stripe: {

      title: "Satin Stripe",

      options: [

        { id: "black", name: "Black Satin", description: "Classic black satin side stripe.", image: "/assets/customize/placket.svg", selected: true },

      ]

    },

    hem: {

      title: "Hem",

      options: [

        { id: "standard", name: "Standard Hem", description: "Traditional finished hem.", image: "/assets/customize/hem.svg", selected: true },

      ]

    },

  },

  jacket: {

    lapel: {

      title: "Lapel",

      options: [

        { id: "notch", name: "Notch Lapel", description: "Classic notch lapel for versatile wear.", image: "/assets/customize/lapel.svg", selected: true },

      ]

    },

    buttons: {

      title: "Buttons",

      options: [

        { id: "two", name: "Two Button", description: "Classic two-button jacket closure.", image: "/assets/customize/jacket-buttons.svg", selected: true },

      ]

    },

    vents: {

      title: "Vents",

      options: [

        { id: "double", name: "Double Vent", description: "Two rear vents for ease of movement.", image: "/assets/customize/vents.svg", selected: true },

      ]

    },

    pockets: {

      title: "Pockets",

      options: [

        { id: "flap", name: "Flap Pockets", description: "Traditional flap-style front pockets.", image: "/assets/customize/pockets.svg", selected: true },

      ]

    },

  },

  "tuxedo-jacket": {

    lapel: {

      title: "Lapel",

      options: [

        { id: "peak", name: "Peak Lapel Satin", description: "Formal peak lapel with satin finish.", image: "/assets/customize/lapel.svg", selected: true },

      ]

    },

    buttons: {

      title: "Buttons",

      options: [

        { id: "one", name: "One Button", description: "Single button formal closure.", image: "/assets/customize/jacket-buttons.svg", selected: true },

      ]

    },

    vents: {

      title: "Vents",

      options: [

        { id: "double", name: "Double Vent", description: "Two rear vents for formal elegance.", image: "/assets/customize/vents.svg", selected: true },

      ]

    },

    pockets: {

      title: "Pockets",

      options: [

        { id: "jetted", name: "Jetted Pockets", description: "Sleek jetted pockets for formal wear.", image: "/assets/customize/pockets.svg", selected: true },

      ]

    },

  },

  waistcoat: {

    style: {

      title: "Style",

      options: [

        { id: "vneck", name: "V-Neck", description: "Classic V-neck waistcoat style.", image: "/assets/customize/waistcoat-style.svg", selected: true },

      ]

    },

    buttons: {

      title: "Buttons",

      options: [

        { id: "five", name: "Five Button", description: "Traditional five-button closure.", image: "/assets/customize/jacket-buttons.svg", selected: true },

      ]

    },

    back: {

      title: "Back",

      options: [

        { id: "strap", name: "Adjustable Strap", description: "Adjustable back strap for perfect fit.", image: "/assets/customize/fit.svg", selected: true },

      ]

    },

    pockets: {

      title: "Pockets",

      options: [

        { id: "welt", name: "Welt Pockets", description: "Elegant welt pockets for formal wear.", image: "/assets/customize/pockets.svg", selected: true },

      ]

    },

  },

  coat: {

    style: {

      title: "Style",

      options: [

        { id: "single", name: "Single Breasted", description: "Classic single-breasted coat style.", image: "/assets/customize/coat-style.svg", selected: true },

      ]

    },

    buttons: {

      title: "Buttons",

      options: [

        { id: "three", name: "Three Button", description: "Traditional three-button closure.", image: "/assets/customize/jacket-buttons.svg", selected: true },

      ]

    },

    vents: {

      title: "Vents",

      options: [

        { id: "center", name: "Center Vent", description: "Single center back vent.", image: "/assets/customize/vents.svg", selected: true },

      ]

    },

    pockets: {

      title: "Pockets",

      options: [

        { id: "flap", name: "Flap Pockets", description: "Classic flap front pockets.", image: "/assets/customize/pockets.svg", selected: true },

      ]

    },

  },

};



// Style names for each garment type

const styleNames = {

  shirt: "Classic",

  tuxedo: "Widespread Piqué",

  pant: "Classic Fit",

  "tuxedo-pant": "Slim Fit Formal",

  jacket: "Modern Classic",

  "tuxedo-jacket": "Peak Lapel Formal",

  waistcoat: "Formal V-Neck",

  coat: "Single Breasted Classic",

};



// Route mapping for navigation

const typeToRoute = {

  shirt: "/shirt",

  tuxedo: "/tuxedo-shirt",

  pant: "/pant",

  "tuxedo-pant": "/tuxedo-pant",

  jacket: "/jacket",

  "tuxedo-jacket": "/tuxedo-jacket",

  waistcoat: "/waistcoat",

  coat: "/coat",

};



export default function FabricPanel({ fabrics, selected, onSelect, garmentType = "shirt", onFocusAreaChange, onPieceChange }) {

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [showFullscreen, setShowFullscreen] = useState(false);

  const [selectedFabricDetail, setSelectedFabricDetail] = useState(null);

  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const [sortBy, setSortBy] = useState("default");

  const [selectedColors, setSelectedColors] = useState([]);

  const [activeTab, setActiveTab] = useState("fabric");

  const [collapsedSections, setCollapsedSections] = useState({

    sort: false,

    color: false

  });

  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);

  const [showStyleConfirm, setShowStyleConfirm] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [customizeSearch, setCustomizeSearch] = useState("");

  const [activeDetailTab, setActiveDetailTab] = useState("main"); // "main" or "contrast"



  // Handle category selection - notify parent of focus area

  const handleCategoryClick = (categoryKey) => {

    setSelectedCategory(categoryKey);

    if (onFocusAreaChange) {

      onFocusAreaChange(categoryKey);

    }

  };



  // Handle back button - reset focus

  const handleBackClick = () => {

    setSelectedCategory(null);

    setCustomizeSearch("");

    setActiveDetailTab("main");

    if (onFocusAreaChange) {

      onFocusAreaChange(null);

    }

  };



  const handleGoToStyle = () => {

    setShowStyleConfirm(false);

    const route = typeToRoute[garmentType] || "/";

    navigate(route);

  };



  const filteredFabrics = (Array.isArray(fabrics) ? fabrics : []).filter((f) =>

    (f?.name || "").toLowerCase().includes(searchTerm.toLowerCase())

  );



  const normalizePartKey = (part) => {

    const slug = (part?.slug || "").toLowerCase();

    if (slug.includes("collar")) return "collar";

    if (slug.includes("cuff")) return "cuff";

    if (slug.includes("sleeve")) return "sleeve";

    if (slug.includes("placket")) return "placket";

    if (slug.includes("chest") && slug.includes("pocket")) return "chestPocket";

    const name = (part?.name || "").toLowerCase();

    if (name === "collar") return "collar";

    if (name === "cuff") return "cuff";

    if (name === "sleeve") return "sleeve";

    if (name === "placket") return "placket";

    if (name === "chest pocket") return "chestPocket";

    return (part?.slug || part?.name || "").toString();

  };



  const serverCategories = (() => {

    if (garmentType !== "shirt") return null;

    const parts = Array.isArray(selected?.parts) ? selected.parts : [];

    if (parts.length === 0) return null;

    const out = {};

    parts.forEach((part) => {

      const key = normalizePartKey(part);

      if (!key) return;

      const types = Array.isArray(part?.types) ? part.types : [];

      if (types.length === 0) return;

      out[key] = {

        title: part?.name || key,

        options: types.map((t) => ({

          id: t?.id || t?.slug || t?.name,

          name: t?.name || "",

          description: t?.description || "",

          image: t?.asset?.url || t?.imageUrl || null,

          selected: !!t?.isDefault,

          raw: t,

        })),

      };

    });

    return Object.keys(out).length ? out : null;

  })();



  const categoriesSource = serverCategories || customizationOptions[garmentType] || customizationOptions.shirt;



  const openFabricDetail = (fabric, e) => {

    e.stopPropagation();

    setSelectedFabricDetail(fabric);

    setShowModal(true);

  };



  const closeModal = () => {

    setShowModal(false);

    setShowFullscreen(false);

    setSelectedFabricDetail(null);

  };



  const openFullscreen = (e) => {

    e.stopPropagation();

    setShowFullscreen(true);

  };



  const closeFullscreen = () => {

    setShowFullscreen(false);

  };



  return (

    <div className="fabric-panel">

      <div className="fabric-panel-header">

        <h2 className="fabric-panel-title">Choose Your Fabric</h2>

        <p className="fabric-panel-subtitle">Select from our premium collection</p>



        <div className="fabric-tabs">

          <button

            className={`fabric-tab ${activeTab === "fabric" ? "active" : ""}`}

            onClick={() => setActiveTab("fabric")}

          >

            Fabric

          </button>

          <button

            className={`fabric-tab ${activeTab === "customize" ? "active" : ""}`}

            onClick={() => setActiveTab("customize")}

          >

            Customize

          </button>

          <button

            className={`fabric-tab ${activeTab === "finish" ? "active" : ""}`}

            onClick={() => setActiveTab("finish")}

          >

            Finish

          </button>

        </div>



        <QuickAccessToolbar 
          isToolbarCollapsed={isToolbarCollapsed} 
          setIsToolbarCollapsed={setIsToolbarCollapsed} 
        />



        {/* FABRIC TAB CONTENT */}

        {activeTab === "fabric" && (

          <>

            <div className="fabric-search-bar">

              <div className="fabric-search-input-wrapper">

                <input

                  type="text"

                  placeholder="Search fabrics..."

                  className="fabric-search-input"

                  value={searchTerm}

                  onChange={(e) => setSearchTerm(e.target.value)}

                />

              </div>

              <button className="fabric-filter-btn" onClick={() => setShowFilterPanel(true)}>

                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">

                  <path d="M4 4h16M4 8h10M4 12h6M4 16h10M4 20h16" strokeWidth="2" strokeLinecap="round" />

                </svg>

                Filter

              </button>

            </div>



            <div className="fabric-list-modern">

              {filteredFabrics.map((fabric) => (

                <div

                  key={fabric.id}

                  className={`fabric-row-card ${

                    selected?.id === fabric.id ? "active" : ""

                  }`}

                  onClick={() => onSelect(fabric)}

                >

                  <div className="fabric-row-border"></div>

                  <div className="fabric-row-content">

                    <div className="fabric-row-image-wrapper">

                      {fabric.thumbnail ? (

                        <img src={fabric.thumbnail} alt={fabric.name} className="fabric-thumbnail" />

                      ) : (

                        <div

                          className="fabric-color-swatch"

                          style={{ backgroundColor: fabric.color || "#ccc" }}

                        >

                          {fabric.pattern === "stripe" && <div className="fabric-pattern stripe" />}

                        </div>

                      )}

                      {selected?.id === fabric.id && (

                        <div className="fabric-row-checkmark">

                          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">

                            <polyline points="20 6 9 17 4 12" />

                          </svg>

                        </div>

                      )}

                      <div className="fabric-row-info" onClick={(e) => openFabricDetail(fabric, e)}>

                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">

                          <circle cx="12" cy="12" r="10" />

                          <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />

                        </svg>

                      </div>

                    </div>

                    <div className="fabric-info">

                      <h4 className="fabric-name">{fabric.name}</h4>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </>

        )}



        {/* CUSTOMIZE TAB CONTENT */}

        {activeTab === "customize" && (

          <div className="customize-panel">

            {!selectedCategory ? (

              // Category Selection View

              <>

                {/* Your Style Section */}

                <div className="your-style-card" onClick={() => setShowStyleConfirm(true)}>

                  <div className="your-style-icon">

                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">

                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />

                    </svg>

                  </div>

                  <div className="your-style-info">

                    <span className="your-style-label">Your Style</span>

                    <span className="your-style-value">{styleNames[garmentType] || "Classic"}</span>

                  </div>

                  <div className="your-style-edit">

                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />

                      <polyline points="13 2 13 8 19 8" />

                      <line x1="12" y1="18" x2="12" y2="12" />

                      <line x1="9" y1="15" x2="15" y2="15" />

                    </svg>

                  </div>

                </div>



                {/* Customization Categories */}

                <div className="customize-categories">

                  {Object.entries(categoriesSource).map(([key, category]) => (

                    <div 

                      key={key} 

                      className="customize-category-card"

                      onClick={() => handleCategoryClick(key)}

                    >

                      <div className="customize-category-image">

                        <img src={selected?.thumbnail || category.options?.[0]?.image} alt={category.title} />

                      </div>

                      <div className="customize-category-info">

                        <h4>{category.title}</h4>

                        <p>{category.options?.find(o => o.selected)?.name || category.options?.[0]?.name}</p>

                      </div>

                      <div className="customize-category-arrow">

                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

                          <path d="M9 18l6-6-6-6" />

                        </svg>

                      </div>

                    </div>

                  ))}

                </div>

              </>

            ) : (

              // Detail Options View

              <>

                {/* Back Header */}

                <div className="customize-detail-header">

                  <button className="customize-back-btn" onClick={handleBackClick}>

                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

                      <path d="M15 18l-6-6 6-6" />

                    </svg>

                  </button>

                  <h3 className="customize-detail-title">

                    {categoriesSource?.[selectedCategory]?.title}

                  </h3>

                </div>



                {/* Optional: Contrast/Second Tab for some categories */}

                {(selectedCategory === "collar" || selectedCategory === "cuff") && !!categoriesSource?.[selectedCategory]?.contrastOptions?.length && (

                  <div className="customize-detail-tabs">

                    <button 

                      className={activeDetailTab === "main" ? "active" : ""}

                      onClick={() => setActiveDetailTab("main")}

                    >

                      {selectedCategory === "collar" ? "Collar" : "Cuff"}

                    </button>

                    <button 

                      className={activeDetailTab === "contrast" ? "active" : ""}

                      onClick={() => setActiveDetailTab("contrast")}

                    >

                      Contrast

                    </button>

                  </div>

                )}



                {/* Search (for buttons category) */}

                {categoriesSource?.[selectedCategory]?.searchable && (


                  <div className="customize-detail-search">

                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

                      <circle cx="11" cy="11" r="8" />

                      <path d="M21 21-4.35-4.35" strokeLinecap="round" />

                    </svg>

                    <input

                      type="text"

                      placeholder="Search"

                      value={customizeSearch}

                      onChange={(e) => setCustomizeSearch(e.target.value)}

                    />

                  </div>

                )}



                {/* Options List */}

                <div className="customize-options-list">

                  {(() => {

                    const category = categoriesSource?.[selectedCategory];

                    if (!category) return null;


                    

                    // Use contrast options when contrast tab is active and available

                    const optionsToShow = (activeDetailTab === "contrast" && category.contrastOptions) 

                      ? category.contrastOptions 

                      : category.options;

                    

                    const filteredOptions = optionsToShow.filter(opt => 

                      customizeSearch === "" || 

                      opt.name.toLowerCase().includes(customizeSearch.toLowerCase()) ||

                      opt.code?.toLowerCase().includes(customizeSearch.toLowerCase())

                    );

                    

                    return filteredOptions.map((option) => (

                      <div 

                        key={option.id} 

                        className={`customize-option-card ${option.selected ? 'selected' : ''}`}

                        onClick={() => {

                          // Trigger focus area zoom when selecting a style option

                          if (onFocusAreaChange && selectedCategory) {

                            onFocusAreaChange(selectedCategory);

                          }



                          // Trigger layer update in parent component

                          if (onPieceChange && selectedCategory) {

                            onPieceChange(selectedCategory, option, activeDetailTab === "contrast");

                          }

                        }}

                      >

                        <div className="customize-option-image">

                          <img 
                            src={activeDetailTab === "contrast" ? (option.image || selected?.thumbnail) : (option.image || selected?.thumbnail)} 
                            alt={option.name} 
                            onError={(e) => {
                              e.target.src = selected?.thumbnail || "/assets/shirt/body.avif";
                            }}
                          />

                        </div>

                        <div className="customize-option-info">

                          <div className="customize-option-header">

                            <h4>{option.name}</h4>

                            {option.code && <span className="customize-option-code">{option.code}</span>}

                          </div>

                          <p className="customize-option-desc">{option.description}</p>

                        </div>

                      </div>

                    ));

                  })()}

                </div>

              </>

            )}

          </div>

        )}



        {/* FINISH TAB CONTENT */}

        {activeTab === "finish" && (

          <div className="finish-panel">

            {/* Selected Fabric Preview */}

            <div className="finish-fabric-preview">

              <h3 className="finish-panel-title">Selected Design</h3>

              <div className="finish-fabric-card-small">

                <div className="finish-fabric-image-small">

                  {selected?.thumbnail ? (

                    <img src={selected.thumbnail} alt={selected.name} />

                  ) : (

                    <div 

                      className="finish-fabric-swatch"

                      style={{ backgroundColor: selected?.color || '#ccc' }}

                    >

                      {selected?.pattern === 'stripe' && <div className="fabric-pattern stripe" />}

                    </div>

                  )}

                </div>

                <div className="finish-fabric-info">

                  <span className="finish-fabric-name">{selected?.name || 'No fabric selected'}</span>

                  <span className="finish-fabric-type">{styleNames[garmentType] || 'Classic'}</span>

                </div>

              </div>

            </div>



            {/* Full Preview */}

            <div className="finish-full-preview">

              <h3 className="finish-panel-title">Full Preview</h3>

              <div className="finish-full-image-wrapper">

                {selected?.layers?.map((layer, index) => (

                  <img

                    key={index}

                    src={layer}

                    alt={`${selected?.name} layer ${index + 1}`}

                    className="finish-full-layer"

                    style={{ zIndex: index }}

                  />

                ))}

              </div>

            </div>



            {/* Action Button */}

            <button 

              className="finish-action-btn"

              onClick={() => {

                // Navigate to finish page with selected fabric data

                navigate('/finish', {

                  state: {

                    garmentType,

                    fabric: selected,

                    styleName: styleNames[garmentType] || 'Classic',

                    customizationOptions: customizationOptions[garmentType] || customizationOptions.shirt

                  }

                });

              }}

            >

              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

                <polyline points="20 6 9 17 4 12" />

              </svg>

              <span>Complete & Review</span>

            </button>

          </div>

        )}



        {showStyleConfirm && (

          <div className="style-confirm-overlay" onClick={() => setShowStyleConfirm(false)}>

            <div className="style-confirm-modal" onClick={(e) => e.stopPropagation()}>

              <h3 className="style-confirm-title">Move to Choose your style?</h3>

              <p className="style-confirm-subtitle">

                This will take you to the style selection page for the current garment.

              </p>

              <div className="style-confirm-actions">

                <button className="style-confirm-btn cancel" onClick={() => setShowStyleConfirm(false)}>

                  No

                </button>

                <button className="style-confirm-btn confirm" onClick={handleGoToStyle}>

                  Yes

                </button>

              </div>

            </div>

          </div>

        )}



        <FabricDetailModal 
          showModal={showModal} 
          selectedFabricDetail={selectedFabricDetail} 
          closeModal={closeModal} 
          openFullscreen={openFullscreen} 
          onSelect={onSelect} 
        />



        {/* Fullscreen Preview */}

        {showFullscreen && selectedFabricDetail && (

          <div className="fabric-fullscreen-overlay" onClick={closeFullscreen}>

            <div className="fabric-fullscreen-content" onClick={(e) => e.stopPropagation()}>

              <button className="fabric-fullscreen-close" onClick={closeFullscreen}>

                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">

                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />

                </svg>

              </button>

              <div className="fabric-fullscreen-image">

                {selectedFabricDetail.layers?.map((layer, index) => (

                  <img

                    key={index}

                    src={layer}

                    alt={`${selectedFabricDetail.name} layer ${index + 1}`}

                    className="fabric-fullscreen-layer"

                    style={{ zIndex: index }}

                  />

                ))}

              </div>

              <p className="fabric-fullscreen-name">{selectedFabricDetail.name}</p>

            </div>

          </div>

        )}



        <FabricFilterPanel 
          showFilterPanel={showFilterPanel} 
          setShowFilterPanel={setShowFilterPanel} 
          collapsedSections={collapsedSections} 
          setCollapsedSections={setCollapsedSections} 
          sortBy={sortBy} 
          setSortBy={setSortBy} 
          selectedColors={selectedColors} 
          setSelectedColors={setSelectedColors} 
        />

      </div>

    </div>

  );

}