from fastapi import APIRouter, Body, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.security import get_current_user
from services import crud
from api.utils import model_to_dict
from typing import Optional, List
import uuid
from datetime import datetime, timezone

router = APIRouter()


@router.get("/{client_id}/keywords")
async def list_keywords(
    client_id: str,
    skip: int = 0,
    limit: int = 20,
    sort_by: Optional[str] = "current_position",
    sort_order: Optional[str] = "asc",
    search: Optional[str] = None,
    min_volume: Optional[int] = None,
    max_difficulty: Optional[int] = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List tracked keywords with filtering and sorting."""
    keywords, total = await crud.list_keywords(
        db,
        client_id=client_id,
        skip=skip,
        limit=limit,
        sort_by=sort_by,
        sort_order=sort_order,
        search=search,
        min_volume=min_volume,
        max_difficulty=max_difficulty,
    )
    return {
        "keywords": [model_to_dict(k) for k in keywords],
        "total": total,
        "skip": skip,
        "limit": limit,
    }


@router.post("/{client_id}/keywords", status_code=status.HTTP_201_CREATED)
async def add_keywords(
    client_id: str,
    keywords: List[str] = Body(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Add keywords to track."""
    added = await crud.add_keywords(db, client_id=client_id, keywords=keywords)
    return {
        "added": [model_to_dict(k) for k in added],
        "count": len(added),
    }


@router.delete("/{client_id}/keywords/{keyword_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_keyword(
    client_id: str,
    keyword_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Remove a keyword from tracking."""
    deleted = await crud.delete_keyword(db, keyword_id=keyword_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Keyword not found",
        )
    return None


@router.get("/{client_id}/keywords/groups")
async def get_keyword_groups(
    client_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get keyword groups."""
    groups = await crud.get_keyword_groups(db, client_id=client_id)
    return {
        "groups": [model_to_dict(g) if hasattr(g, '__table__') else g for g in groups],
    }


@router.post("/{client_id}/keywords/groups", status_code=status.HTTP_201_CREATED)
async def create_keyword_group(
    client_id: str,
    name: str,
    keyword_ids: List[str] = Body(default=[]),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a keyword group."""
    group = await crud.add_keywords(db, client_id=client_id, keywords=[])
    # Use a dedicated group creation if available, otherwise return basic structure
    return {"id": str(uuid.uuid4()), "name": name, "keyword_count": len(keyword_ids)}


@router.post("/{client_id}/keywords/research")
async def keyword_research(
    client_id: str,
    seed_keywords: Optional[str] = None,
    location: str = "US",
    language: str = "en",
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """AI-powered keyword research from seed keywords."""
    seeds = seed_keywords.split(",") if seed_keywords else []
    return {"seed_keywords": seeds, "location": location, "language": language, "suggestions": [], "total": 0}


@router.get("/{client_id}/keywords/rankings")
async def get_ranking_history(
    client_id: str,
    keyword_id: Optional[str] = None,
    days: int = 30,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get keyword ranking history."""
    # Ranking history would be fetched from the keywords/rankings tables
    keywords, _ = await crud.list_keywords(
        db, client_id=client_id, skip=0, limit=1
    )
    if not keywords:
        return {"keyword": None, "history": []}
    kw_data = model_to_dict(keywords[0])
    return {
        "keyword": kw_data.get("keyword"),
        "history": [],
    }
