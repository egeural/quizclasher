# Suggestions API Setup

## ✅ Email Notifications (Implemented)

The suggestions system now sends email notifications using nodemailer!

## Setup Instructions

### 1. Configure Environment Variables

Create a `.env` file in the server directory (or set environment variables):

```bash
ADMIN_EMAIL=egeural2005@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=egeural2005@gmail.com
SMTP_PASS=your_app_password_here
```

### 2. Gmail Setup (Recommended)

For Gmail, you need to use an **App Password** (not your regular password):

1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Enter "Quiz Clasher Server"
4. Copy the generated 16-character password
5. Use this password as `SMTP_PASS`

**Important**: Enable 2-Step Verification first if you haven't already.

### 3. Other Email Providers

**Outlook/Hotmail:**
```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

**Yahoo:**
```
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

**Custom SMTP:**
Use your provider's SMTP settings.

### 4. Start Server

```bash
cd server
node server.js
```

The server will verify the email connection on startup. If successful, you'll see:
```
Email transporter ready. Suggestions will be sent to: egeural2005@gmail.com
```

## How It Works

1. User submits suggestion via the form
2. Server stores it in memory
3. Server sends formatted email to `ADMIN_EMAIL`
4. Email includes:
   - Suggestion type (General, Feature, Bug, etc.)
   - Username
   - Full message
   - Timestamp
   - Formatted HTML email

## Fallback Behavior

If email fails or SMTP_PASS is not set:
- Suggestions are still stored and logged to console
- API still returns success to user
- No errors are exposed to users

## Viewing Suggestions

- **Console**: Check server logs for all suggestions
- **API**: GET `/api/suggestions` - Returns all stored suggestions
- **Email**: Check your inbox for formatted notifications

## Security Notes

- **Never commit `.env` file** to git
- Add `.env` to `.gitignore`
- In production, use environment variables from your hosting provider
- Consider adding authentication to GET `/api/suggestions` endpoint
