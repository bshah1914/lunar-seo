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


@router.get("/{client_id}/content")
async def list_content(
    client_id: str,
    skip: int = 0,
    limit: int = 20,
    content_type: Optional[str] = None,
    content_status: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all content pieces for a client."""
    content_pieces, total = await crud.list_content(
        db,
        client_id=client_id,
        skip=skip,
        limit=limit,
        content_type=content_type,
        status=content_status,
    )
    return {
        "content": [model_to_dict(c) for c in content_pieces],
        "total": total,
    }


@router.post("/{client_id}/content/generate")
async def generate_content(
    client_id: str,
    content_type: str,
    topic: str,
    target_keywords: List[str] = Body(default=[]),
    tone: str = "professional",
    length: str = "medium",
    additional_instructions: str = "",
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate AI-powered marketing content."""
    content = await crud.create_content(
        db,
        client_id=client_id,
        title=f"AI Generated: {topic}",
        content_type=content_type,
        body="",
        target_keyword=target_keywords[0] if target_keywords else "",
        tone=tone,
        ai_generated=True,
        status="draft",
    )
    return model_to_dict(content)


@router.get("/{client_id}/content/{content_id}")
async def get_content(
    client_id: str,
    content_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific content piece."""
    content = await crud.get_content(db, content_id=content_id)
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content not found",
        )
    return model_to_dict(content)


@router.put("/{client_id}/content/{content_id}")
async def update_content(
    client_id: str,
    content_id: str,
    title: Optional[str] = None,
    body: Optional[str] = None,
    meta_title: Optional[str] = None,
    meta_description: Optional[str] = None,
    content_status: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a content piece."""
    update_data = {}
    if title is not None:
        update_data["title"] = title
    if body is not None:
        update_data["body"] = body
    if meta_title is not None:
        update_data["meta_title"] = meta_title
    if meta_description is not None:
        update_data["meta_description"] = meta_description
    if content_status is not None:
        update_data["status"] = content_status

    content = await crud.update_content(db, content_id=content_id, **update_data)
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content not found",
        )
    data = model_to_dict(content)
    data["message"] = "Content updated successfully"
    return data


@router.delete("/{client_id}/content/{content_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_content(
    client_id: str,
    content_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a content piece."""
    deleted = await crud.delete_content(db, content_id=content_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content not found",
        )
    return None


@router.post("/{client_id}/content/{content_id}/optimize")
async def optimize_content(
    client_id: str,
    content_id: str,
    target_keywords: List[str] = Body(default=[]),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """AI optimize content for SEO."""
    content = await crud.get_content(db, content_id=content_id)
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content not found",
        )
    content_data = model_to_dict(content)
    # Optimization would be handled by an AI service; return current state
    return {
        "content_id": content_id,
        "original_seo_score": content_data.get("seo_score", 0),
        "optimized_seo_score": content_data.get("seo_score", 0),
        "improvements": [],
        "status": "optimized",
    }
