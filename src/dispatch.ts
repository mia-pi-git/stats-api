/**
* Dispatching for API responses.
* @author mia-pi-git
*/
import {IncomingMessage as Request, ServerResponse as Response} from 'http';
import {URLSearchParams} from 'url';
import {toID, fileExists} from './utils';
import {APIContext} from './api';
import {endpoints} from './endpoints';

/*
* The max length a query can be before we reject it.
* (nothing is really this long? so)
* */
export const MAX_QUERY_LENGTH = 40;

export class ResponseError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ResponseError';
	}
}

export class Dispatch {
	req: Request;
	res: Response;
	body: URLSearchParams;
	constructor(req: Request, res: Response) {
		res.setHeader('access-control-allow-origin', '*');
		this.req = req;
		this.res = res;
		this.body = new URLSearchParams((req.url || '').slice(1));
	}
	async execute() {
		const endpoint = endpoints[
			toID(this.body.get('type') || this.body.get('endpoint') || '')
		];
		if (!endpoint) {
			throw new ResponseError('Endpoint not found');
		}
		const context = new APIContext(this);
		if ('validate' in endpoint) {
			const params = await endpoint.validate.call(this, this.body);
			return endpoint.fetch.call(context, params, this.req, this.res);
		}
		const params = await this.validateParams();
		return endpoint.call(context, params, this.req, this.res);
	}
	async validateParams(): Promise<SanitizedParams> {
		const date = this.body.get('date');
		if (!date || !/^\d{4}-\d{2}/.test(date)) {
			throw new ResponseError('Invalid date (must be ISO month, ie 2021-09)');
		}
		if (!(await fileExists(`/stats/${date}`))) {
			throw new ResponseError(`There are no stats for ${date}`);
		}
		const format = toID(this.body.get('format'));
		if (!format) {
			throw new ResponseError('Invalid format');
		}
		const query = toID(this.body.get('query'));
		if (!query || query.length > MAX_QUERY_LENGTH) {
			throw new ResponseError('Invalid query');
		}
		const rating = Number(toID(this.body.get('rating')) || 0);
		if (![1825, 1760, 1630, 1500, 0].includes(rating)) {
			throw new ResponseError(
				'Invalid rating - must be one of 0, 1500, 1630, 1760, or 1825.'
			);
		}
		if (!(await fileExists(`/stats/${date}/chaos/${format}-${rating}.json`))) {
			throw new ResponseError(
				`There are no stats for ${date} in the format ${format} ` +
`with the rating ${rating}`
			);
		}
		return {
			rating,
			date,
			format,
			query,
		};
	}
}

export async function handle(req: Request, res: Response) {
	try {
		const result = await new Dispatch(req, res).execute();
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(result));
	} catch (e: any) {
		if (e.name?.endsWith('ResponseError')) {
			res.writeHead(200, {'Content-Type': 'application/json'});
			return res.end(JSON.stringify({error: e.message}));
		}
		res.writeHead(503);
		res.end();
		throw e;
	}
}

export interface SanitizedParams {
	rating: number;
	date: string;
	format: string;
	query: string;
}

export interface PokemonStats {
	'Raw count': number;
	usage: number;
	// num GXE, max GXE, 1% GXE, 20% GXE
	'Viability Ceiling': [number, number, number, number];
	Abilities: {[ability: string]: number};
	Items: {[item: string]: number};
	Spreads: {[spread: string]: number};
	Happiness?: {[happiness: string]: number};
	Moves: {[move: string]: number};
	Teammates: {[pokemon: string]: number};
	// thanks pre for the reminders of what these do
	// n = sum(POKE1_KOED...DOUBLE_SWITCH)
	// p = POKE1_KOED + POKE1_SWITCHED_OUT / n
	// d = sqrt((p * (1 - p)) / n)
	'Checks and Counters': { [pokemon: string]: [number, number, number] };
}

export interface MiscSearch {
	matches: number;
	results: {usage: number; pokemon: string}[];
}

type EndpointResult = PokemonStats | MiscSearch | {error: string};

export type EndpointHandler<ParamsType = SanitizedParams> = (
	this: APIContext, params: ParamsType, req: Request, res: Response
) => Promise<EndpointResult> | EndpointResult;

export interface EndpointCustomHandler {
	/**
     * Return custom parameters for the fetcher function to handle.
     */
	validate: (this: Dispatch, body: URLSearchParams) => (
		{[k: string]: any} | Promise<{[k: string]: any}>
	);
	fetch: EndpointHandler<{[k: string]: any}>;
}

export type Endpoint = EndpointHandler | EndpointCustomHandler;
