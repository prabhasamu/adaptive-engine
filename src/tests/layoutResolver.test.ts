import { describe, expect, test } from "vitest";

import { demoAd } from "../data/adSpec";
import { surfaces } from "../data/surfaces";
import { resolveLayout } from "../engine/layoutResolver";

describe("Adaptive Layout Engine", () => {

  test("should resolve the TV Lower Third without overflow", () => {
    const surface = surfaces.find(
      (item) => item.id === "tv-lower-third"
    );

    if (!surface) {
      throw new Error(
        "TV Lower Third surface not found"
      );
    }

    const layout = resolveLayout(
      demoAd,
      surface
    );

    expect(layout.overflow).toBe(false);

    const visibleElements =
      layout.elements.filter(
        (element) => element.visible
      );

    expect(
      visibleElements.length
    ).toBe(5);
  });


  test("should resolve the Square Kiosk without overflow", () => {
    const surface = surfaces.find(
      (item) => item.id === "square-kiosk"
    );

    if (!surface) {
      throw new Error(
        "Square Kiosk surface not found"
      );
    }

    const layout = resolveLayout(
      demoAd,
      surface
    );

    expect(layout.overflow).toBe(false);

    const visibleElements =
      layout.elements.filter(
        (element) => element.visible
      );

    expect(
      visibleElements.length
    ).toBe(5);
  });


  test("should degrade lower-priority elements on Mobile Landscape", () => {
    const surface = surfaces.find(
      (item) => item.id === "mobile-landscape"
    );

    if (!surface) {
      throw new Error(
        "Mobile Landscape surface not found"
      );
    }

    const layout = resolveLayout(
      demoAd,
      surface
    );

    expect(layout.overflow).toBe(false);

    const visibleElements =
      layout.elements.filter(
        (element) => element.visible
      );

    const hiddenElements =
      layout.elements.filter(
        (element) => !element.visible
      );

    expect(
      visibleElements.length
    ).toBeGreaterThan(0);

    expect(
      hiddenElements.length
    ).toBeGreaterThan(0);
  });


  test("should preserve highest-priority elements on constrained surfaces", () => {
    const surface = surfaces.find(
      (item) =>
        item.id === "constrained-banner"
    );

    if (!surface) {
      throw new Error(
        "Constrained Banner surface not found"
      );
    }

    const layout = resolveLayout(
      demoAd,
      surface
    );

    expect(layout.overflow).toBe(false);

    const visibleElements =
      layout.elements.filter(
        (element) => element.visible
      );

    expect(
      visibleElements.length
    ).toBeGreaterThan(0);

    /*
     * Highest-priority elements have
     * priority = 1.
     *
     * At least one priority-1 element
     * must survive.
     */
    const visibleCriticalElements =
      visibleElements.filter(
        (element) =>
          element.priority === 1
      );

    expect(
      visibleCriticalElements.length
    ).toBeGreaterThan(0);
  });


  test("should keep all elements inside surface boundaries", () => {
    for (const surface of surfaces) {
      const layout = resolveLayout(
        demoAd,
        surface
      );

      for (const element of layout.elements) {
        if (!element.visible) {
          continue;
        }

        expect(
          element.x
        ).toBeGreaterThanOrEqual(
          surface.padding
        );

        expect(
          element.y
        ).toBeGreaterThanOrEqual(
          surface.padding
        );

        expect(
          element.x + element.width
        ).toBeLessThanOrEqual(
          surface.width -
            surface.padding +
            0.01
        );

        expect(
          element.y + element.height
        ).toBeLessThanOrEqual(
          surface.height -
            surface.padding +
            0.01
        );
      }
    }
  });


  test("should produce exactly five resolved elements", () => {
    for (const surface of surfaces) {
      const layout = resolveLayout(
        demoAd,
        surface
      );

      expect(
        layout.elements.length
      ).toBe(5);
    }
  });

});