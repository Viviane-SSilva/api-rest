/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { expect, it, beforeAll, afterAll, describe } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'
import { beforeEach } from 'node:test'

describe('Transactios routes', () => {

    beforeAll(async () => {
        execSync('npm run knex migrate:latest')

        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
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

    it('should be able to list all transactions', async () => {
        const createTransactionResponse = await request(app.server)
        .post('/transactions')
        .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit',
        })
        const cookies = createTransactionResponse.get('Set-Cookie')

        const ListTransactionResponse = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookies)
        .expect(200)

        expect(ListTransactionResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'New transaction',
                amount: 5000,
            }),
        ])
    })

    it('should be able to get a specific transaction', async () => {
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

        const transactionId = ListTransactionResponse.body.transactions[0].id 

        const getTransactionResponse = await request(app.server)
        .get(`/transactions/${transactionId}`)
        .set('Cookie', cookies)
        .expect(200)

       expect(getTransactionResponse.body.transaction).toEqual(
       expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
       }),
       )
    })

    it('should be able to get the summary', async () => {
        const createTransactionResponse = await request(app.server)
        .post('/transactions')
        .send({
            title: 'Credit transaction',
            amount: 5000,
            type: 'credit',
        })
        const cookies = createTransactionResponse.get('Set-Cookie')

        await request(app.server)
        .post('/transactions')
        .set('Cookie', cookies)
        .send({
            title: 'Debit transaction',
            amount: 2000,
            type: 'debit',
        })

        const summaryResponse = await request(app.server)
        .get('/transactions/summary')
        .set('Cookie', cookies)
        .expect(200)

        expect(summaryResponse.body.summary).toEqual({
            amount: 3000,
        })
    })
})

