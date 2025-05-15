import { DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import type { APIGatewayProxyHandler } from 'aws-lambda'
import { dynamo } from '../shared/dynamodb-client.js'
import { SUBSCRIBER_TABLE, response } from '../shared/utils.js'

export const unsubscribeHandler: APIGatewayProxyHandler = async event => {
  const { email } = JSON.parse(event.body ?? '{}') as { email?: string }

  if (!email) {
    return response(400, { message: 'Email is required' })
  }

  const result = await dynamo.send(
    new ScanCommand({
      TableName: SUBSCRIBER_TABLE,
      FilterExpression: '#email = :emailVal',
      ExpressionAttributeNames: { '#email': 'email' },
      ExpressionAttributeValues: { ':emailVal': email },
    })
  )

  if (!result.Items || result.Items.length === 0) {
    return response(400, { message: 'Email not found' })
  }

  const subscribers = result.Items as Subscriber[]

  await Promise.all(
    subscribers.map(async subscriber =>
      dynamo.send(
        new DeleteCommand({
          TableName: SUBSCRIBER_TABLE,
          Key: {
            token: subscriber.token,
          },
        })
      )
    )
  )

  return response(200, { message: 'Unsubscribed' })
}
