import type { ResolvedLayout } from "../models/layout";

interface AdSurfaceProps {
  layout: ResolvedLayout;
  background: string;
}

export default function AdSurface({
  layout,
  background
}: AdSurfaceProps) {
  return (
    <div
      style={{
        position: "relative",
        width: layout.surfaceWidth,
        height: layout.surfaceHeight,
        background,
        overflow: "hidden",
        border: "2px solid #222",
        boxSizing: "border-box"
      }}
    >
      {layout.elements.map((element) => {
        if (!element.visible) {
          return null;
        }

        const commonStyle = {
          position: "absolute" as const,
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          boxSizing: "border-box" as const,
          overflow: "hidden" as const
        };

        /*
         * --------------------------------
         * HEADLINE
         * --------------------------------
         */
        if (element.id === "headline") {
          return (
            <div
              key={element.id}
              style={{
                ...commonStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
                fontSize: element.fontSize,
                fontWeight: 800,
                textAlign: "center",
                lineHeight: 1.1,
                color: "#111827"
              }}
            >
              Next Generation
              <br />
              Smartphone
            </div>
          );
        }

        /*
         * --------------------------------
         * PRODUCT IMAGE
         * --------------------------------
         */
        if (element.id === "product-image") {
          return (
            <div
              key={element.id}
              style={{
                ...commonStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 10
              }}
            >
              <div
                style={{
                  width: "70%",
                  height: "80%",
                  minWidth: 40,
                  minHeight: 40,
                  borderRadius: 18,
                  border: "3px solid #374151",
                  background:
                    "linear-gradient(135deg, #e5e7eb, #9ca3af)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: Math.max(
                    10,
                    (element.fontSize ?? 16) - 4
                  ),
                  fontWeight: 700,
                  color: "#374151"
                }}
              >
                PHONE
              </div>
            </div>
          );
        }

        /*
         * --------------------------------
         * PRICE
         * --------------------------------
         */
        if (element.id === "price") {
          return (
            <div
              key={element.id}
              style={{
                ...commonStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: element.fontSize,
                fontWeight: 800,
                color: "#111827"
              }}
            >
              ₹49,999
            </div>
          );
        }

        /*
         * --------------------------------
         * CTA
         * --------------------------------
         */
        if (element.id === "cta") {
          return (
            <div
              key={element.id}
              style={{
                ...commonStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 8
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  background: "#111827",
                  color: "white",
                  fontSize: Math.max(
                    11,
                    element.fontSize ?? 16
                  ),
                  fontWeight: 800,
                  letterSpacing: 0.5
                }}
              >
                BUY NOW
              </div>
            </div>
          );
        }

        /*
         * --------------------------------
         * LOGO
         * --------------------------------
         */
        if (element.id === "logo") {
          return (
            <div
              key={element.id}
              style={{
                ...commonStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: Math.max(
                  12,
                  element.fontSize ?? 16
                ),
                fontWeight: 900,
                letterSpacing: 1,
                color: "#111827"
              }}
            >
              FLAMAI
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}