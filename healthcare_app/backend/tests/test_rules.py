from __future__ import annotations

from healthcare_app.backend.rules import analyze_symptoms_rulebased
from healthcare_app.backend.schemas import SymptomCheckRequest, SeverityEnum, TriageLevel


def test_emergency_red_flag_chest_pain():
    req = SymptomCheckRequest(symptoms=["Severe chest pain and shortness of breath"], severity=SeverityEnum.severe)
    res = analyze_symptoms_rulebased(req)
    assert res.triage == TriageLevel.emergency
    assert any("chest pain" in flag for flag in res.red_flags)


def test_self_care_common_cold():
    req = SymptomCheckRequest(symptoms=["runny nose", "sneezing", "sore throat"], severity=SeverityEnum.mild)
    res = analyze_symptoms_rulebased(req)
    assert res.triage in {TriageLevel.self_care, TriageLevel.routine}
    names = [c.name for c in res.likely_conditions]
    assert any("common cold" in n for n in names)