import bpy
import os

def render_logo():
    """Render the logo as PNG with transparent background"""

    # Set render settings
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.render.film_transparent = True
    scene.render.resolution_x = 512
    scene.render.resolution_y = 512
    scene.render.resolution_percentage = 100

    # Set output format to PNG with transparency
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.image_settings.color_depth = '8'
    scene.render.image_settings.compression = 15  # Good compression

    # Set output path
    output_path = "/Users/doriangrey/Desktop/coding/fischseite/aquarium_logo_3d.png"
    scene.render.filepath = output_path

    # Set cycles samples for good quality but reasonable render time
    scene.cycles.samples = 128
    scene.cycles.use_denoising = True

    # Render
    print(f"Rendering logo to: {output_path}")
    bpy.ops.render.render(write_still=True)

    print("Logo rendered successfully!")
    print(f"Output file: {output_path}")
    print("Resolution: 512x512 PNG with transparency")

if __name__ == "__main__":
    render_logo()