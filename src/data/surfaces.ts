import type { Surface } from "../models/surface";

export const surfaces: Surface[] = [
  {
    id: "mobile-portrait",
    name: "Mobile Portrait",
    width: 320,
    height: 480,
    padding: 16,

    safeArea: {
      top: 12,
      right: 12,
      bottom: 12,
      left: 12
    },

    minTapTarget: 44,
    minTextSize: 14,

    viewingDistance: "near",
    touchOnly: true
  },

  { 
    id: "mobile-landscape",
    name: "Mobile Landscape",
    width: 480,
    height: 320,
    padding: 16,

    safeArea: {
      top: 12,
      right: 12,
      bottom: 12,
      left: 12
    },

    minTapTarget: 44,
    minTextSize: 14,

    viewingDistance: "near",
    touchOnly: true
  },

  {
    id: "tv-lower-third",
    name: "TV Lower Third",
    width: 1920,
    height: 250,
    padding: 20,

    safeArea: {
      top: 10,
      right: 30,
      bottom: 10,
      left: 30
    },

    minTextSize: 32,

    viewingDistance: "far",
    touchOnly: false
  },

  {
    id: "square-kiosk",
    name: "Square Kiosk",
    width: 1080,
    height: 1080,
    padding: 30,

    safeArea: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    },

    minTapTarget: 60,
    minTextSize: 18,

    viewingDistance: "medium",
    touchOnly: true
  },

  {
    id: "constrained-banner",
    name: "Constrained Banner",
    width: 320,
    height: 100,
    padding: 10,

    safeArea: {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5
    },

    minTapTarget: 44,
    minTextSize: 14,

    viewingDistance: "near",
    touchOnly: true
  }
];