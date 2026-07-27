import { expect } from 'chai';
import supertest from 'supertest';

import { app } from '../../main/app';

describe('Home page', () => {
  describe('on GET', () => {
    test('should return sample home page', async () => {
      await supertest(app)
        .get('/')
        .expect(res => expect(res.status).to.equal(200));
    });
  });
});
