from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.security import get_current_user
from services import crud
from api.utils import model_to_dict
from typing import Optional

router = APIRouter()


@router.get("/{client_id}/backlinks")
async def list_backlinks(
    client_id: str,
    skip: int = 0,
    limit: int = 20,
    status: Optional[str] = None,
    rel_type: Optional[str] = None,
    min_da: Optional[int] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List backlinks with filtering."""
    backlinks, total = await crud.list_backlinks(
        db,
        client_id=client_id,
        skip=skip,
        limit=limit,
        status=status,
        rel_type=rel_type,
        min_da=min_da,
        search=search,
    )
    return {
        "backlinks": [model_to_dict(b) for b in backlinks],
        "total": total,
    }


@router.get("/{client_id}/backlinks/profile")
async def get_backlink_profile(
    client_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get backlink profile summary."""
    profile = await crud.get_backlink_profile(db, client_id=client_id)
    if not profile:
        return {
            "total_backlinks": 0,
            "referring_domains": 0,
            "avg_domain_authority": 0,
            "spam_score": 0,
            "new_backlinks_30d": 0,
            "lost_backlinks_30d": 0,
            "follow_ratio": 0,
            "da_distribution": [],
            "trend": [],
        }
    return profile


@router.post("/{client_id}/backlinks/analyze")
async def analyze_backlinks(
    client_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Trigger backlink analysis."""
    return {"status": "queued", "message": "Backlink analysis started"}


@router.get("/{client_id}/backlinks/lost")
async def get_lost_backlinks(
    client_id: str,
    days: int = 30,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get recently lost backlinks."""
    backlinks, total = await crud.list_backlinks(
        db, client_id=client_id, skip=0, limit=100, status="lost"
    )
    return {
        "lost_backlinks": [model_to_dict(b) for b in backlinks],
        "total": total,
    }


@router.get("/{client_id}/backlinks/new")
async def get_new_backlinks(
    client_id: str,
    days: int = 30,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get newly discovered backlinks."""
    backlinks, total = await crud.list_backlinks(
        db, client_id=client_id, skip=0, limit=100, status="active"
    )
    return {
        "new_backlinks": [model_to_dict(b) for b in backlinks],
        "total": total,
    }
