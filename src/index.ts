import Logger from "@kjn/logger";
import EventEmitter from "@kjn/event-emitter";

export default class SvgPanZoom extends EventEmitter {
  #logger: Logger;

  #svgElement: HTMLElement;

  // Keep track of whether we're in 'dragging' mode. Since we're ALWAYS listening on every mouse on the whole document
  // we need to know that should be dragging the svg element with our mouse movements.
  #draggingSvg: boolean;

  // When dragging we need to update the x, and y coorindates of the viewBox. To figure out the relative drag distances
  // we require a starting position to compare with the position after dragging.
  #lastMouseXPosition: number;
  #lastMouseYPosition: number;

  constructor(svgElement: HTMLElement, options: { logger?: Logger }) {
    super();
    this.#draggingSvg = false;
    this.#lastMouseXPosition = -1;
    this.#lastMouseYPosition = -1;

    if (options?.logger) {
      this.#logger = options.logger;
    } else {
      this.#logger = new Logger("svg-pan-zoom");
    }

    const viewBox = svgElement.getAttribute("viewBox");
    if (viewBox) {
      // To keep a consistent zoom experience the viewBox is reset on init.
      this.#logger.warn(
        "Overwriting existing viewbox of svg element",
        svgElement as unknown as string
      );
    }
    svgElement.setAttribute("viewBox", `0 0 ${svgElement.clientWidth} ${svgElement.clientHeight}`);

    // Keep the x, and y positions and update the dragging state
    svgElement.addEventListener("mousedown", (ev) => {
      this.#draggingSvg = true;
      this.#lastMouseXPosition = ev.clientX;
      this.#lastMouseYPosition = ev.clientY;
    });

    // Remove the x, and y positions and update the dragging state
    document.addEventListener("mouseup", () => {
      this.#draggingSvg = false;
      this.#lastMouseXPosition = -1;
      this.#lastMouseYPosition = -1;
    });

    document.addEventListener("mousemove", (ev) => {
      if (!this.#draggingSvg) {
        return;
      }

      // Get the current viewBox values
      const [viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight] = this.viewBox;

      // Compare the current mouse position with the previous position
      const { clientX: mouseXPosition, clientY: mouseYposition } = ev;
      const deltaX = this.#lastMouseXPosition - mouseXPosition;
      const deltaY = this.#lastMouseYPosition - mouseYposition;

      // Scale with how much we should pan the svg viewBox
      // Intuition: zoomed in -> less pixels on the screen -> panning should be scaled down.
      const panDeltaX = deltaX / this.scale;
      const panDeltaY = deltaY / this.scale;

      // Update the viewbox of the svgElement
      this.#svgElement.setAttribute(
        "viewBox",
        `${viewBoxX + panDeltaX} ${viewBoxY + panDeltaY} ${viewBoxWidth} ${viewBoxHeight}`
      );

      // Store the new lastMousePositions
      this.#lastMouseXPosition = mouseXPosition;
      this.#lastMouseYPosition = mouseYposition;
    });

    svgElement.addEventListener("wheel", (ev) => {
      // Use the mouse position relative to the svg element.
      const { offsetX: mouseX, offsetY: mouseY } = ev;

      // Based on our mouse position we calculate how much of the relative delta should be added to the left side (and the right side).
      // the intuition here is that if our mouse is at the left most position the increment should be added 100% on the rightside.
      const leftSideRatio = mouseX / this.#svgElement.clientWidth;
      const topSideRatio = mouseY / this.#svgElement.clientHeight;

      // ev.deltaY is positive on zooming out and negative on zooming in.
      const zoomPercentage = ev.deltaY * -1;
      const zoomRatio = zoomPercentage * 0.01;
      this.zoom(zoomRatio, leftSideRatio, topSideRatio);
    });

    this.#svgElement = svgElement;
  }

  zoom(zoomRatio: number, leftSideRatio = 0.5, topSideRatio = 0.5) {
    const [viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight] = this.viewBox;

    // Calculate how much width and height should be added to the viewBox
    // Intution: zooming in with a factor 0.10, means that the viewBox should become 10% smaller
    const deltaViewBoxWidth = viewBoxWidth * zoomRatio * -1;
    const deltaViewBoxHeight = viewBoxHeight * zoomRatio * -1;

    // Calculate the new viewBox width and height based on the zoomRatio.
    // Intuition: when zooming in the viewBox is showing less pixels
    const newViewBoxWidth = viewBoxWidth + deltaViewBoxWidth;
    const newViewBoxHeight = viewBoxHeight + deltaViewBoxHeight;

    // Calculate the new x and y positions based on the left and top side ratios
    // Intuition: zooming in on the left means that the viewBoxWidth gets smaller
    //  which means that deltaViewBoxWidth is < 0.
    //  which means that viewBoxX should increase.
    //  therefore
    const newViewBoxX = viewBoxX + -1 * deltaViewBoxWidth * leftSideRatio;
    const newViewBoxY = viewBoxY + -1 * deltaViewBoxHeight * topSideRatio;

    this.#svgElement.setAttribute(
      "viewBox",
      `${newViewBoxX} ${newViewBoxY} ${newViewBoxWidth} ${newViewBoxHeight}`
    );

    this.$emit("zoom", this.scale);
  }

  get scale() {
    const [, , viewBoxWidth, viewBoxHeight] = this.viewBox;
    const widthScale = this.#svgElement.clientWidth / viewBoxWidth;
    const heightScale = this.#svgElement.clientHeight / viewBoxHeight;

    if (widthScale.toFixed(2) !== heightScale.toFixed(2)) {
      this.#logger.error(`Got inconsistent scale: ${widthScale} vs ${heightScale}`);
    }

    return widthScale;
  }

  get viewBox() {
    const viewBoxAttr = this.#svgElement.getAttribute("viewBox");
    if (!viewBoxAttr) {
      throw Error("No viewBox attr found on svgElement, please don't remove viewBox");
    }

    return viewBoxAttr.split(" ").map(Number);
  }
}
