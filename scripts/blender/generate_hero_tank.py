#!/usr/bin/env python3
"""
Procedural 外浮顶储罐 hero tank for V2-A.
Reads scripts/blender/hero_tank_spec.json (same ratios as src/data/heroTankSpec.ts).

Run headless:
  blender --background --python scripts/blender/generate_hero_tank.py

Or from repo root:
  ./scripts/blender/export-hero-tank.sh
"""

from __future__ import annotations

import json
import math
import os
from pathlib import Path

import bpy
from mathutils import Vector

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
SPEC_PATH = SCRIPT_DIR / "hero_tank_spec.json"


def load_spec() -> dict:
    with open(SPEC_PATH, encoding="utf-8") as f:
        return json.load(f)


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in bpy.data.meshes:
        if block.users == 0:
            bpy.data.meshes.remove(block)
    for block in bpy.data.materials:
        if block.users == 0:
            bpy.data.materials.remove(block)


def make_material(name: str, rgba: list[float], metallic: float, roughness: float) -> bpy.types.Material:
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    out = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = tuple(rgba)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat


def add_cylinder(
    name: str,
    radius: float,
    depth: float,
    location: Vector,
    mat: bpy.types.Material,
    vertices: int = 64,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices,
        radius=radius,
        depth=depth,
        location=location,
    )
    obj = bpy.context.active_object
    obj.name = name
    obj.data.materials.append(mat)
    return obj


def add_box(
    name: str,
    size: Vector,
    location: Vector,
    mat: bpy.types.Material,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (size.x / 2, size.y / 2, size.z / 2)
    bpy.ops.object.transform_apply(scale=True)
    obj.data.materials.append(mat)
    return obj


def add_empty(name: str, location: Vector, parent: bpy.types.Object | None = None) -> bpy.types.Object:
    bpy.ops.object.empty_add(type="PLAIN_AXES", location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.empty_display_size = 0.15
    if parent:
        obj.parent = parent
    return obj


def build_tank(spec: dict) -> bpy.types.Object:
    base = spec["base"]
    r = base["radius"]
    h = base["height"]
    mats = spec["materials"]
    shell_mat = make_material("Shell", mats["shell"]["baseColor"], mats["shell"]["metallic"], mats["shell"]["roughness"])
    roof_mat = make_material("Roof", mats["roof"]["baseColor"], mats["roof"]["metallic"], mats["roof"]["roughness"])
    detail_mat = make_material("Detail", mats["detail"]["baseColor"], mats["detail"]["metallic"], mats["detail"]["roughness"])
    rail_mat = make_material("Rail", mats["rail"]["baseColor"], mats["rail"]["metallic"], mats["rail"]["roughness"])

    root = add_empty("tank_hero_root", Vector((0, 0, 0)))

    foundation = spec["foundation"]
    fh = h * foundation["heightRatio"]
    add_cylinder(
        "foundation",
        r * foundation["radiusRatio"],
        fh,
        Vector((0, 0, fh / 2)),
        detail_mat,
    ).parent = root

    shell_h = h * 0.97
    add_cylinder("shell", r, shell_h, Vector((0, 0, fh + shell_h / 2)), shell_mat).parent = root

    panels = spec["shellPanels"]
    panel_arc = (2 * math.pi) / panels
    panel_w = r * 0.08
    panel_d = r * 0.012
    for i in range(panels):
        a = i * panel_arc
        px = math.cos(a) * (r + panel_d * 0.5)
        py = math.sin(a) * (r + panel_d * 0.5)
        pz = fh + shell_h / 2
        bpy.ops.mesh.primitive_cube_add(size=1, location=(px, py, pz))
        panel = bpy.context.active_object
        panel.name = f"shell_panel_{i:02d}"
        panel.scale = (panel_w / 2, panel_d / 2, shell_h * 0.92 / 2)
        panel.rotation_euler = (0, 0, a)
        bpy.ops.object.transform_apply(scale=True, rotation=True)
        panel.data.materials.append(shell_mat)
        panel.parent = root

    roof_y = fh + h * spec["roofHeightRatio"]
    roof_r = r * spec["roofRadiusRatio"]
    add_cylinder("floating_roof", roof_r, h * 0.045, Vector((0, 0, roof_y)), roof_mat).parent = root
    add_cylinder("roof_center", roof_r * 0.88, h * 0.018, Vector((0, 0, roof_y + h * 0.02)), roof_mat).parent = root

    seal = spec["seal"]
    add_cylinder(
        "seal_gallery",
        r * seal["radiusOutRatio"],
        h * seal["heightRatio"],
        Vector((0, 0, fh + h * 0.985)),
        detail_mat,
    ).parent = root

    walkway = spec["walkway"]
    wy = fh + h + walkway["heightRatio"] * h * 0.5
    outer = r * walkway["radiusRatio"]
    inner = r * 0.98
    bpy.ops.mesh.primitive_torus_add(
        major_radius=(outer + inner) / 2,
        minor_radius=(outer - inner) / 2,
        location=(0, 0, wy),
    )
    deck = bpy.context.active_object
    deck.name = "walkway_deck"
    deck.data.materials.append(detail_mat)
    deck.parent = root

    rail_h = h * walkway["railHeightRatio"]
    posts = walkway["railPosts"]
    for i in range(posts):
        a = (i / posts) * 2 * math.pi
        rx = math.cos(a) * outer
        ry = math.sin(a) * outer
        add_box(
            f"walkway_rail_{i:02d}",
            Vector((0.04, 0.04, rail_h)),
            Vector((rx, ry, wy + rail_h / 2)),
            rail_mat,
        ).parent = root

    ladder = spec["ladder"]
    angle = ladder["angleRadians"]
    ladder_w = r * ladder["widthRatio"]
    rail_off = r * ladder["railOffsetRatio"]
    lx = math.cos(angle) * (r + rail_off)
    lz = math.sin(angle) * (r + rail_off)
    ladder_root = add_empty("ladder", Vector((lx, lz, 0)))
    ladder_root.rotation_euler = (0, 0, -angle + math.pi / 2)
    ladder_root.parent = root
    rungs = ladder["cageRungs"]
    for i in range(rungs):
        y = fh + 0.35 + (i / max(rungs - 1, 1)) * (h * 0.82)
        add_box(f"ladder_rung_{i}", Vector((ladder_w, 0.03, 0.035)), Vector((0, 0, y)), detail_mat).parent = ladder_root
    add_box("ladder_rail_l", Vector((0.04, 0.04, h * 0.88)), Vector((-ladder_w / 2, 0, fh + h * 0.44)), detail_mat).parent = ladder_root
    add_box("ladder_rail_r", Vector((0.04, 0.04, h * 0.88)), Vector((ladder_w / 2, 0, fh + h * 0.44)), detail_mat).parent = ladder_root

    for i, pipe in enumerate(spec["pipes"]):
        py = fh + h * pipe["heightRatio"]
        plen = r * pipe["lengthRatio"]
        pr = r * pipe["radiusRatio"]
        pa = pipe["angleRadians"]
        nx, nz = math.cos(pa), math.sin(pa)
        cx = nx * r + nx * plen / 2
        cy = nz * r + nz * plen / 2
        cz = py
        bpy.ops.mesh.primitive_cylinder_add(
            vertices=12,
            radius=pr,
            depth=plen,
            location=(cx, cy, cz),
            rotation=(math.pi / 2, 0, pa),
        )
        pipe_obj = bpy.context.active_object
        pipe_obj.name = f"pipe_{i}"
        pipe_obj.data.materials.append(detail_mat)
        pipe_obj.parent = root

    vent = spec["vent"]
    va = vent["angleRadians"]
    vx = math.cos(va) * roof_r * 0.35
    vy = math.sin(va) * roof_r * 0.35
    add_cylinder(
        "vent_stack",
        r * vent["radiusRatio"],
        h * vent["heightRatio"],
        Vector((vx, vy, roof_y + h * vent["heightRatio"] * 0.5)),
        detail_mat,
        vertices=16,
    ).parent = root

    for name, (nx, nz) in spec["anchors"].items():
        add_empty(name, Vector((nx * r, nz * r, roof_y + 0.08)), parent=root)

    return root


def export_glb(spec: dict, root: bpy.types.Object) -> str:
    rel_out = spec["export"]["output"]
    out_path = (REPO_ROOT / rel_out).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    bpy.ops.object.select_all(action="DESELECT")

    def select_tree(obj: bpy.types.Object) -> None:
        obj.select_set(True)
        for child in obj.children:
            select_tree(child)

    select_tree(root)

    bpy.ops.export_scene.gltf(
        filepath=str(out_path),
        export_format="GLB",
        use_selection=True,
        export_apply=spec["export"].get("applyModifiers", True),
        export_extras=spec["export"].get("exportExtras", True),
        export_yup=True,
    )
    return str(out_path)


def main() -> None:
    spec = load_spec()
    clear_scene()
    root = build_tank(spec)
    out = export_glb(spec, root)
    print(f"[generate_hero_tank] Exported: {out}")


if __name__ == "__main__":
    main()
