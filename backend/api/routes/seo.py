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


@router.post("/{client_id}/audit", status_code=status.HTTP_202_ACCEPTED)
async def trigger_seo_audit(
    client_id: str,
    url: Optional[str] = None,
    crawl_depth: int = 3,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Trigger a new SEO audit (runs as background task)."""
    audit = await crud.create_seo_audit(
        db,
        client_id=client_id,
        audit_type="full",
    )
    audit_data = model_to_dict(audit)
    return {
        "audit_id": audit_data["id"],
        "client_id": audit_data["client_id"],
        "status": audit_data.get("status", "queued"),
        "message": "SEO audit has been queued and will start shortly",
    }


@router.get("/{client_id}/audits")
async def list_audits(
    client_id: str,
    skip: int = 0,
    limit: int = 10,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all SEO audits for a client."""
    audits, total = await crud.list_seo_audits(
        db, client_id=client_id, skip=skip, limit=limit
    )
    return {
        "audits": [model_to_dict(a) for a in audits],
        "total": total,
    }


@router.get("/{client_id}/audits/{audit_id}")
async def get_audit_details(
    client_id: str,
    audit_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get detailed SEO audit results."""
    audit = await crud.get_seo_audit(db, audit_id=audit_id)
    if not audit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audit not found",
        )
    return model_to_dict(audit)


@router.get("/{client_id}/metrics")
async def get_seo_metrics(
    client_id: str,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get SEO metrics over time."""
    metrics = await crud.get_seo_metrics(
        db, client_id=client_id, date_from=date_from, date_to=date_to
    )
    if not metrics:
        return {
            "client_id": client_id,
            "current": {
                "organic_traffic": 0,
                "domain_authority": 0,
                "backlinks_count": 0,
                "referring_domains": 0,
                "avg_position": 0,
                "impressions": 0,
                "clicks": 0,
                "ctr": 0,
            },
            "history": [],
        }
    return metrics


@router.get("/{client_id}/technical-issues")
async def get_technical_issues(
    client_id: str,
    severity: Optional[str] = None,
    category: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get technical SEO issues."""
    issues = await crud.get_technical_issues(
        db, client_id=client_id, severity=severity, category=category
    )
    issue_list = [model_to_dict(i) if hasattr(i, '__table__') else i for i in issues]
    return {"issues": issue_list, "total": len(issue_list)}
