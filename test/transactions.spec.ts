/* eslint-disable prettier/prettier */
import { expect, it, beforeAll, afterAll, describe } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactios routes', () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a new transaction', async () => {

        await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 5000,
                type: 'credit',
            })
            .expect(201)
    })

    it('should be able to list all transaction', async () => {
        const createTransactionResponse = await request(app.server)
        .post('/transactions')
        .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit',
        })

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const cookies = createTransactionResponse.get('Set-Cookie')
        
        const ListTransactionResponse = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookies)
        .expect(200)

       expect(ListTransactionResponse.body.transactions).toEqual([
       expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
       })
       ])
    })
})

