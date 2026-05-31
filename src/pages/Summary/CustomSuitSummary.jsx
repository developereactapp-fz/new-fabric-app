import { Box, Grid } from "@mui/material";
import SummaryHeader from "./components/SummaryHeader";
import GarmentCard from "./components/GarmentCard";
import FabricInfoCard from "./components/FabricInfoCard";
import InvestmentCard from "./components/InvestmentCard";
import FeatureCard from "./components/FeatureCard";

export default function CustomSuitSummary() {
  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: 6, background: "#fafafa" }}>
      <SummaryHeader />

      <Grid container spacing={4} mt={2}>
        {/* LEFT COLUMN */}
        <Grid item xs={12} lg={8}>
          <GarmentCard
            title="Jacket"
            price="₹18,999"
            image="/dummy/jacket.jpg"
            items={[
              { label: "Fabric", value: "Navy Herringbone Wool" },
              { label: "Button", value: "Black Horn" },
              { label: "Lining", value: "Full Lined" },
              { label: "Lapel", value: "Notch" },
              { label: "Pockets", value: "Flap Pockets" },
              { label: "Vent", value: "Double Vent" },
            ]}
          />

          <GarmentCard
            title="Trousers"
            price="₹8,999"
            image="/dummy/trouser.jpg"
            items={[
              { label: "Waistband", value: "Standard" },
              { label: "Pocket", value: "Side Pockets" },
              { label: "Pleat", value: "No Pleat" },
              { label: "Finishing", value: "Premium" },
              { label: "Cuff", value: "No Cuff" },
              { label: "Belt Loops", value: "Standard" },
            ]}
          />

          <GarmentCard
            title="Waistcoat"
            price="₹5,000"
            image="/dummy/waistcoat.jpg"
            items={[
              { label: "Style", value: "Single Breasted" },
              { label: "Fabric", value: "Matching" },
              { label: "Button", value: "Matching" },
              { label: "Back", value: "Adjustable" },
              { label: "Pockets", value: "Welt Pockets" },
            ]}
          />
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid item xs={12} lg={4}>
          <FabricInfoCard />
          <InvestmentCard />
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={6}>
        <FeatureCard
          title="Master Tailoring"
          desc="Handcrafted by expert artisans with 40+ years experience"
        />
        <FeatureCard
          title="Free Alterations"
          desc="Complimentary adjustments within 30 days of delivery"
        />
        <FeatureCard
          title="Worldwide Delivery"
          desc="Premium packaging with tracking and insurance included"
        />
      </Grid>
    </Box>
  );
}
