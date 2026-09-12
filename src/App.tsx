import { useState } from "react";

import "./App.css";

import { demoAd } from "./data/adSpec";
import { surfaces } from "./data/surfaces";
import { resolveLayout } from "./engine/layoutResolver";

import AdSurface from "./components/AdSurface";

function App() {
  const [
    selectedSurfaceId,
    setSelectedSurfaceId
  ] = useState(
    surfaces[0].id
  );

  const selectedSurface =
    surfaces.find(
      (surface) =>
        surface.id ===
        selectedSurfaceId
    ) ?? surfaces[0];

  /*
   * The layout engine receives only:
   *
   * 1. Advertisement specification
   * 2. Target surface
   *
   * It decides the final positions,
   * dimensions and visibility.
   */
  const layout =
    resolveLayout(
      demoAd,
      selectedSurface
    );

  const visibleCount =
    layout.elements.filter(
      (element) =>
        element.visible
    ).length;

  const hiddenCount =
    layout.elements.filter(
      (element) =>
        !element.visible
    ).length;

  const compressedCount =
    layout.elements.filter(
      (element) =>
        element.degradation ===
        "compressed"
    ).length;

  return (
    <div className="app">

      {/* -------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------- */}

      <header className="app-header">
        <h1>
          Adaptive Layout Engine
        </h1>

        <p>
          Priority-based advertisement
          adaptation across multiple
          surfaces.
        </p>
      </header>


      <main className="app-main">

        {/* -------------------------------- */}
        {/* SURFACE SELECTION */}
        {/* -------------------------------- */}

        <section className="controls">

          <h2>
            Select Surface
          </h2>

          <div className="surface-buttons">

            {surfaces.map(
              (surface) => (
                <button
                  key={
                    surface.id
                  }
                  className={
                    selectedSurface.id ===
                    surface.id
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectedSurfaceId(
                      surface.id
                    )
                  }
                >
                  {surface.name}
                </button>
              )
            )}

          </div>

        </section>


        {/* -------------------------------- */}
        {/* PREVIEW */}
        {/* -------------------------------- */}

        <section className="preview-section">

          <div className="preview-header">

            <div>

              <h2>
                {
                  selectedSurface.name
                }
              </h2>

              <p>
                {
                  selectedSurface.width
                }
                {" × "}
                {
                  selectedSurface.height
                }
                {" px"}
              </p>

            </div>


            <div
              className={
                layout.overflow
                  ? "status overflow"
                  : "status"
              }
            >
              {layout.overflow
                ? "Overflow"
                : "Layout Resolved"}
            </div>

          </div>


          <div className="preview-container">

            <div className="surface-wrapper">

              <AdSurface
                layout={layout}
                background={
                  demoAd.background
                }
              />

            </div>

          </div>

        </section>


        {/* -------------------------------- */}
        {/* LAYOUT SUMMARY */}
        {/* -------------------------------- */}

        <section className="summary-section">

          <h2>
            Resolution Summary
          </h2>

          <div className="summary-grid">

            <div className="summary-card">

              <strong>
                {visibleCount}
              </strong>

              <span>
                Visible
              </span>

            </div>


            <div className="summary-card">

              <strong>
                {compressedCount}
              </strong>

              <span>
                Compressed
              </span>

            </div>


            <div className="summary-card">

              <strong>
                {hiddenCount}
              </strong>

              <span>
                Hidden
              </span>

            </div>


            <div className="summary-card">

              <strong>
                {layout.elements.length}
              </strong>

              <span>
                Total Elements
              </span>

            </div>

          </div>

        </section>


        {/* -------------------------------- */}
        {/* DEBUG / RESOLVED ELEMENTS */}
        {/* -------------------------------- */}

        <section className="debug-section">

          <div className="debug-header">

            <div>

              <h2>
                Resolved Elements
              </h2>

              <p>
                The engine's final layout
                decisions for this surface.
              </p>

            </div>

          </div>


          <div className="element-list">

            {layout.elements.map(
              (element) => (

                <div
                  className={
                    `element-card ${
                      element.degradation
                    }`
                  }
                  key={
                    element.id
                  }
                >

                  <div className="element-title">

                    <strong>
                      {element.id}
                    </strong>

                    <span
                      className={
                        element.visible
                          ? "visible-badge"
                          : "hidden-badge"
                      }
                    >
                      {element.visible
                        ? "Visible"
                        : "Hidden"}
                    </span>

                  </div>


                  <div className="element-details">

                    <small>
                      Priority:{" "}
                      <strong>
                        {
                          element.priority
                        }
                      </strong>
                    </small>


                    <small>
                      Degradation:{" "}
                      <strong>
                        {
                          element.degradation
                        }
                      </strong>
                    </small>


                    <small>
                      Reason:{" "}
                      {element.reason}
                    </small>


                    <small>
                      Position:{" "}
                      {Math.round(
                        element.x
                      )}
                      ,{" "}
                      {Math.round(
                        element.y
                      )}
                    </small>


                    <small>
                      Current size:{" "}
                      {Math.round(
                        element.width
                      )}
                      {" × "}
                      {Math.round(
                        element.height
                      )}
                    </small>


                    <small>
                      Original size:{" "}
                      {Math.round(
                        element.originalWidth
                      )}
                      {" × "}
                      {Math.round(
                        element.originalHeight
                      )}
                    </small>


                    {element.fontSize && (
                      <small>
                        Font size:{" "}
                        {Math.round(
                          element.fontSize
                        )}
                        px
                      </small>
                    )}

                  </div>

                </div>

              )
            )}

          </div>

        </section>


        <section className="architecture-section">
          <div className="architecture-header">
            <h2>Adaptive Layout Pipeline</h2>
            <p>
              The layout engine resolves surface constraints using
              priority-aware compression, reflow, and degradation.
            </p>
          </div>

          <div className="pipeline">
            <div className="pipeline-step">
              <span>1</span>
              <strong>Ad Specification</strong>
              <small>
                Reads element priority, preferred size and minimum size.
              </small>
            </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step">
            <span>2</span>
            <strong>Surface Constraints</strong>
            <small>
              Calculates usable width and height from the target surface.
            </small>
          </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step">
            <span>3</span>
            <strong>Layout Mode</strong>
            <small>
              Determines horizontal, vertical or square composition.
            </small>
          </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step">
            <span>4</span>
            <strong>Priority Resolution</strong>
            <small>
              Compresses and hides lower-priority elements first.
            </small>
          </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step">
            <span>5</span>
            <strong>Reflow</strong>
            <small>
              Repositions surviving elements inside the surface.
            </small>
          </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step">
            <span>6</span>
            <strong>Resolved Layout</strong>
            <small>
              Produces the final positions, sizes and visibility.
            </small>
          </div>
        </div>
      </section>


      </main>

    </div>
  );
}

export default App;