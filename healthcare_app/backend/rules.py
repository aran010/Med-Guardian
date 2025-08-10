from __future__ import annotations

from typing import List, Tuple

from .schemas import (
    LikelyCondition,
    SeverityEnum,
    SymptomCheckRequest,
    SymptomCheckResponse,
    TriageLevel,
)


EMERGENCY_RED_FLAGS: List[Tuple[str, str]] = [
    ("chest pain", "Chest pain can indicate a heart emergency."),
    ("pressure in chest", "Chest pressure is concerning for cardiac issues."),
    ("shortness of breath", "Severe breathing difficulty can be life-threatening."),
    ("difficulty breathing", "Breathing difficulty can be life-threatening."),
    ("blue lips", "Low oxygen level is an emergency."),
    ("confusion", "New confusion may indicate serious conditions."),
    ("fainting", "Fainting can indicate serious underlying issues."),
    ("severe bleeding", "Uncontrolled bleeding is an emergency."),
    ("stiff neck", "Stiff neck with fever can be meningitis."),
    ("worst headache of life", "Could be hemorrhage; seek emergency care."),
    ("numbness on one side", "Stroke-like symptoms require emergency care."),
    ("weakness on one side", "Stroke-like symptoms require emergency care."),
    ("seizure", "Seizure can be an emergency."),
    ("pregnant and bleeding", "Bleeding during pregnancy can be an emergency."),
]


URGENT_RED_FLAGS: List[Tuple[str, str]] = [
    ("high fever", "High fever can be concerning, especially with other symptoms."),
    ("fever", "Persistent fever may require evaluation."),
    ("severe abdominal pain", "Severe abdominal pain requires urgent assessment."),
    ("blood in stool", "GI bleeding needs prompt evaluation."),
    ("blood in urine", "Hematuria requires medical evaluation."),
    ("dehydration", "Dehydration requires attention."),
    ("worsening", "Worsening symptoms warrant evaluation."),
]


CONDITION_KEYWORDS = {
    "common cold": ["runny nose", "sneezing", "sore throat", "cough"],
    "influenza": ["fever", "body aches", "chills", "fatigue", "cough"],
    "covid-19": ["loss of taste", "loss of smell", "fever", "dry cough", "shortness of breath"],
    "migraine": ["headache", "nausea", "sensitivity to light", "throbbing"],
    "gastroenteritis": ["diarrhea", "vomiting", "nausea", "stomach cramps"],
    "urinary tract infection": ["burning urination", "frequent urination", "urgency", "lower abdominal pain"],
    "allergic rhinitis": ["itchy eyes", "sneezing", "runny nose", "congestion"],
    "asthma": ["wheezing", "shortness of breath", "chest tightness", "cough"],
}


def _find_red_flags(symptoms: List[str], pregnant: bool | None) -> List[Tuple[str, str, TriageLevel]]:
    normalized = set(s.strip().lower() for s in symptoms)
    found: List[Tuple[str, str, TriageLevel]] = []
    for term, note in EMERGENCY_RED_FLAGS:
        for s in normalized:
            if term in s:
                found.append((term, note, TriageLevel.emergency))
    for term, note in URGENT_RED_FLAGS:
        for s in normalized:
            if term in s:
                found.append((term, note, TriageLevel.urgent))
    if pregnant and any("bleed" in s for s in normalized):
        found.append(("pregnant bleeding", "Bleeding during pregnancy can be an emergency.", TriageLevel.emergency))
    return found


def _score_conditions(symptoms: List[str]) -> List[LikelyCondition]:
    normalized = set(s.strip().lower() for s in symptoms)
    results: List[LikelyCondition] = []
    for condition, keywords in CONDITION_KEYWORDS.items():
        if not keywords:
            continue
        matches = sum(1 for k in keywords if any(k in s for s in normalized))
        if matches == 0:
            continue
        confidence = min(1.0, 0.2 + 0.15 * matches)
        results.append(
            LikelyCondition(
                name=condition,
                confidence=round(confidence, 2),
                reasoning=f"Matched {matches} symptom keyword(s): {', '.join(k for k in keywords if any(k in s for s in normalized))}",
            )
        )
    results.sort(key=lambda c: c.confidence, reverse=True)
    return results[:5]


def _derive_triage(red_flags: List[Tuple[str, str, TriageLevel]], severity: SeverityEnum | None) -> TriageLevel:
    if any(level == TriageLevel.emergency for _, _, level in red_flags):
        return TriageLevel.emergency
    if any(level == TriageLevel.urgent for _, _, level in red_flags):
        return TriageLevel.urgent
    if severity == SeverityEnum.severe:
        return TriageLevel.urgent
    if severity == SeverityEnum.moderate:
        return TriageLevel.routine
    return TriageLevel.self_care


def _actions_for_triage(triage: TriageLevel) -> List[str]:
    if triage == TriageLevel.emergency:
        return [
            "Call local emergency number or go to the nearest emergency department immediately.",
            "Do not drive yourself if you feel unsafe.",
        ]
    if triage == TriageLevel.urgent:
        return [
            "Seek medical care within 24 hours (urgent care or primary care).",
            "Hydrate and rest while monitoring symptoms.",
        ]
    if triage == TriageLevel.routine:
        return [
            "Schedule a non-urgent appointment with your primary care provider.",
            "Use over-the-counter symptom relief as appropriate.",
        ]
    return [
        "Self-care at home: fluids, rest, and over-the-counter options as needed.",
        "If symptoms worsen, seek medical attention.",
    ]


def analyze_symptoms_rulebased(req: SymptomCheckRequest) -> SymptomCheckResponse:
    red_flags_found = _find_red_flags(req.symptoms, req.pregnant)
    triage = _derive_triage(red_flags_found, req.severity)

    likely_conditions = _score_conditions(req.symptoms)

    red_flags_notes = [f"{term}: {note}" for term, note, _ in red_flags_found]

    advice_message = None
    if triage == TriageLevel.self_care and not likely_conditions:
        advice_message = (
            "Symptoms are non-specific. Consider rest, hydration, and monitoring. "
            "If symptoms persist or worsen, seek medical care."
        )

    return SymptomCheckResponse(
        triage=triage,
        red_flags=red_flags_notes,
        likely_conditions=likely_conditions,
        recommended_actions=_actions_for_triage(triage),
        advice_message=advice_message,
    )