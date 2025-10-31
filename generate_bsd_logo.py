#!/usr/bin/env python3
"""
BSD Logo - Daemon Formalism
A sophisticated visual expression of BSD's foundational infrastructure through
geometric precision, systematic patterns, and minimal typography.
"""

from PIL import Image, ImageDraw, ImageFont
import math

# Canvas dimensions - large format for high quality
WIDTH = 2400
HEIGHT = 2400

# Color palette - infrastructure inspired
COLOR_BG = "#F5F1E8"  # Warm neutral background
COLOR_PRIMARY = "#C84E3F"  # Terracotta red (daemon warmth)
COLOR_DARK = "#1A1A1A"  # Deep black (terminal void)
COLOR_ACCENT = "#E8914E"  # Bright orange (connection spark)
COLOR_SUBTLE = "#8B7D6B"  # Muted brown (technical annotation)

def create_canvas():
    """Create the base canvas"""
    img = Image.new('RGB', (WIDTH, HEIGHT), COLOR_BG)
    draw = ImageDraw.Draw(img)
    return img, draw

def draw_daemon_circle(draw, center_x, center_y, radius, color, width=8):
    """Draw a precise circle representing the daemon core"""
    bbox = [
        center_x - radius,
        center_y - radius,
        center_x + radius,
        center_y + radius
    ]
    draw.ellipse(bbox, outline=color, width=width)

def draw_trident_geometry(draw, center_x, center_y, size):
    """
    Draw abstract trident/fork geometry - representing:
    - The daemon's pitchfork
    - BSD's forking history (FreeBSD, OpenBSD, NetBSD)
    - Hierarchical process trees
    """
    # Central vertical line (main process)
    line_top = center_y - size * 1.2
    line_bottom = center_y + size * 0.3
    draw.line(
        [(center_x, line_top), (center_x, line_bottom)],
        fill=COLOR_PRIMARY,
        width=10
    )

    # Three prongs (three major BSD forks)
    prong_width = size * 0.8
    prong_height = size * 0.5

    # Left prong
    draw.line(
        [(center_x, line_top), (center_x - prong_width, line_top - prong_height)],
        fill=COLOR_PRIMARY,
        width=10
    )

    # Center prong
    draw.line(
        [(center_x, line_top), (center_x, line_top - prong_height)],
        fill=COLOR_PRIMARY,
        width=10
    )

    # Right prong
    draw.line(
        [(center_x, line_top), (center_x + prong_width, line_top - prong_height)],
        fill=COLOR_PRIMARY,
        width=10
    )

    # Add small circles at prong endpoints (network nodes)
    node_radius = 15
    endpoints = [
        (center_x - prong_width, line_top - prong_height),  # Left
        (center_x, line_top - prong_height),  # Center
        (center_x + prong_width, line_top - prong_height),  # Right
    ]

    for ex, ey in endpoints:
        draw.ellipse(
            [ex - node_radius, ey - node_radius, ex + node_radius, ey + node_radius],
            fill=COLOR_ACCENT,
            outline=COLOR_DARK,
            width=3
        )

def draw_process_grid(draw, center_x, center_y, grid_size, spacing):
    """
    Draw a systematic grid of small marks representing distributed processes
    Pattern builds systemic truth through repetition
    """
    half_grid = (grid_size * spacing) // 2

    for i in range(grid_size):
        for j in range(grid_size):
            x = center_x - half_grid + i * spacing
            y = center_y - half_grid + j * spacing

            # Skip center area (where main geometry lives)
            dist = math.sqrt((x - center_x)**2 + (y - center_y)**2)
            if dist < 400 or dist > 900:
                continue

            # Small squares representing background processes
            mark_size = 6
            draw.rectangle(
                [x - mark_size//2, y - mark_size//2,
                 x + mark_size//2, y + mark_size//2],
                fill=COLOR_SUBTLE,
                outline=None
            )

def draw_concentric_rings(draw, center_x, center_y, num_rings, start_radius, ring_spacing):
    """
    Concentric circles suggesting infinite loops, cyclical processes
    Each ring meticulously spaced
    """
    for i in range(num_rings):
        radius = start_radius + i * ring_spacing
        draw_daemon_circle(draw, center_x, center_y, radius, COLOR_SUBTLE, width=2)

def add_technical_typography(draw, img):
    """
    Add minimal, technical typography - annotations, not narration
    Text as visual element, not explanation
    """
    # Load monospace font for technical feel
    try:
        font_path = "C:/Users/kyuhy/.claude/skills/canvas-design/canvas-fonts/GeistMono-Regular.ttf"
        font_small = ImageFont.truetype(font_path, 32)
        font_tiny = ImageFont.truetype(font_path, 24)
    except:
        font_small = ImageFont.load_default()
        font_tiny = ImageFont.load_default()

    # Top annotation - version/technical marker
    draw.text(
        (WIDTH // 2, 180),
        "BSD",
        fill=COLOR_DARK,
        font=font_small,
        anchor="mm"
    )

    # Bottom technical annotations (sparse, clinical)
    annotations = [
        "DAEMON",
        "PROCESS",
        "FORK"
    ]

    y_start = HEIGHT - 200
    spacing = 60
    for i, text in enumerate(annotations):
        draw.text(
            (WIDTH // 2, y_start + i * spacing),
            text,
            fill=COLOR_SUBTLE,
            font=font_tiny,
            anchor="mm"
        )

    # Corner version markers (subtle, like engineering specs)
    draw.text(
        (100, HEIGHT - 100),
        "v4.4",
        fill=COLOR_SUBTLE,
        font=font_tiny,
        anchor="lm"
    )

    draw.text(
        (WIDTH - 100, HEIGHT - 100),
        "1977—",
        fill=COLOR_SUBTLE,
        font=font_tiny,
        anchor="rm"
    )

def draw_connecting_lines(draw, center_x, center_y):
    """
    Subtle connecting lines suggesting network topology, protocol layers
    Refined placement showing master-level spatial orchestration
    """
    # Horizontal and vertical axis lines (faint)
    axis_length = 600
    draw.line(
        [(center_x - axis_length, center_y), (center_x + axis_length, center_y)],
        fill=COLOR_SUBTLE,
        width=1
    )
    draw.line(
        [(center_x, center_y - axis_length), (center_x, center_y + axis_length)],
        fill=COLOR_SUBTLE,
        width=1
    )

def main():
    """Generate the BSD logo artwork"""
    img, draw = create_canvas()

    center_x = WIDTH // 2
    center_y = HEIGHT // 2

    # Layer 1: Systematic grid of processes (background layer)
    draw_process_grid(draw, center_x, center_y, grid_size=40, spacing=60)

    # Layer 2: Concentric rings (cyclical processes, infinite loops)
    draw_concentric_rings(draw, center_x, center_y, num_rings=8, start_radius=450, ring_spacing=40)

    # Layer 3: Subtle connecting lines (network topology)
    draw_connecting_lines(draw, center_x, center_y)

    # Layer 4: Main daemon circle (the core)
    draw_daemon_circle(draw, center_x, center_y, radius=350, color=COLOR_PRIMARY, width=12)

    # Layer 5: Trident/fork geometry (the iconic form)
    draw_trident_geometry(draw, center_x, center_y, size=200)

    # Layer 6: Typography (sparse, clinical, technical)
    add_technical_typography(draw, img)

    # Save high-quality output
    output_path = "bsd_logo.png"
    img.save(output_path, "PNG", optimize=True)
    print(f"BSD logo created: {output_path}")

    return output_path

if __name__ == "__main__":
    main()
