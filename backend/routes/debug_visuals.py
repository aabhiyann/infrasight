# routes/debug_visuals.py

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse
from pathlib import Path

router = APIRouter()

VIS_DIR = Path(__file__).parents[1] / "visualizations"

@router.get("/debug/visualizations")
def list_visualization_files():
    """
    List all available visualization files in the 'visualizations/' folder.
    """
    if not VIS_DIR.exists():
        raise HTTPException(status_code=404, detail="Visualization folder not found")

    files = [f.name for f in VIS_DIR.iterdir() if f.is_file()]
    return {"files": sorted(files)}


@router.get("/debug/visualizations/file")
def get_visualization_file(name: str = Query(..., description="Name of the file to download/view")):
    """
    Return a specific visualization file (image or CSV).
    Example: /api/debug/visualizations/file?name=service_cost_heatmap.png
    """
    file_path = VIS_DIR / name

    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail=f"File '{name}' not found")

    return FileResponse(path=file_path, filename=name)
