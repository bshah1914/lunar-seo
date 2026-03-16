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


@router.get("/")
async def list_campaigns(
    skip: int = 0,
    limit: int = 20,
    campaign_type: Optional[str] = None,
    campaign_status: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List marketing campaigns."""
    campaigns, total = await crud.list_campaigns(
        db,
        skip=skip,
        limit=limit,
        campaign_type=campaign_type,
        status=campaign_status,
    )
    return {
        "campaigns": [model_to_dict(c) for c in campaigns],
        "total": total,
    }


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_campaign(
    name: str,
    client_id: str,
    campaign_type: str,
    start_date: datetime,
    end_date: datetime,
    budget: float,
    goals: List[str] = Body(default=[]),
    channels: List[str] = Body(default=[]),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a marketing campaign."""
    campaign = await crud.create_campaign(
        db,
        name=name,
        client_id=client_id,
        campaign_type=campaign_type,
        start_date=start_date,
        end_date=end_date,
        budget=budget,
        goals=goals,
        channels=channels,
    )
    return model_to_dict(campaign)


@router.get("/{campaign_id}")
async def get_campaign(
    campaign_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get campaign details."""
    campaign = await crud.get_campaign(db, campaign_id=campaign_id)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found",
        )
    return model_to_dict(campaign)


@router.put("/{campaign_id}")
async def update_campaign(
    campaign_id: str,
    name: Optional[str] = None,
    status_val: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a campaign."""
    update_data = {}
    if name is not None:
        update_data["name"] = name
    if status_val is not None:
        update_data["status"] = status_val

    campaign = await crud.update_campaign(db, campaign_id=campaign_id, **update_data)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found",
        )
    data = model_to_dict(campaign)
    data["message"] = "Campaign updated"
    return data


@router.delete("/{campaign_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_campaign(
    campaign_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a campaign."""
    deleted = await crud.delete_campaign(db, campaign_id=campaign_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found",
        )
    return None


@router.get("/{campaign_id}/metrics")
async def get_campaign_metrics(
    campaign_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get campaign performance metrics."""
    metrics = await crud.get_campaign_metrics(db, campaign_id=campaign_id)
    if not metrics:
        return {
            "campaign_id": campaign_id,
            "impressions": 0,
            "clicks": 0,
            "conversions": 0,
            "spend": 0,
            "revenue": 0,
            "ctr": 0,
            "cpc": 0,
            "roas": 0,
            "daily_metrics": [],
        }
    return metrics


@router.post("/{campaign_id}/launch")
async def launch_campaign(
    campaign_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Launch a campaign."""
    campaign = await crud.update_campaign(
        db, campaign_id=campaign_id, status="active"
    )
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found",
        )
    data = model_to_dict(campaign)
    return {
        "id": data["id"],
        "status": "active",
        "launched_at": datetime.now(timezone.utc).isoformat(),
    }
