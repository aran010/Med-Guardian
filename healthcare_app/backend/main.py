from __future__ import annotations

import os
from pathlib import Path
from typing import Dict

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .schemas import SymptomCheckRequest, SymptomCheckResponse
from .ai import analyze_symptoms


app = FastAPI(title="Healthcare Symptom Checker", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/symptom-check", response_model=SymptomCheckResponse)
async def symptom_check(payload: SymptomCheckRequest) -> SymptomCheckResponse:
    if not payload.symptoms and not payload.additional_context:
        raise HTTPException(status_code=400, detail="Provide at least one symptom or additional_context")
    return analyze_symptoms(payload)


# Serve frontend static files
BASE_DIR = Path(__file__).resolve().parent.parent
frontend_dir = BASE_DIR / "frontend"
if frontend_dir.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dir), html=True), name="static")


@app.get("/api/health")
async def health() -> Dict[str, str]:
    return {"status": "ok"}