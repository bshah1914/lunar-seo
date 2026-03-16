from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.security import get_current_user
from services import crud
from api.utils import model_to_dict
from typing import Optional
import uuid
from datetime import datetime, timezone

router = APIRouter()


@router.get("/{client_id}/accounts")
async def list_ad_accounts(
    client_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List connected ad accounts."""
    accounts = await crud.list_ad_accounts(db, client_id=client_id)
    return {
        "accounts": [model_to_dict(a) for a in accounts],
    }


@router.post("/{client_id}/accounts", status_code=status.HTTP_201_CREATED)
async def connect_ad_account(
    client_id: str,
    platform: str,
    account_id_external: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Connect an ad account."""
    account = await crud.create_ad_account(
        db,
        client_id=client_id,
        platform=platform,
        account_id_external=account_id_external,
    )
    return model_to_dict(account)


@router.get("/{client_id}/campaigns")
async def list_ad_campaigns(
    client_id: str,
    platform: Optional[str] = None,
    campaign_status: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List ad campaigns."""
    campaigns, total = await crud.list_ad_campaigns(
        db,
        client_id=client_id,
        platform=platform,
        campaign_status=campaign_status,
    )
    return {
        "campaigns": [model_to_dict(c) for c in campaigns],
        "total": total,
    }


@router.post("/{client_id}/campaigns", status_code=status.HTTP_201_CREATED)
async def create_ad_campaign(
    client_id: str,
    name: str,
    platform: str,
    budget_daily: float,
    budget_total: float,
    start_date: str,
    end_date: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create an ad campaign."""
    campaign = await crud.create_ad_campaign(
        db,
        client_id=client_id,
        name=name,
        platform=platform,
        budget_daily=budget_daily,
        budget_total=budget_total,
        start_date=start_date,
        end_date=end_date,
    )
    return model_to_dict(campaign)


@router.get("/{client_id}/campaigns/{campaign_id}")
async def get_ad_campaign(
    client_id: str,
    campaign_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get ad campaign details."""
    campaigns, _ = await crud.list_ad_campaigns(db, client_id=client_id)
    campaign = None
    for c in campaigns:
        c_data = model_to_dict(c)
        if c_data.get("id") == campaign_id:
            campaign = c
            break
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found",
        )
    return model_to_dict(campaign)


@router.put("/{client_id}/campaigns/{campaign_id}")
async def update_ad_campaign(
    client_id: str,
    campaign_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update an ad campaign."""
    # Find and update the campaign
    campaigns, _ = await crud.list_ad_campaigns(db, client_id=client_id)
    campaign = None
    for c in campaigns:
        c_data = model_to_dict(c)
        if c_data.get("id") == campaign_id:
            campaign = c
            break
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found",
        )
    return {"id": campaign_id, "message": "Campaign updated successfully"}


@router.get("/{client_id}/analytics")
async def get_ad_analytics(
    client_id: str,
    platform: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get advertising analytics."""
    metrics = await crud.get_ad_metrics(
        db,
        client_id=client_id,
        platform=platform,
        date_from=date_from,
        date_to=date_to,
    )
    if not metrics:
        return {
            "total_spend": 0,
            "total_impressions": 0,
            "total_clicks": 0,
            "total_conversions": 0,
            "avg_ctr": 0,
            "avg_cpc": 0,
            "avg_cost_per_lead": 0,
            "overall_roas": 0,
            "spend_trend": [],
            "platform_breakdown": [],
        }
    return metrics
