## Healthcare Symptom Checker (MVP)

A minimal, safety-first healthcare symptom checker. Uses a rule-based engine by default and optionally an AI model (OpenAI) if `OPENAI_API_KEY` is set.

### Features
- Rule-based triage with red-flag detection
- Optional AI analysis via OpenAI for richer outputs
- Simple web UI (HTML/CSS/JS) served by FastAPI

### Requirements
- Python 3.10+

### Setup
1. Create and activate a virtual environment
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```
2. Install dependencies
   ```bash
   pip install -r backend/requirements.txt
   ```
3. (Optional) Configure AI
   - Copy `.env.example` to `.env` and set `OPENAI_API_KEY`

### Run the app
```bash
uvicorn healthcare_app.backend.main:app --host 0.0.0.0 --port 8000 --reload
```
Then open `http://localhost:8000`.

### Run tests
```bash
pytest -q
```

### Docker
```bash
docker build -t symptom-checker .
# Run with optional OpenAI key
docker run -p 8000:8000 -e OPENAI_API_KEY=sk-... symptom-checker
```

### Notes
- This tool does not provide medical diagnosis. For emergencies, call your local emergency number.