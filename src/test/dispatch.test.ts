import {Dispatch, ResponseError, MAX_QUERY_LENGTH, handle} from '../dispatch';
import {makeRequest, makeDispatch} from './test-utils';
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
	test('Body parameter verification', async () => {
		let dispatch = makeDispatch({
			date: 'fake-date',
		});
		await expect(dispatch.validateParams()).rejects.toThrow(ResponseError);
		dispatch = makeDispatch({
			date: '2020-01',
			// format verification
			format: '',
		});
		await expect(dispatch.validateParams()).rejects.toThrow(ResponseError);
		dispatch = makeDispatch({
			date: '2020-01',
			format: 'gen8ou',
			// test length limiter
			query: 'abc'.repeat(MAX_QUERY_LENGTH),
		});
		await expect(dispatch.validateParams()).rejects.toThrow(ResponseError);
		dispatch = makeDispatch({
			date: '2020-01',
			format: 'gen8ou',
			// test that it exists
			query: '',
		});
		await expect(dispatch.validateParams()).rejects.toThrow(ResponseError);
		dispatch = makeDispatch({
			date: '2020-01',
			format: 'gen8ou',
			query: 'testing',
			// ensure that rating is valid
			rating: 420,
		});
		await expect(dispatch.validateParams()).rejects.toThrow(ResponseError);
		dispatch = makeDispatch({
			date: '2020-01',
			format: 'gen8ou',
			query: 'testing',
			// check to ensure stats file exists
		});
		await expect(dispatch.validateParams()).rejects.toThrow(ResponseError);
	});
	test('Main request handler', async () => {
		const {req, res} = makeRequest();
		let code = 0;
		res.writeHead = function (c) {
			code = c;
			return this;
		};
		await handle(req, res);
		expect(code).toBe(200);
	});
});
