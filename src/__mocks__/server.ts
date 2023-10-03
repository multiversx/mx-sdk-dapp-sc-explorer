import {
  DefaultBodyType,
  PathParams,
  ResponseComposition,
  rest,
  RestContext,
  RestRequest
} from 'msw';
import { setupServer } from 'msw/node';
import { testNetwork, testContract } from './serverConfig';

export const mockResponse =
  <T extends DefaultBodyType>(body: T) =>
  (
    _req: RestRequest<never, PathParams<string>>,
    res: ResponseComposition<DefaultBodyType>,
    ctx: RestContext
  ) => {
    return res(ctx.status(200), ctx.json(body));
  };

const handlers = [
  rest.get(
    `${testNetwork.apiAddress}/accounts/${testContract}/verification`,
    mockResponse({})
  )
];

// This configures a request mocking server with the given request handlers.
const server = setupServer(...handlers);

export { server, rest };
