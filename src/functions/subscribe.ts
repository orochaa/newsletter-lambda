import { SendEmailCommand } from '@aws-sdk/client-ses'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import type { APIGatewayProxyHandler } from 'aws-lambda'
import crypto from 'node:crypto'
import { dynamo } from '../shared/dynamodb-client.js'
import { ses } from '../shared/ses-client.js'
import {
  BASE_URL,
  FROM_EMAIL,
  SUBSCRIBER_TABLE,
  response,
} from '../shared/utils.js'

const CONFIRM_URL = `${BASE_URL}/confirm-email`

export const subscribeHandler: APIGatewayProxyHandler = async event => {
  const { email } = JSON.parse(event.body ?? '{}') as { email?: string }

  if (!email) {
    return response(400, { message: 'Email is required' })
  }

  const subscriber = {
    token: crypto.randomBytes(32).toString('hex'),
    email,
    confirmed: false,
  }

  await dynamo.send(
    new PutCommand({
      TableName: SUBSCRIBER_TABLE,
      Item: subscriber,
    })
  )

  await ses.send(
    new SendEmailCommand({
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: 'Confirm your subscription' },
        Body: {
          Text: {
            Data: `Click to confirm: ${CONFIRM_URL}?token=${subscriber.token}`,
          },
        },
      },
      Source: FROM_EMAIL,
    })
  )

  return response(200, { message: 'Confirmation email sent' })
}
