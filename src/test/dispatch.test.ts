import {Dispatch, ResponseError} from '../dispatch';
import {makeRequest} from './test-utils';
import {URLSearchParams as URLParams} from 'url';

describe('Dispatch', () => {
	test('ResponseError handling', async () => {
		const body = new URLParams({
			query: 'badquery',
		});
		const {req, res} = makeRequest();
		req.url = '/?' + body;
		await expect(new Dispatch(req, res).execute()).rejects.toThrow(ResponseError);
	});
});
