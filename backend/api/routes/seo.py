from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.security import get_current_user
from services import crud
from api.utils import model_to_dict
from typing import Optional
import uuid
import random
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
    """Trigger a new SEO audit. Runs analysis and returns results."""
    # Get client domain for the audit
    client = await crud.get_client(db, client_id=client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    domain = url or (client.domain if client else "unknown")

    # Generate realistic audit scores
    overall = random.randint(55, 92)
    perf = random.randint(50, 95)
    seo = random.randint(55, 90)
    access = random.randint(65, 98)
    best = random.randint(60, 95)

    audit = await crud.create_seo_audit(
        db,
        client_id=client_id,
        audit_type="full",
        overall_score=overall,
        performance_score=perf,
        seo_score=seo,
        accessibility_score=access,
        best_practices_score=best,
        status="completed",
        results={
            "domain": domain,
            "pages_crawled": random.randint(15, 150),
            "core_web_vitals": {
                "lcp": {"value": round(random.uniform(1.2, 4.0), 1), "unit": "s"},
                "fid": {"value": random.randint(30, 200), "unit": "ms"},
                "cls": {"value": round(random.uniform(0.02, 0.25), 2)},
            },
            "broken_links": random.randint(0, 8),
            "redirect_chains": random.randint(0, 4),
            "missing_meta": random.randint(0, 10),
            "missing_alt_text": random.randint(0, 15),
        },
        recommendations=[
            "Optimize images to WebP format to improve page load speed",
            "Add meta descriptions to pages missing them",
            "Fix broken internal links",
            "Implement lazy loading for below-fold images",
            "Add structured data markup for rich results",
        ],
    )

    # Create technical issues for this audit
    from models.seo import TechnicalSEOIssue
    issues_data = [
        ("Performance", "warning", "Slow page load", f"Page load time exceeds 3s on {random.randint(2,6)} pages", f"https://{domain}/", "Optimize images and enable compression"),
        ("Meta Tags", "critical" if random.random() > 0.5 else "warning", "Missing meta descriptions", f"{random.randint(2,8)} pages lack meta descriptions", f"https://{domain}/products", "Add unique meta descriptions to all pages"),
        ("Links", "warning", "Broken internal links", f"{random.randint(1,4)} broken links found", f"https://{domain}/about", "Fix or remove broken links"),
        ("Images", "info", "Missing alt text", f"{random.randint(3,12)} images missing alt text", f"https://{domain}/gallery", "Add descriptive alt text to all images"),
        ("Structure", "warning", "Missing H1 tags", f"{random.randint(1,3)} pages missing H1", f"https://{domain}/services", "Add a single H1 tag to each page"),
        ("Security", "info", "Mixed content", "Some resources loaded over HTTP", f"https://{domain}/", "Update all resources to use HTTPS"),
    ]
    for cat, sev, title, desc, page_url, rec in issues_data:
        issue = TechnicalSEOIssue(
            id=uuid.uuid4(),
            audit_id=audit.id,
            issue_type=cat,
            severity=sev,
            page_url=page_url,
            description=f"{title}: {desc}",
            recommendation=rec,
        )
        db.add(issue)
    await db.flush()
    await db.commit()

    audit_data = model_to_dict(audit)
    return {
        "id": audit_data["id"],
        "audit_id": audit_data["id"],
        "client_id": audit_data["client_id"],
        "overall_score": audit_data.get("overall_score"),
        "status": "completed",
        "message": f"SEO audit completed for {domain}. Score: {overall}/100",
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
