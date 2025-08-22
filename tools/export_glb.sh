#!/usr/bin/env bash
# requires: blender (headless), gltf-transform installed globally

SRC_BLEND="$1"
OUT_GLTF="$2"

if [ -z "$SRC_BLEND" ] || [ -z "$OUT_GLTF" ]; then
  echo "usage: export_glb.sh file.blend out.glb"
  exit 1
fi

# Blender headless export (assumes a Python script to export)
blender --background "$SRC_BLEND" --python-expr "import bpy; bpy.ops.export_scene.gltf(filepath='$OUT_GLTF', export_format='GLB', export_draco_mesh_compression_enable=False)"

# Optimize with gltf-transform (DRACO + KTX2)
gltf-transform copy "$OUT_GLTF" "$OUT_GLTF"
gltf-transform draco "$OUT_GLTF" -s 10 -o "$OUT_GLTF"
gltf-transform ktx2 "$OUT_GLTF" -o "$OUT_GLTF" --q 80
