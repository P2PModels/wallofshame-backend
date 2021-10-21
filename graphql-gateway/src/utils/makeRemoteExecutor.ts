
import { print } from 'graphql'
import { fetch } from 'cross-fetch'

export default function makeRemoteExecutor(url: string) {
  return async ({ document, variables, context }) => {

    const query = typeof document === 'string' ? document : print(document)

    const fetchResult = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': context.authHeader || '',
      },
      body: JSON.stringify({ query, variables }),
    })

    return fetchResult.json()
  }
}