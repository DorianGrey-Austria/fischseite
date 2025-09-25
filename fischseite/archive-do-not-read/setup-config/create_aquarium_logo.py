import bpy
import bmesh
import mathutils
from mathutils import Vector
import math

def clear_scene():
    """Clear all mesh objects from the scene"""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False, confirm=False)

def setup_transparent_scene():
    """Setup scene for transparent background rendering"""
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.render.film_transparent = True
    scene.render.resolution_x = 512
    scene.render.resolution_y = 512
    scene.render.resolution_percentage = 100

    # Set up transparent world
    if bpy.context.scene.world:
        world = bpy.context.scene.world
    else:
        world = bpy.data.worlds.new("TransparentWorld")
        bpy.context.scene.world = world

    world.use_nodes = True
    world_nodes = world.node_tree.nodes
    world_nodes.clear()

    # Transparent background
    bg_node = world_nodes.new(type='ShaderNodeBackground')
    bg_node.inputs[0].default_value = (0, 0, 0, 0)  # Transparent
    bg_node.inputs[1].default_value = 0

    output_node = world_nodes.new(type='ShaderNodeOutputWorld')
    world.node_tree.links.new(bg_node.outputs[0], output_node.inputs[0])

def create_scalar_fish():
    """Create a realistic Scalar fish (Pterophyllum)"""
    # Create the main body (flattened oval)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(0, 0, 0))
    fish_body = bpy.context.active_object
    fish_body.name = "ScalarFish_Body"

    # Scale to make it flatter and more scalar-like
    fish_body.scale = (0.8, 1.5, 0.3)
    bpy.ops.object.transform_apply(scale=True)

    # Add subdivision for smoothness
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.subdivide(number_cuts=2)
    bpy.ops.object.mode_set(mode='OBJECT')

    # Create dorsal fin (top fin)
    bpy.ops.mesh.primitive_cube_add(location=(0, 0.5, 0.8))
    dorsal_fin = bpy.context.active_object
    dorsal_fin.name = "ScalarFish_DorsalFin"
    dorsal_fin.scale = (0.6, 0.1, 1.2)
    bpy.ops.object.transform_apply(scale=True)

    # Create anal fin (bottom fin)
    bpy.ops.mesh.primitive_cube_add(location=(0, 0.5, -0.8))
    anal_fin = bpy.context.active_object
    anal_fin.name = "ScalarFish_AnalFin"
    anal_fin.scale = (0.5, 0.1, 1.0)
    bpy.ops.object.transform_apply(scale=True)

    # Create pectoral fins
    bpy.ops.mesh.primitive_cube_add(location=(0.6, 0.2, 0))
    pectoral_fin = bpy.context.active_object
    pectoral_fin.name = "ScalarFish_PectoralFin"
    pectoral_fin.scale = (0.3, 0.05, 0.6)
    bpy.ops.object.transform_apply(scale=True)

    # Create tail
    bpy.ops.mesh.primitive_cube_add(location=(0, -1.3, 0))
    tail = bpy.context.active_object
    tail.name = "ScalarFish_Tail"
    tail.scale = (0.4, 0.3, 0.8)
    bpy.ops.object.transform_apply(scale=True)

    # Select all fish parts and join them
    bpy.ops.object.select_all(action='DESELECT')
    fish_body.select_set(True)
    dorsal_fin.select_set(True)
    anal_fin.select_set(True)
    pectoral_fin.select_set(True)
    tail.select_set(True)
    bpy.context.view_layer.objects.active = fish_body
    bpy.ops.object.join()

    # Add fish material
    fish_material = bpy.data.materials.new(name="ScalarFish_Material")
    fish_material.use_nodes = True
    nodes = fish_material.node_tree.nodes
    nodes.clear()

    # Create fish shader
    bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
    bsdf.inputs[0].default_value = (0.8, 0.7, 0.3, 1.0)  # Golden yellow
    bsdf.inputs[4].default_value = 0.3  # Metallic
    bsdf.inputs[7].default_value = 0.2  # Roughness

    output = nodes.new(type='ShaderNodeOutputMaterial')
    fish_material.node_tree.links.new(bsdf.outputs[0], output.inputs[0])

    fish_body.data.materials.append(fish_material)

    # Position the fish
    fish_body.location = (0, 0, 0.5)
    fish_body.rotation_euler = (0, 0, math.radians(15))  # Slight tilt

    return fish_body

def create_aquatic_plants():
    """Create simple aquatic plants"""
    plants = []

    for i in range(3):
        # Create plant stem
        bpy.ops.mesh.primitive_cylinder_add(
            radius=0.05,
            depth=2,
            location=(1.5 + i*0.5, -1, -0.5)
        )
        plant = bpy.context.active_object
        plant.name = f"Plant_{i+1}"

        # Scale and bend slightly
        plant.scale[2] = 0.8 + i*0.2
        plant.rotation_euler = (math.radians(10 + i*5), 0, math.radians(i*10))

        # Create plant material
        plant_material = bpy.data.materials.new(name=f"Plant_Material_{i}")
        plant_material.use_nodes = True
        nodes = plant_material.node_tree.nodes
        nodes.clear()

        bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
        bsdf.inputs[0].default_value = (0.2, 0.6, 0.3, 1.0)  # Green
        bsdf.inputs[7].default_value = 0.8  # Roughness

        output = nodes.new(type='ShaderNodeOutputMaterial')
        plant_material.node_tree.links.new(bsdf.outputs[0], output.inputs[0])

        plant.data.materials.append(plant_material)
        plants.append(plant)

    return plants

def create_bubbles():
    """Create floating bubbles"""
    bubbles = []

    for i in range(8):
        radius = 0.05 + (i % 3) * 0.02
        x = -1.5 + i*0.3
        y = -0.5 + (i % 2) * 0.3
        z = 0.5 + i*0.2

        bpy.ops.mesh.primitive_uv_sphere_add(
            radius=radius,
            location=(x, y, z)
        )
        bubble = bpy.context.active_object
        bubble.name = f"Bubble_{i+1}"

        # Create bubble material (transparent)
        bubble_material = bpy.data.materials.new(name=f"Bubble_Material_{i}")
        bubble_material.use_nodes = True
        bubble_material.blend_method = 'BLEND'
        nodes = bubble_material.node_tree.nodes
        nodes.clear()

        bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
        bsdf.inputs[0].default_value = (0.8, 0.9, 1.0, 0.2)  # Light blue, transparent
        bsdf.inputs[15].default_value = 1.0  # Transmission
        bsdf.inputs[16].default_value = 1.33  # IOR (water)

        output = nodes.new(type='ShaderNodeOutputMaterial')
        bubble_material.node_tree.links.new(bsdf.outputs[0], output.inputs[0])

        bubble.data.materials.append(bubble_material)
        bubbles.append(bubble)

    return bubbles

def create_text():
    """Create the text 'Aquaristikfreunde Steiermark'"""
    # Create main text
    bpy.ops.object.text_add(location=(0, -2.5, -1))
    text_obj = bpy.context.active_object
    text_obj.name = "LogoText"

    # Set text content
    text_obj.data.body = "Aquaristikfreunde\nSteiermark"
    text_obj.data.align_x = 'CENTER'
    text_obj.data.align_y = 'CENTER'

    # Adjust text properties
    text_obj.data.size = 0.3
    text_obj.data.extrude = 0.05
    text_obj.data.bevel_depth = 0.01

    # Create text material
    text_material = bpy.data.materials.new(name="Text_Material")
    text_material.use_nodes = True
    nodes = text_material.node_tree.nodes
    nodes.clear()

    bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
    bsdf.inputs[0].default_value = (0.0, 0.4, 0.6, 1.0)  # Deep blue
    bsdf.inputs[4].default_value = 0.8  # Metallic
    bsdf.inputs[7].default_value = 0.1  # Roughness

    output = nodes.new(type='ShaderNodeOutputMaterial')
    text_material.node_tree.links.new(bsdf.outputs[0], output.inputs[0])

    text_obj.data.materials.append(text_material)

    return text_obj

def setup_lighting():
    """Setup appropriate lighting for the scene"""
    # Add key light
    bpy.ops.object.light_add(type='SUN', location=(3, 3, 5))
    sun = bpy.context.active_object
    sun.data.energy = 3
    sun.data.color = (0.9, 0.95, 1.0)  # Slightly blue tint

    # Add fill light
    bpy.ops.object.light_add(type='AREA', location=(-2, 2, 3))
    area_light = bpy.context.active_object
    area_light.data.energy = 1
    area_light.data.color = (0.8, 0.9, 1.0)  # Blue fill
    area_light.data.size = 2

def setup_camera():
    """Setup camera for optimal logo view"""
    # Add camera
    bpy.ops.object.camera_add(location=(0, -4, 1))
    camera = bpy.context.active_object
    camera.rotation_euler = (math.radians(80), 0, 0)

    # Set as active camera
    bpy.context.scene.camera = camera

    # Adjust camera settings
    camera.data.lens = 50
    camera.data.clip_start = 0.1
    camera.data.clip_end = 100

def main():
    """Main function to create the complete logo"""
    print("Starting Aquarium Logo creation...")

    # Clear and setup
    clear_scene()
    setup_transparent_scene()

    # Create elements
    fish = create_scalar_fish()
    plants = create_aquatic_plants()
    bubbles = create_bubbles()
    text = create_text()

    # Setup scene
    setup_lighting()
    setup_camera()

    print("Aquarium Logo created successfully!")
    print("Elements created:")
    print("- Scalar fish with realistic proportions")
    print("- Aquatic plants")
    print("- Floating bubbles")
    print("- Text: 'Aquaristikfreunde Steiermark'")
    print("- Transparent background setup")
    print("- Professional lighting")

if __name__ == "__main__":
    main()