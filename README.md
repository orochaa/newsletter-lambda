# Newsletter Service

A simple, scalable newsletter subscription API built with AWS Lambda, DynamoDB, SES, and the Serverless Framework, using TypeScript.

## ✨ Features

- Subscribe users by email
- Send confirmation emails with secure tokens
- Confirm subscriptions through a unique token link
- Unsubscribe at any time
- Send emails to all confirmed subscribers
- Built using AWS SDK v3
- Fully typed with TypeScript
- Infrastructure as code via Serverless Framework

---

## 📦 API Endpoints

All endpoints are deployed via AWS API Gateway.

### Subscribe - `POST /subscribe`

**Request Body** (JSON):

```json
{
  "email": "user@example.com"
}
```

**Response**:

- Sends a confirmation email with a secure token link.
- Email must be verified in your SES sandbox (if you're in development mode).

### Confirm Email - `GET /confirm-email?token=...`

**Query Parameters**:

- `token`: `string` – The confirmation token from the subscription email

**Response**:

- Marks the email as confirmed in the database.

### Unsubscribe - `POST /unsubscribe`

**Request Body** (JSON):

```json
{
  "email": "user@example.com"
}
```

**Response**:

- Deletes the email from the subscriber list.

### Send Email to Subscribers - `POST /send-email`

**Request Body** (JSON):

```json
{
  "subject": "My Newsletter",
  "body": "Welcome to the first issue!"
}
```

**Response**:

- Sends the provided email to all confirmed subscribers via AWS SES.

## 🗃 How to Deploy to AWS

1. Install serverless framework globally:

```bash
npm install --global serverless
```

2. Make sure your AWS credentials are configured:

```bash
aws configure
```

3. Add a .env file with:

```env
FROM_EMAIL="your_verified_email@example.com"
```

4. Run serverless deploy:

```bash
serverless deploy
```

5. After use it, make sure to clean your AWS resources:

```bash
serverless remove
```

## 🧪 How to Test

You can test the endpoints using:

### ✅ Option 1: HTTP Request Templates

This project includes a test.http file in the root directory. You can use it with VS Code and the REST Client extension to easily run and test all API endpoints.

#### Steps:

1. Install the [REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) for VS Code.
2. Open [test.http](./test.http).
3. Replace placeholders like `https://your-api-id.execute-api.region.amazonaws.com/dev` with your deployed URL.
4. Click `"Send Request"` above any HTTP block to run it directly.

### ✅ Option 2: curl or Postman

Example with `curl`:

```bash
curl -X POST "https://your-api-id.execute-api.region.amazonaws.com/dev/subscribe" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

## 🛠 Tech Stack

- Node.js / TypeScript
- AWS Lambda
- AWS DynamoDB (with GSI)
- AWS SES (Simple Email Service)
- Serverless Framework
- AWS SDK v3
