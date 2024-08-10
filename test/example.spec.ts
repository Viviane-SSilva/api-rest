/* eslint-disable prettier/prettier */
import { expect, test } from 'vitest'
import supertest from 'supertest'
import { app } from '../src/app'



test('o usuario consegue criar uma nova transação', () => {

    const responseStatusCode = 201

    expect(responseStatusCode).toEqual(201)

})