from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import init_db
from api.routes import (
    auth,
    clients,
    seo,
    keywords,
    backlinks,
    content,
    images,
    social_media,
    ads,
    campaigns,
    reports,
    ai_assistant,
    alerts,
    competitors,
    seo_by_ai,
    bugs,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="MarketingOS API",
    description="AI Marketing Operating System - Full-scale SEO & Digital Marketing Platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(clients.router, prefix="/api/v1/clients", tags=["Clients"])
app.include_router(seo.router, prefix="/api/v1/seo", tags=["SEO"])
app.include_router(keywords.router, prefix="/api/v1/keywords", tags=["Keywords"])
app.include_router(backlinks.router, prefix="/api/v1/backlinks", tags=["Backlinks"])
app.include_router(competitors.router, prefix="/api/v1/competitors", tags=["Competitors"])
app.include_router(content.router, prefix="/api/v1/content", tags=["Content Studio"])
app.include_router(images.router, prefix="/api/v1/images", tags=["Image Studio"])
app.include_router(social_media.router, prefix="/api/v1/social", tags=["Social Media"])
app.include_router(ads.router, prefix="/api/v1/ads", tags=["Ads Manager"])
app.include_router(campaigns.router, prefix="/api/v1/campaigns", tags=["Campaigns"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])
app.include_router(ai_assistant.router, prefix="/api/v1/ai", tags=["AI Assistant"])
app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["Alerts"])
app.include_router(seo_by_ai.router, prefix="/api/v1/seo-by-ai", tags=["SEO By AI"])
app.include_router(bugs.router, prefix="/api/v1/bugs", tags=["Bug Reports"])


@app.get("/")
async def root():
    return {
        "name": "MarketingOS API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
