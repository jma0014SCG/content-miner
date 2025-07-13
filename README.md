# Insight - YouTube Video Summarizer

Turn any YouTube video or channel link into an instant, AI-generated summary.

## Project Structure

```
content_miner/
├── backend/          # Python FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── api/
│   │   ├── services/
│   │   └── models/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/         # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:
- `GUMLOOP_API_KEY`
- `USER_ID`
- `FLOW_VIDEO_ID`
- `FLOW_CHANNEL_ID`

## Features

- **Video Summarization**: Paste YouTube video URL → get markdown summary
- **Channel Analysis**: Enter channel URL → get competitive intel report
- **Export Options**: Download as .md file or copy to clipboard
- **Real-time Processing**: Polling-based updates with loading states

## Tech Stack

- **Backend**: FastAPI, Python 3.9+
- **Frontend**: React 18, Vite, Tailwind CSS
- **Deployment**: Docker, Render/Vercel
- **Analytics**: PostHog
- **Monitoring**: OpenTelemetry, CloudWatch