/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/promise-function-async */
import type { APIGatewayProxyHandler } from 'aws-lambda'
import { confirmEmailHandler } from './functions/confirm-email.js'
import { sendEmailHandler } from './functions/send-email.js'
import { subscribeHandler } from './functions/subscribe.js'
import { unsubscribeHandler } from './functions/unsubscribe.js'
import { response } from './shared/utils.js'

const router: {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: `/${string}`
  handler: APIGatewayProxyHandler
}[] = [
  {
    method: 'POST',
    path: '/subscribe',
    handler: subscribeHandler,
  },
  {
    method: 'GET',
    path: '/confirm-email',
    handler: confirmEmailHandler,
  },
  {
    method: 'POST',
    path: '/unsubscribe',
    handler: unsubscribeHandler,
  },
  {
    method: 'POST',
    path: '/send-email',
    handler: sendEmailHandler,
  },
]

export const handler: APIGatewayProxyHandler = (event, context, cb) => {
  try {
    const [method, path] =
      'routeKey' in event && typeof event.routeKey === 'string'
        ? event.routeKey.split(' ')
        : [event.httpMethod, event.path]

    const route = router.find(
      route => route.method === method && route.path === path
    )

    if (!route) {
      return response(404, { message: 'Not Found' })
    }

    return route.handler(event, context, cb)
  } catch (error) {
    console.error(error)

    return response(500, { message: 'Internal Server Error' })
  }
}
