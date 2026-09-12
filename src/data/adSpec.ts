import type { AdSpec } from "../models/ad";

export const demoAd: AdSpec = {
  id: "smartphone-ad",
  name: "Smartphone Advertisement",
  background: "#ffffff",

  elements: [
    {
      id: "headline",
      type: "headline",
      content: "Next Generation Smartphone",
      priority: 1,
      minWidth: 160,
      minHeight: 40,
      preferredWidth: 500,
      preferredHeight: 70
    },

    {
      id: "product-image",
      type: "image",
      content: "PRODUCT IMAGE",
      priority: 1,
      minWidth: 100,
      minHeight: 100,
      preferredWidth: 300,
      preferredHeight: 250,
      aspectRatio: 1.2
    },

    {
      id: "price",
      type: "price",
      content: "₹49,999",
      priority: 2,
      minWidth: 100,
      minHeight: 30,
      preferredWidth: 160,
      preferredHeight: 50
    },

    {
      id: "cta",
      type: "cta",
      content: "BUY NOW",
      priority: 2,
      minWidth: 100,
      minHeight: 40,
      preferredWidth: 160,
      preferredHeight: 50
    },

    {
      id: "logo",
      type: "logo",
      content: "FLAMAI",
      priority: 3,
      minWidth: 60,
      minHeight: 30,
      preferredWidth: 100,
      preferredHeight: 40
    }
  ]
};