/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { APIGatewayProxyResult } from 'aws-lambda'

export const SUBSCRIBER_TABLE = process.env.SUBSCRIBER_TABLE!

export const BASE_URL = process.env.BASE_URL!

export const FROM_EMAIL = process.env.FROM_EMAIL!

// eslint-disable-next-line @typescript-eslint/require-await
export async function response(
  statusCode: number,
  body?: unknown
): Promise<APIGatewayProxyResult> {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
}
