# @kjn/svg-pan-zoom

[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

[![npm version](https://badge.fury.io/js/@kjn%2Fsvg-pan-zoom.svg)](https://badge.fury.io/js/@kjn%2Fsvg-pan-zoom)

Panning and zooming library for SVG

## Usage

```js
import SvgPanZoom from "@kjn/svg-pan-zoom";

// This will initialise panning and zooming for this svg element.
new SvgPanZoom(document.getElementById("svg"));
```

## Development

All source-code resides in the `src` directory. This project uses conventional commits.

### Publish

Updates to main are published automatically by semantic-release using semantic versioning based
on the commitlog.
