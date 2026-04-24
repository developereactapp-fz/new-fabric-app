export const shirtData = {
  fabrics: [
    {
      id: "blue",
      name: "Blue Stripe",
      image: "/assets/shirt/body-bluestripe.png",
      thumbnail: "/assets/shirt/fabric-bluestripe-thumb.jpg",
      color: "#4A90E2",
      pattern: "stripe",
      layers: [
        "/assets/shirt/body-bluestripe.png",
        "/assets/shirt/hands-bluestripe.png",
        "/assets/shirt/collar-bluestripe.png",
        "/assets/shirt/cuff-bluestripe.png",
        "/assets/shirt/button-bluestripe.png"
      ]
    },
    {
      id: "white",
      name: "Oxford White",
      image: "/assets/tuxed/body-oxford-white.png",
      thumbnail: null,
      color: "#F5F5F0",
      pattern: "solid",
      layers: [
        "/assets/tuxed/body-oxford-white.png",
        "/assets/tuxed/hands-oxford-white.png",
        "/assets/tuxed/collar-oxford-white.png",
        "/assets/tuxed/cuff-oxford-white.png",
        "/assets/tuxed/button-oxford-white.png"
      ]
    }
  ],

  styles: [
    { id: "classic", name: "Classic" },
    { id: "slim", name: "Slim Fit" }
  ]
};