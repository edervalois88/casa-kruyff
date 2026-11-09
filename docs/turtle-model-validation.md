# Decorative turtle model — November 9, 2026

The original procedural model has been replaced by an image-conditioned,
textured reconstruction generated with TRELLIS. The source is the existing
AI-edited studio photograph `public/images/catalog/decorative-turtle-01.webp`.
This is an illustrative reconstruction, not a scan or an exact product replica.
Unseen surfaces and fine details are inferred. The catalog retains that disclosure.

## Generation and export

- Service: https://huggingface.co/spaces/trellis-community/TRELLIS
- Seed 42, 20 structure steps, 20 latent steps, guidance 7.5 / 3.0,
  simplification 0.90, 2048 px texture.
- A subsequent three-view attempt was stopped by the service's daily GPU quota.
  It did not produce a replacement asset.
- `scripts/export-textured-model.py` creates matching GLB and USDZ assets with
  embedded texture, normals, UV coordinates and Y-up orientation.
- Maximum display dimension is 0.5 m for presentation only. Physical dimensions
  have not been supplied; this must not be treated as a measured AR scale.

## Validation

- Both exports contain the same mesh with 27,498 triangles and a 2048 px texture.
- GLB reopened with trimesh and rendered in the browser using model-viewer 4.4.0.
- Manual drag changed the rendered viewpoint and the viewer's view announcement.
- USDZ reopened with OpenUSD 26.11 and passed its installed validation suite
  with zero errors, including packaged asset references and shader types.
- The product's existing viewer supplies `ios-src` and enables `quick-look`.
- The production USDZ endpoint served `model/vnd.usdz+zip` over HTTPS.

An actual iPhone / Safari Quick Look test has **not** been performed. Desktop
rendering, structural validation and correct MIME type do not establish native
iPhone compatibility. The remaining acceptance test is opening the product in
Safari on a compatible iPhone, selecting 3D Model, then View in Your Space.
