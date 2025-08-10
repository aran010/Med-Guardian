from __future__ import annotations

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, validator


class SexEnum(str, Enum):
    male = "male"
    female = "female"
    other = "other"
    unknown = "unknown"


class SeverityEnum(str, Enum):
    mild = "mild"
    moderate = "moderate"
    severe = "severe"


class VitalSigns(BaseModel):
    heart_rate_bpm: Optional[int] = Field(None, ge=20, le=240)
    systolic_bp_mmHg: Optional[int] = Field(None, ge=50, le=260)
    diastolic_bp_mmHg: Optional[int] = Field(None, ge=30, le=150)
    temperature_c: Optional[float] = Field(None, ge=32.0, le=43.0)
    respiratory_rate_bpm: Optional[int] = Field(None, ge=6, le=60)
    oxygen_saturation_pct: Optional[int] = Field(None, ge=50, le=100)


class SymptomCheckRequest(BaseModel):
    age_years: Optional[float] = Field(None, ge=0.0, le=120.0)
    sex: SexEnum = SexEnum.unknown
    symptoms: List[str] = Field(default_factory=list, description="Free-text symptoms")
    duration: Optional[str] = Field(None, description="Duration description, e.g., '2 days'")
    severity: Optional[SeverityEnum] = None
    medical_history: List[str] = Field(default_factory=list)
    medications: List[str] = Field(default_factory=list)
    allergies: List[str] = Field(default_factory=list)
    pregnant: Optional[bool] = None
    vitals: Optional[VitalSigns] = None
    additional_context: Optional[str] = None

    @validator("symptoms", pre=True, always=True)
    def normalize_symptoms(cls, v: List[str]):
        if not v:
            return []
        return [s.strip().lower() for s in v if isinstance(s, str) and s.strip()]

    @validator("medical_history", "medications", "allergies", pre=True, always=True)
    def normalize_lists(cls, v: List[str]):
        if not v:
            return []
        return [s.strip().lower() for s in v if isinstance(s, str) and s.strip()]


class LikelyCondition(BaseModel):
    name: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    reasoning: Optional[str] = None


class TriageLevel(str, Enum):
    emergency = "emergency"
    urgent = "urgent"
    routine = "routine"
    self_care = "self_care"


class SymptomCheckResponse(BaseModel):
    triage: TriageLevel
    red_flags: List[str] = Field(default_factory=list)
    likely_conditions: List[LikelyCondition] = Field(default_factory=list)
    recommended_actions: List[str] = Field(default_factory=list)
    advice_message: Optional[str] = None
    disclaimer: str = (
        "This is not a medical diagnosis. If symptoms worsen or you are concerned, seek medical care."
    )