# Suggestions API Setup

## Current Implementation

The suggestions system stores submissions in memory and logs them to the console. For production use, you have several options:

## Option 1: Email Notifications (Recommended)

Install nodemailer to send email notifications:

```bash
cd server
npm install nodemailer
```

Then update `server.js` to add email sending functionality in the suggestions endpoint.

## Option 2: Database Storage

Store suggestions in a database (MongoDB, PostgreSQL, etc.) for later review.

## Option 3: Third-party Service

Use services like:
- Formspree
- EmailJS
- SendGrid
- AWS SES

## Environment Variables

Set these in your production environment:
- `ADMIN_EMAIL`: Your email address (defaults to egeural2005@gmail.com)
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`: For email sending (if using nodemailer)

## Viewing Suggestions

Currently, suggestions are logged to the console. To view them via API:
- GET `/api/suggestions` - Returns all stored suggestions
- **Note**: Add authentication in production!
