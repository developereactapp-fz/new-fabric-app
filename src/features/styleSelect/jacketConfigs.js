export const jacketConfigs = {
  basic: {
    title: "Choose your jacket style",
    types: {
      jacket: {
        label: "Jacket",
        description: "Classic blazer with modern tailoring.",
        layers: [
          "/assets/shirt/body-bluestripe.png",
          "/assets/shirt/hands-bluestripe.png",
          "/assets/shirt/collar-bluestripe.png",
          "/assets/shirt/cuff-bluestripe.png",
          "/assets/shirt/button-bluestripe.png",
        ],
        redirect: "/customize/jacket",
      },
      "tuxedo-jacket": {
        label: "Tuxedo Jacket",
        description: "Elegant dinner jacket with satin lapels.",
        layers: [
          "/assets/tuxedo/body.png",
          "/assets/tuxedo/hand.png",
          "/assets/tuxedo/pocketlow.png",
          "/assets/tuxedo/pocketup.png",
          "/assets/tuxedo/callar.png",
          "/assets/tuxedo/callar1.png",
          "/assets/tuxedo/corcallar.png",
          "/assets/tuxedo/tiy.png",
          "/assets/tuxedo/button.png",
        ],
        redirect: "/customize/tuxedo-jacket",
      },
    },
  },

  premium: {
    title: "Choose premium jacket",
    types: {
      jacket: {
        label: "Premium Jacket",
        description: "Italian wool tailored jacket.",
        layers: [
          "/assets/shirt/body-bluestripe.png",
          "/assets/shirt/hands-bluestripe.png",
          "/assets/shirt/collar-bluestripe.png",
          "/assets/shirt/cuff-bluestripe.png",
          "/assets/shirt/button-bluestripe.png",
        ],
        redirect: "/customize/jacket",
      },
      "tuxedo-jacket": {
        label: "Premium Tuxedo Jacket",
        description: "Silk lapel evening jacket.",
        layers: [
          "/assets/tuxedo/body.png",
          "/assets/tuxedo/hand.png",
          "/assets/tuxedo/pocketlow.png",
          "/assets/tuxedo/pocketup.png",
          "/assets/tuxedo/callar.png",
          "/assets/tuxedo/callar1.png",
          "/assets/tuxedo/corcallar.png",
          "/assets/tuxedo/tiy.png",
          "/assets/tuxedo/button.png",
        ],
        redirect: "/customize/tuxedo-jacket",
      },
    },
  },
};
