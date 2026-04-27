# Binna (بنّا)

AI construction feasibility analyzer for Saudi Arabia. The app collects early project details and returns a Saudi-focused feasibility report covering compliance risks, cost risks, zoning compatibility, Baladiya approvals, recommendations, and permit timeline estimates.

## Run locally

```bash
cp .env.example .env
# Add your Anthropic key to .env.
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What is included

- Static HTML/CSS/JS frontend
- Node API proxy at `/api/analyze` so the Anthropic API key is never exposed in browser code
- English/Arabic UI toggle with RTL support
- Zoomable Saudi map using Leaflet and OpenStreetMap tiles
- MVP intelligence modules for document intake, voice input, live cost ranges, comparable approvals, WhatsApp report drafting, permit tracking, consultant matching, team comments, and risk alerts
- Grounded Saudi regulatory prompt with permit timelines, SBC rules, project-type approvals, cost benchmarks, Vision 2030 zones, confidence scores, FAR validation, budget validation, and data freshness notes
- Local report history for the MVP
- Free tier counter for 3 reports
- Browser PDF export using print
- Email delivery and paid plan surfaces ready for backend integration

## Production next steps

- Add persistent users and report storage with Supabase, Firebase, or Postgres
- Replace local report limits with account-level entitlement checks
- Add Stripe or a Saudi/GCC-friendly payments provider for the 200 SAR/month tier
- Generate PDFs server-side with Playwright or a document service
- Send report PDFs through Resend, Postmark, or SES
- Replace MVP document keyword scanning with server-side OCR/parser pipelines for PDFs, images, DOCX, and CAD exports
- Connect map pins to official Saudi municipality/GIS zoning datasets where licensed access is available
- Use WhatsApp Business API and Whisper/OpenAI audio transcription for production delivery and voice intake
