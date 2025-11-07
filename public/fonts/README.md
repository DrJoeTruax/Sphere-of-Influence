# Three.js Fonts

This directory should contain fonts in the Three.js typeface.json format for the Text3D component.

## Required File:

**helvetiker_regular.typeface.json**

## How to Obtain:

1. Download from Three.js repository:
   - https://github.com/mrdoob/three.js/tree/master/examples/fonts

2. Or use the CDN link:
   - https://threejs.org/examples/fonts/helvetiker_regular.typeface.json

3. Place the file in this directory as `helvetiker_regular.typeface.json`

## Alternative:

If the font file is missing, the "Sphere of Influence" ring component will not render text.
You can comment out the `<SphereOfInfluenceRing />` component in EnhancedSolarSystem.tsx if needed.
