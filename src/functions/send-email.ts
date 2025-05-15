import { SendEmailCommand } from '@aws-sdk/client-ses'
import { ScanCommand } from '@aws-sdk/lib-dynamodb'
import type { APIGatewayProxyHandler } from 'aws-lambda'
import { dynamo } from '../shared/dynamodb-client.js'
import { ses } from '../shared/ses-client.js'
import { FROM_EMAIL, SUBSCRIBER_TABLE, response } from '../shared/utils.js'

export const sendEmailHandler: APIGatewayProxyHandler = async event => {
  const { subject, body } = JSON.parse(event.body ?? '{}') as {
    subject?: string
    body?: string
  }

  if (!subject) {
    return response(400, { message: 'Subject and body are required' })
  }

  if (!body) {
    return response(400, { message: 'Body and body are required' })
  }

  const result = await dynamo.send(
    new ScanCommand({
      TableName: SUBSCRIBER_TABLE,
      FilterExpression: 'confirmed = :trueVal',
      ExpressionAttributeValues: { ':trueVal': true },
    })
  )

  const subscribers = result.Items as Subscriber[] | undefined

  const confirmedEmails = subscribers?.map(sub => sub.email) ?? []

  if (confirmedEmails.length === 0) {
    return response(400, { message: 'No confirmed users' })
  }

  await ses.send(
    new SendEmailCommand({
      Destination: { ToAddresses: confirmedEmails },
      Message: {
        Subject: { Data: subject || 'Newsletter' },
        Body: { Text: { Data: body || '' } },
      },
      Source: FROM_EMAIL,
    })
  )

  return response(200, { message: 'Email sent to confirmed users' })
}
