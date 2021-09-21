import {Dispatch, ResponseError} from '../dispatch';
import {makeRequest} from './test-utils';
import {URLSearchParams as URLParams} from 'url';

describe('Dispatch', () => {
    test("ResponseError handling", async () => {
        const body = new URLParams({
            query: 'badquery',
        });
        const {req, res} = makeRequest();
        req.url = `/?` + body;
        const dispatch = new Dispatch(req, res);
        try {
            await dispatch.execute();
        } catch (e: any) {
            expect(e.message).toEqual('Endpoint not found');
            expect(e).toBeInstanceOf(ResponseError);
        }
    });
});