import { useEffect, useState } from "react";

/**
 * Gets bounding boxes for an element. This is implemented for you
 */
export function getElementBounds(elem: HTMLElement) {
  const bounds = elem.getBoundingClientRect();
  const top = bounds.top + window.scrollY;
  const left = bounds.left + window.scrollX;

  return {
    x: left,
    y: top,
    top,
    left,
    width: bounds.width,
    height: bounds.height,
  };
}

/**
 * **TBD:** Implement a function that checks if a point is inside an element
 */
export function isPointInsideElement(
  coordinate: { x: number; y: number },
  element: HTMLElement
): boolean {
  const rect = getElementBounds(element);

  if ((coordinate.x > rect.left && coordinate.x < rect.left + rect.width) && (coordinate.y > rect.top && coordinate.y > rect.top + rect.height)) {
    return true;
  } else {
    return false;
  }
}

/**
 * **TBD:** Implement a function that returns the height of the first line of text in an element
 * We will later use this to size the HTML element that contains the hover player
 */
export function getLineHeightOfFirstLine(element: HTMLElement): number {
  const range = document.createRange();
  const textMode = element.firstChild;

  if (!textMode || textMode.nodeType !== Node.TEXT_NODE) {
    return getElementBounds(element).height;
  }

  range.setStart(textMode, 0);
  range.setEnd(textMode, 1);

  const rects = range.getClientRects();

  if (rects.length > 0) {
    return rects[0].height;
  }

  const computedStyle = window.getComputedStyle(element);
  const lineWeight = parseFloat(computedStyle.lineHeight);

  if (!isNaN(lineWeight)) {
    return lineWeight;
  }

  return getElementBounds(element).height;
}

export type HoveredElementInfo = {
  element: HTMLElement | null;
  top: number;
  left: number;
  heightOfFirstLine: number;
};

/**
 * **TBD:** Implement( a React hook to be used to help to render hover player
 * Return the absolute coordinates on where to render the hover player
 * Returns null when there is no active hovered paragraph
 * Note: If using global event listeners, attach them window instead of document to ensure tests pass
 */
export function useHoveredParagraphCoordinate(
  parsedElements: HTMLElement[]
): HoveredElementInfo | null {
  const [hoverInfo, setHoverInfo] = useState<HoveredElementInfo>({
    top: 0,
    left: 0,
    element: null,
    heightOfFirstLine: 0,
  })

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target && parsedElements.includes(target)) {
        const rect = getElementBounds(target);
        setHoverInfo({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          element: target,
          heightOfFirstLine: getLineHeightOfFirstLine(target)
        })
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && parsedElements.includes(target)) {
        setHoverInfo({
          top: 0,
          left: 0,
          element: null,
          heightOfFirstLine: 0
        })
      }
    }

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    }
  }, [parsedElements])

  return hoverInfo;
}