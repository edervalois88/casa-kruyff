"""Export a textured GLB and matching USDZ. Requires trimesh, numpy, Pillow, usd-core.

Usage: python scripts/export-textured-model.py input.glb public/models/decorative-turtle
The 0.5 m display width is illustrative, not a measured product dimension.
"""
import argparse
from pathlib import Path
from tempfile import TemporaryDirectory

import numpy as np
import trimesh
from pxr import Gf, Sdf, Usd, UsdGeom, UsdShade, UsdUtils, UsdValidation, Vt

parser = argparse.ArgumentParser()
parser.add_argument("source", type=Path)
parser.add_argument("output", type=Path)
args = parser.parse_args()
source = trimesh.load(args.source, force="scene")
scene = trimesh.Scene()
for node in source.graph.nodes_geometry:
    transform, geometry = source.graph[node]
    mesh = source.geometry[geometry].copy()
    mesh.apply_transform(transform)
    scene.add_geometry(mesh)
scale = .5 / max(scene.extents)
scene.apply_scale(scale)
scene.apply_translation([-scene.centroid[0], -scene.bounds[0, 1], -scene.centroid[2]])
args.output.parent.mkdir(parents=True, exist_ok=True)
scene.export(args.output.with_suffix(".glb"))

with TemporaryDirectory() as directory:
    root = Path(directory)
    stage = Usd.Stage.CreateNew(str(root / "model.usdc"))
    UsdGeom.SetStageUpAxis(stage, UsdGeom.Tokens.y)
    UsdGeom.SetStageMetersPerUnit(stage, 1)
    stage.SetDefaultPrim(UsdGeom.Xform.Define(stage, "/Model").GetPrim())
    for index, node in enumerate(scene.graph.nodes_geometry):
        transform, geometry = scene.graph[node]
        mesh = scene.geometry[geometry].copy()
        mesh.apply_transform(transform)
        prim = UsdGeom.Mesh.Define(stage, f"/Model/Mesh{index}")
        prim.CreatePointsAttr(Vt.Vec3fArray.FromNumpy(mesh.vertices.astype(np.float32)))
        prim.CreateFaceVertexCountsAttr([3] * len(mesh.faces))
        prim.CreateFaceVertexIndicesAttr(mesh.faces.flatten().tolist())
        prim.CreateSubdivisionSchemeAttr(UsdGeom.Tokens.none)
        prim.CreateDoubleSidedAttr(True)
        prim.CreateNormalsAttr(Vt.Vec3fArray.FromNumpy(mesh.vertex_normals.astype(np.float32)))
        prim.SetNormalsInterpolation(UsdGeom.Tokens.vertex)
        uv = UsdGeom.PrimvarsAPI(prim).CreatePrimvar("st", Sdf.ValueTypeNames.TexCoord2fArray, UsdGeom.Tokens.vertex)
        uv.Set(Vt.Vec2fArray.FromNumpy(mesh.visual.uv.astype(np.float32)))

        material = UsdShade.Material.Define(stage, f"/Model/Material{index}")
        shader = UsdShade.Shader.Define(stage, f"/Model/Material{index}/Surface")
        shader.CreateIdAttr("UsdPreviewSurface")
        shader.CreateInput("roughness", Sdf.ValueTypeNames.Float).Set(1.0)
        shader.CreateInput("metallic", Sdf.ValueTypeNames.Float).Set(0.0)
        reader = UsdShade.Shader.Define(stage, f"/Model/Material{index}/UV")
        reader.CreateIdAttr("UsdPrimvarReader_float2")
        reader.CreateInput("varname", Sdf.ValueTypeNames.String).Set("st")
        reader.CreateOutput("result", Sdf.ValueTypeNames.Float2)
        texture = UsdShade.Shader.Define(stage, f"/Model/Material{index}/Texture")
        texture.CreateIdAttr("UsdUVTexture")
        image_name = f"texture-{index}.png"
        mesh.visual.material.baseColorTexture.save(root / image_name)
        texture.CreateInput("file", Sdf.ValueTypeNames.Asset).Set(Sdf.AssetPath(image_name))
        texture.CreateInput("sourceColorSpace", Sdf.ValueTypeNames.Token).Set("sRGB")
        texture.CreateInput("st", Sdf.ValueTypeNames.Float2).ConnectToSource(reader.ConnectableAPI(), "result")
        texture.CreateOutput("rgb", Sdf.ValueTypeNames.Float3)
        shader.CreateInput("diffuseColor", Sdf.ValueTypeNames.Color3f).ConnectToSource(texture.ConnectableAPI(), "rgb")
        shader.CreateOutput("surface", Sdf.ValueTypeNames.Token)
        material.CreateSurfaceOutput().ConnectToSource(shader.ConnectableAPI(), "surface")
        UsdShade.MaterialBindingAPI.Apply(prim.GetPrim()).Bind(material)

    stage.GetRootLayer().Save()
    assert UsdUtils.CreateNewUsdzPackage(Sdf.AssetPath(str(root / "model.usdc")), str(args.output.with_suffix(".usdz").resolve()))

usd = Usd.Stage.Open(str(args.output.with_suffix(".usdz")))
registry = UsdValidation.ValidationRegistry()
validators = [registry.GetOrLoadValidatorByName(meta.name) for meta in registry.GetAllValidatorMetadata()]
errors = UsdValidation.ValidationContext(validators).Validate(usd)
assert not errors, [error.GetMessage() for error in errors]
glb = trimesh.load(args.output.with_suffix(".glb"), force="scene")
print({"meshes": len(glb.geometry), "triangles": sum(len(m.faces) for m in glb.geometry.values()), "usd_validation_errors": len(errors), "bounds": glb.bounds.tolist()})
