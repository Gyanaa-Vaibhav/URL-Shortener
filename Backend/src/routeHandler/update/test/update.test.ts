import request from 'supertest';
import express from 'express';
import updateRoute from '../routes/updateRouter';

const app = express();
app.use('/update', updateRoute);

describe('update Route', () => {
    it('should render the update page', async () => {
        const res = await request(app).get('/update');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Render update page here');
    });
});
