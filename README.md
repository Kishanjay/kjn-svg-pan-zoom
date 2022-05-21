# @kjn/svg-pan-zoom

[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

[![npm version](https://badge.fury.io/js/@kjn%2Fsvg-pan-zoom.svg)](https://badge.fury.io/js/@kjn%2Fsvg-pan-zoom)

[![Netlify Status](https://api.netlify.com/api/v1/badges/ce5ba025-6a43-4aaa-83f5-c7175ddbdc3f/deploy-status)](https://app.netlify.com/sites/kjn-svg-pan-zoom/deploys)

[Live Demo](http://kjn-svg-pan-zoom.netlify.app)

![Gif Demo](http://kjn-svg-pan-zoom.netlify.app/demo.gif)

The **simplest** panning and zooming library for SVG elements in HTML. The barebone approach leaves
everything besides enabling panning and zooming to the user.

This library allows your SVG elements to be both pannable and zoomable instantly without forcing
any coding style, patterns, or requirements on the user, the opt-in library approach allows you to
seamlessly add zoom and pan features to any SVG element.

# Usage

When using `npm` simply install the dependency and start using it in your projects.

```sh
npm install --save @kjn/svg-pan-zoom
OR
yarn add @kjn/svg-pan-zoom
```

After acquiring the library you can import the class in any way you'd like.

Option 1 (preferred) - using EcmaScript Modules (ESM):

```js
import SvgPanZoom from "@kjn/svg-pan-zoom";

// Adds panning and zooming capabilities to this element.
new SvgPanZoom(document.getElementById("svg"));
```

Option 2 - using CommonJS modules:

```js
const SvgPanZoom = require("@kjn/svg-pan-zoom");

// Adds panning and zooming capabilities to this element.
new SvgPanZoom(document.getElementById("svg"));
```

Example:

```html
<!-- script[type=module] allows you to import modules -->
<script type="module">
  import SvgPanZoom from "@kjn/svg-pan-zoom";

  // This will initialise panning and zooming for this svg element.
  new SvgPanZoom(document.getElementById("svg"));
</script>
```

See the examples directory for more.

# API / Docs

## Options

The options object knows the following parameters

| Option | Description                                                                |
| ------ | -------------------------------------------------------------------------- |
| logger | Object implementing `info`, `error`, `warn` `debug` and `log` as functions |

```js
const options = {
  logger: {
    info: console.info,
    error: console.error,
    warn: console.warn,
    log: console.log,
    debug: console.debug,
  },
};

new SvgPanZoom(element, options);
```

## Events

SvgPanZoom emits events on action. The events that are exposed are:

| Event | Description                                   |
| ----- | --------------------------------------------- |
| zoom  | The zoom level of the svg element has changed |
| pan   | The panning of the svg element has changed    |

```ts
const svgPanZoom = new SvgPanZoom(element);
svgPanZoom.on("zoom", (newScale: number) => {
  console.log(`The element is zoomed in ${newScale}x`);
});
svgPanZoom.on("pan", (x: number, y: number) => {
  console.log(`The top left pixel its viewBox is showing [x:${x}, y:${y}]`);
});
```

## Methods / Properties

The methods that are exposed to the user are:

| Method / Property          | Description                                         |
| -------------------------- | --------------------------------------------------- |
| zoom(desiredScale: number) | Allows the user to set the scale the svg element    |
| scale                      | Allows the user to get the scale of the svg element |

```js
const svgPanZoom = new SvgPanZoom(element);
svgPanZoom.zoom(0.1); // Increase the zoomlevel by 10%
svgPanZoom.zoom(-0.1); // Decrease the zoomlevel by 10%

console.log("The current scale is: " + svgPanZoom.scale);
```

# Development

Start dev environment

```
npm run dev
```

Since this is a small project there aren't too many development guidelines.
To just mention some things about the philosophy of this repository, please adhere to the following:

- All functional source-code should reside in the `src` directory.
- All project/setup/ non-functional code should reside outside the `src` directory
- When making fixes, features or doing any task, create a new commit in line with the [conventional
  commits guidelines](https://www.conventionalcommits.org/en/v1.0.0/)
- Respect the formatting and linting rules

# Publishing

This repository is setup to auto-publish new releases using [semantic-release](https://github.com/semantic-release/semantic-release).
Essentially this boils down to releases being versioned, tagged and published based on the
commitlog.
