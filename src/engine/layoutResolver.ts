import type { AdSpec } from "../models/ad";
import type { AdElement } from "../models/element";
import type {
  ResolvedElement,
  ResolvedLayout
} from "../models/layout";
import type { Surface } from "../models/surface";

type LayoutMode =
  | "vertical"
  | "horizontal"
  | "square";

/*
 * Determines the general layout strategy
 * from the geometry of the target surface.
 */
function determineLayoutMode(
  surface: Surface
): LayoutMode {
  const aspectRatio =
    surface.width / surface.height;

  if (aspectRatio >= 2) {
    return "horizontal";
  }

  if (aspectRatio <= 0.8) {
    return "vertical";
  }

  return "square";
}

/*
 * Lower priority number means higher importance.
 *
 * Priority 1 → most important
 * Priority 2 → medium importance
 * Priority 3 → least important
 */
function sortByPriority(
  elements: AdElement[]
): AdElement[] {
  return [...elements].sort(
    (a, b) => a.priority - b.priority
  );
}

/*
 * Returns the effective safe-area boundaries.
 *
 * The surface padding and safe-area insets
 * are both treated as hard boundaries.
 */
function getBoundaries(
  surface: Surface
) {
  const safeArea = surface.safeArea;

  const left =
    surface.padding +
    (safeArea?.left ?? 0);

  const right =
    surface.width -
    surface.padding -
    (safeArea?.right ?? 0);

  const top =
    surface.padding +
    (safeArea?.top ?? 0);

  const bottom =
    surface.height -
    surface.padding -
    (safeArea?.bottom ?? 0);

  return {
    left,
    right,
    top,
    bottom,
    width: Math.max(1, right - left),
    height: Math.max(1, bottom - top)
  };
}

/*
 * Determines the minimum font size allowed
 * for an element on the target surface.
 */
function getMinimumFontSize(
  element: AdElement,
  surface: Surface
): number {
  if (element.type !== "headline" &&
      element.type !== "price") {
    return 12;
  }

  return Math.max(
    12,
    surface.minTextSize ?? 12
  );
}

/*
 * Determines the minimum dimensions required
 * for an interactive element.
 *
 * This allows touch surfaces to enforce
 * their minimum tap target.
 */
function getMinimumDimensions(
  element: AdElement,
  surface: Surface
) {
  let minWidth = element.minWidth;
  let minHeight = element.minHeight;

  if (
    element.type === "cta" &&
    surface.touchOnly &&
    surface.minTapTarget
  ) {
    minWidth = Math.max(
      minWidth,
      surface.minTapTarget
    );

    minHeight = Math.max(
      minHeight,
      surface.minTapTarget
    );
  }

  return {
    minWidth,
    minHeight
  };
}

/*
 * Creates the first layout using preferred
 * dimensions before constraint resolution.
 */
function createInitialLayout(
  elements: AdElement[],
  surface: Surface,
  mode: LayoutMode
): ResolvedElement[] {
  const resolved: ResolvedElement[] = [];

  const boundaries =
    getBoundaries(surface);

  const availableWidth =
    boundaries.width;

  const availableHeight =
    boundaries.height;

  const gap = 12;

  if (mode === "horizontal") {
    let currentX =
      boundaries.left;

    for (const element of elements) {
      const minimum =
        getMinimumDimensions(
          element,
          surface
        );

      const width =
        Math.max(
          minimum.minWidth,
          element.preferredWidth
        );

      const height =
        Math.max(
          minimum.minHeight,
          Math.min(
            element.preferredHeight,
            availableHeight
          )
        );

      resolved.push({
        id: element.id,

        x: currentX,

        y:
          boundaries.top +
          Math.max(
            0,
            (availableHeight -
              height) /
              2
          ),

        width,

        height,

        visible: true,

        fontSize:
          element.type === "headline"
            ? Math.max(
                24,
                surface.minTextSize ?? 24
              )
            : Math.max(
                16,
                surface.minTextSize ?? 16
              ),

        priority:
          element.priority,

        originalWidth:
          width,

        originalHeight:
          height,

        degradation:
          "none",

        reason:
          "Preserved at preferred size"
      });

      currentX +=
        width + gap;
    }
  } else {
    let currentY =
      boundaries.top;

    for (const element of elements) {
      const minimum =
        getMinimumDimensions(
          element,
          surface
        );

      const width =
        Math.max(
          minimum.minWidth,
          Math.min(
            element.preferredWidth,
            availableWidth
          )
        );

      const height =
        Math.max(
          minimum.minHeight,
          element.preferredHeight
        );

      resolved.push({
        id: element.id,

        x:
          boundaries.left +
          Math.max(
            0,
            (availableWidth -
              width) /
              2
          ),

        y: currentY,

        width,

        height,

        visible: true,

        fontSize:
          element.type === "headline"
            ? Math.max(
                24,
                surface.minTextSize ?? 24
              )
            : Math.max(
                16,
                surface.minTextSize ?? 16
              ),

        priority:
          element.priority,

        originalWidth:
          width,

        originalHeight:
          height,

        degradation:
          "none",

        reason:
          "Preserved at preferred size"
      });

      currentY +=
        height + gap;
    }
  }

  return resolved;
}

/*
 * Checks whether any visible element
 * violates the effective safe boundaries.
 */
function hasOverflow(
  elements: ResolvedElement[],
  surface: Surface
): boolean {
  const boundaries =
    getBoundaries(surface);

  return elements.some(
    (element) => {
      if (!element.visible) {
        return false;
      }

      const right =
        element.x +
        element.width;

      const bottom =
        element.y +
        element.height;

      return (
        right >
          boundaries.right ||
        bottom >
          boundaries.bottom ||
        element.x <
          boundaries.left ||
        element.y <
          boundaries.top
      );
    }
  );
}

/*
 * Checks whether a resolved element violates
 * a hard minimum constraint.
 */
function violatesHardConstraint(
  element: ResolvedElement,
  original: AdElement,
  surface: Surface
): boolean {
  const minimum =
    getMinimumDimensions(
      original,
      surface
    );

  if (
    element.width <
    minimum.minWidth
  ) {
    return true;
  }

  if (
    element.height <
    minimum.minHeight
  ) {
    return true;
  }

  if (
    element.fontSize !== undefined &&
    element.fontSize <
      getMinimumFontSize(
        original,
        surface
      )
  ) {
    return true;
  }

  return false;
}

/*
 * Compresses an element while respecting
 * its hard minimum dimensions.
 */
function compressElement(
  element: ResolvedElement,
  original: AdElement,
  surface: Surface
): void {
  const widthReduction = 0.8;
  const heightReduction = 0.8;

  const minimum =
    getMinimumDimensions(
      original,
      surface
    );

  element.width = Math.max(
    minimum.minWidth,
    element.width *
      widthReduction
  );

  element.height = Math.max(
    minimum.minHeight,
    element.height *
      heightReduction
  );

  if (element.fontSize) {
    element.fontSize =
      Math.max(
        getMinimumFontSize(
          original,
          surface
        ),
        element.fontSize *
          0.85
      );
  }

  element.degradation =
    "compressed";

  element.reason =
    "Compressed to fit available space while respecting surface constraints";
}

function reflowElements(
  elements: ResolvedElement[],
  adElements: AdElement[],
  surface: Surface,
  mode: LayoutMode
): void {
  const visibleElements =
    elements.filter(
      (element) => element.visible
    );

  const elementMap = new Map(
    adElements.map((element) => [
      element.id,
      element
    ])
  );

  const boundaries =
    getBoundaries(surface);

  const availableWidth =
    boundaries.width;

  const availableHeight =
    boundaries.height;

  const gap = 12;

  if (visibleElements.length === 0) {
    return;
  }

  /*
   * ------------------------------------------------
   * HORIZONTAL LAYOUT
   * ------------------------------------------------
   *
   * Each element must respect its hard
   * minimum width.
   *
   * If the minimum widths cannot fit,
   * the layout is intentionally allowed
   * to overflow here.
   *
   * resolveOverflow() will then hide
   * lower-priority elements.
   */
  if (mode === "horizontal") {
    const totalGap =
      gap *
      Math.max(
        0,
        visibleElements.length - 1
      );

    const availableItemWidth =
      Math.max(
        1,
        availableWidth - totalGap
      );

    const slotWidth =
      availableItemWidth /
      visibleElements.length;

    let currentX =
      boundaries.left;

    for (
      const element of visibleElements
    ) {
      const original =
        elementMap.get(element.id);

      if (!original) {
        continue;
      }

      const minimum =
        getMinimumDimensions(
          original,
          surface
        );

      /*
       * Never go below the hard minimum.
       *
       * This is the important correction.
       */
      element.width =
        Math.max(
          minimum.minWidth,
          Math.min(
            element.width,
            slotWidth
          )
        );

      /*
       * Height remains constrained by
       * the available surface height.
       */
      element.height =
        Math.min(
          element.height,
          availableHeight
        );

      element.height =
        Math.max(
          minimum.minHeight,
          element.height
        );

      element.x =
        currentX;

      element.y =
        boundaries.top +
        Math.max(
          0,
          (
            availableHeight -
            element.height
          ) / 2
        );

      currentX +=
        element.width + gap;
    }

    return;
  }

  /*
   * ------------------------------------------------
   * VERTICAL / SQUARE LAYOUT
   * ------------------------------------------------
   */
  const totalGap =
    gap *
    Math.max(
      0,
      visibleElements.length - 1
    );

  const availableItemHeight =
    Math.max(
      1,
      availableHeight - totalGap
    );

  const slotHeight =
    availableItemHeight /
    visibleElements.length;

  let currentY =
    boundaries.top;

  for (
    const element of visibleElements
  ) {
    const original =
      elementMap.get(element.id);

    if (!original) {
      continue;
    }

    const minimum =
      getMinimumDimensions(
        original,
        surface
      );

    /*
     * Width must stay inside the
     * available surface.
     */
    element.width =
      Math.min(
        element.width,
        availableWidth
      );

    element.width =
      Math.max(
        minimum.minWidth,
        element.width
      );

    /*
     * Respect vertical minimum size.
     */
    element.height =
      Math.min(
        element.height,
        slotHeight
      );

    element.height =
      Math.max(
        minimum.minHeight,
        element.height
      );

    element.x =
      boundaries.left +
      Math.max(
        0,
        (
          availableWidth -
          element.width
        ) / 2
      );

    element.y =
      currentY;

    currentY +=
      element.height + gap;
  }
}


function resolveOverflow(
  elements: ResolvedElement[],
  adElements: AdElement[],
  surface: Surface,
  mode: LayoutMode
): void {
  const elementMap = new Map(
    adElements.map((element) => [
      element.id,
      element
    ])
  );

  /*
   * Lower-priority elements are processed
   * first.
   *
   * Priority 3 → degraded first
   * Priority 2 → degraded second
   * Priority 1 → protected as long as possible
   */
  const degradationOrder =
    [...elements].sort(
      (a, b) => {
        const priorityA =
          elementMap.get(a.id)
            ?.priority ?? 999;

        const priorityB =
          elementMap.get(b.id)
            ?.priority ?? 999;

        return priorityB - priorityA;
      }
    );

  /*
   * ------------------------------------------------
   * STAGE 1
   * Compress lower-priority elements.
   * ------------------------------------------------
   */
  for (
    const resolved of degradationOrder
  ) {
    if (!resolved.visible) {
      continue;
    }

    const original =
      elementMap.get(resolved.id);

    if (!original) {
      continue;
    }

    /*
     * Compress only once.
     */
    if (
      resolved.degradation !== "none"
    ) {
      continue;
    }

    compressElement(
      resolved,
      original,
      surface
    );

    reflowElements(
      elements,
      adElements,
      surface,
      mode
    );

    if (
      !hasOverflow(
        elements,
        surface
      )
    ) {
      return;
    }
  }

  /*
   * ------------------------------------------------
   * STAGE 2
   * Hide lower-priority elements one by one.
   * ------------------------------------------------
   */
  for (
    const resolved of degradationOrder
  ) {
    if (!resolved.visible) {
      continue;
    }

    const currentPriority =
      elementMap.get(
        resolved.id
      )?.priority ?? 999;

    /*
     * Never hide priority-1 content
     * while a lower-priority element
     * can still be removed.
     */
    if (currentPriority === 1) {
      continue;
    }

    resolved.visible = false;

    resolved.degradation =
      "hidden";

    resolved.reason =
      "Hidden because lower-priority content must be removed to satisfy surface constraints";

    reflowElements(
      elements,
      adElements,
      surface,
      mode
    );

    if (
      !hasOverflow(
        elements,
        surface
      )
    ) {
      return;
    }
  }

  /*
   * ------------------------------------------------
   * STAGE 3
   *
   * If several priority-1 elements remain,
   * remove lower-priority priority-1 elements
   * only if necessary, while preserving at
   * least one critical element.
   * ------------------------------------------------
   */
  const criticalElements =
    elements.filter(
      (element) =>
        element.visible &&
        (
          elementMap.get(
            element.id
          )?.priority ?? 999
        ) === 1
    );

  if (
    criticalElements.length > 1 &&
    hasOverflow(
      elements,
      surface
    )
  ) {
    /*
     * Preserve the first critical element.
     * Additional critical elements may be
     * removed only when absolutely necessary.
     */
    for (
      let i = 1;
      i < criticalElements.length;
      i++
    ) {
      const element =
        criticalElements[i];

      element.visible = false;

      element.degradation =
        "hidden";

      element.reason =
        "Hidden because the surface cannot accommodate all critical elements simultaneously";

      reflowElements(
        elements,
        adElements,
        surface,
        mode
      );

      if (
        !hasOverflow(
          elements,
          surface
        )
      ) {
        return;
      }
    }
  }
}

/*
 * Main layout resolver.
 *
 * Ad Spec + Surface
 *       ↓
 * Constraint Resolution
 *       ↓
 * Resolved Layout
 */
export function resolveLayout(
  ad: AdSpec,
  surface: Surface
): ResolvedLayout {
  /*
   * Step 1:
   * Determine layout strategy.
   */
  const mode =
    determineLayoutMode(
      surface
    );

  /*
   * Step 2:
   * Sort elements by importance.
   */
  const sortedElements =
    sortByPriority(
      ad.elements
    );

  /*
   * Step 3:
   * Generate initial layout.
   */
  const resolvedElements =
    createInitialLayout(
      sortedElements,
      surface,
      mode
    );

  /*
   * Step 4:
   * Check initial constraints.
   */
  let overflow =
    hasOverflow(
      resolvedElements,
      surface
    );

  /*
   * Step 5:
   * Resolve overflow using
   * priority-based degradation.
   */
  if (overflow) {
    resolveOverflow(
      resolvedElements,
      sortedElements,
      surface,
      mode
    );

    overflow =
      hasOverflow(
        resolvedElements,
        surface
      );
  }

  /*
   * Step 6:
   * Return final resolved layout.
   */
  return {
    surfaceWidth:
      surface.width,

    surfaceHeight:
      surface.height,

    elements:
      resolvedElements,

    overflow
  };
}