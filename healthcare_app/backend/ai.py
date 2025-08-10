from __future__ import annotations

import json
import os
from typing import Any, Dict

from .schemas import SymptomCheckRequest, SymptomCheckResponse, LikelyCondition, TriageLevel
from . import rules


def analyze_symptoms(req: SymptomCheckRequest) -> SymptomCheckResponse:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return rules.analyze_symptoms_rulebased(req)

    try:
        from openai import OpenAI  # type: ignore

        client = OpenAI(api_key=api_key)

        system_prompt = (
            "You are a careful medical triage assistant. You provide conservative, safety-first guidance. "
            "You will return ONLY valid JSON following the provided schema. If unsure, be cautious."
        )

        user_payload: Dict[str, Any] = json.loads(req.json())

        schema = {
            "type": "object",
            "properties": {
                "triage": {"type": "string", "enum": ["emergency", "urgent", "routine", "self_care"]},
                "red_flags": {"type": "array", "items": {"type": "string"}},
                "likely_conditions": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "confidence": {"type": "number"},
                            "reasoning": {"type": "string"},
                        },
                        "required": ["name", "confidence"],
                    },
                },
                "recommended_actions": {"type": "array", "items": {"type": "string"}},
                "advice_message": {"type": "string"},
            },
            "required": ["triage", "red_flags", "likely_conditions", "recommended_actions"],
        }

        prompt = (
            "Analyze the following symptom information and output a JSON object that conforms to this JSON Schema.\n\n"
            f"JSON Schema:\n{json.dumps(schema)}\n\n"
            f"User data:\n{json.dumps(user_payload)}\n\n"
            "Important rules:\n"
            "- Prefer safety-first triage.\n"
            "- If any life-threatening red flags are suspected, set triage to 'emergency'.\n"
            "- Limit condition list to top 5 with confidence 0.0-1.0.\n"
            "- If unsure, be conservative and advise seeking care.\n"
            "- Output ONLY the JSON. No extra text."
        )

        completion = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": prompt}],
            temperature=0.2,
        )
        content = completion.choices[0].message.content or "{}"
        data = json.loads(content)

        triage_value = data.get("triage", "self_care")
        red_flags = data.get("red_flags", [])
        conds = data.get("likely_conditions", [])
        actions = data.get("recommended_actions", [])
        advice = data.get("advice_message")

        likely_conditions = [
            LikelyCondition(
                name=str(item.get("name", "unknown")),
                confidence=float(item.get("confidence", 0.0)),
                reasoning=item.get("reasoning"),
            )
            for item in conds
            if isinstance(item, dict)
        ]

        valid_values = {member.value for member in TriageLevel}
        response = SymptomCheckResponse(
            triage=TriageLevel(triage_value) if triage_value in valid_values else TriageLevel.self_care,
            red_flags=[str(x) for x in red_flags],
            likely_conditions=likely_conditions[:5],
            recommended_actions=[str(x) for x in actions],
            advice_message=str(advice) if advice else None,
        )
        return response
    except Exception:
        # If AI call fails for any reason, fallback gracefully
        return rules.analyze_symptoms_rulebased(req)