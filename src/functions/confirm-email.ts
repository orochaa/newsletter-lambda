import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import type { APIGatewayProxyHandler } from 'aws-lambda'
import { dynamo } from '../shared/dynamodb-client.js'
import { SUBSCRIBER_TABLE, response } from '../shared/utils.js'

export const confirmEmailHandler: APIGatewayProxyHandler = async event => {
  const token = event.queryStringParameters?.token

  if (!token) {
    return response(400, { message: 'Invalid token' })
  }

  const result = await dynamo.send(
    new GetCommand({ TableName: SUBSCRIBER_TABLE, Key: { token } })
  )

  if (!result.Item) {
    return response(400, { message: 'Invalid token' })
  }

  await dynamo.send(
    new PutCommand({
      TableName: SUBSCRIBER_TABLE,
      Item: { ...result.Item, confirmed: true },
    })
  )

  return response(200, { message: 'Email confirmed' })
}
