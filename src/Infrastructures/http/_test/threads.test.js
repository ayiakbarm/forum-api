const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response with 401 when payload does not have authentication', async () => {
      // Arrange
      const requestPayload = {
        title: 'Dicoding Awesome',
        body: 'The best course ever',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response with 400 when payload not contain needed property', async () => {
      // Arrange
      const registerUserPayload = {
        username: 'ayiakbar',
        password: 'secret',
        fullname: 'Ayi Akbar Maulana',
      };
      const loginPayload = {
        username: 'ayiakbar',
        password: 'secret',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: registerUserPayload,
      });
      const authentications = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const responseAuthJson = JSON.parse(authentications.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {},
        headers: { authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response with 400 when payload data type not meet specification', async () => {
      // Arrange
      const registerUserPayload = {
        username: 'ayiakbar',
        password: 'secret',
        fullname: 'Ayi Akbar Maulana',
      };
      const loginPayload = {
        username: 'ayiakbar',
        password: 'secret',
      };
      const requestPayload = {
        title: true,
        body: {},
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: registerUserPayload,
      });
      const authentications = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const responseAuthJson = JSON.parse(authentications.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai'
      );
    });

    it('should response with 400 when title payload more than 100 characters', async () => {
      // Arrange
      const registerUserPayload = {
        username: 'ayiakbar',
        password: 'secret',
        fullname: 'Ayi Akbar Maulana',
      };
      const loginPayload = {
        username: 'ayiakbar',
        password: 'secret',
      };
      const requestPayload = {
        title:
          'dicodingAreTheBest dicodingAreTheBest dicodingAreTheBest dicodingAreTheBest dicodingAreTheBest dicodingAreTheBest dicodingAreTheBest dicodingAreTheBestdicodingAreTheBest dicodingAreTheBest dicodingAreTheBest dicodingAreTheBestdicodingAreTheBest dicodingAreTheBest dicodingAreTheBest dicodingAreTheBestdicodingAreTheBest dicodingAreTheBest dicodingAreTheBest dicodingAreTheBestdicodingAreTheBest dicodingAreTheBest dicodingAreTheBest dicodingAreTheBest',
        body: 'hello world',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: registerUserPayload,
      });
      const authentications = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const responseAuthJson = JSON.parse(authentications.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena karakter title melebihi batas limit'
      );
    });

    it('should response with 201 and persisted thread', async () => {
      // Arrange
      const registerUserPayload = {
        username: 'ayiakbar',
        password: 'secret',
        fullname: 'Ayi Akbar Maulana',
      };
      const loginPayload = {
        username: 'ayiakbar',
        password: 'secret',
      };
      const requestPayload = {
        title: 'Dicoding Awesome',
        body: 'The best course ever',
      };
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: registerUserPayload,
      });
      const authentications = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const responseAuthJson = JSON.parse(authentications.payload);

      // Action

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.data.addedThread.title).toEqual(requestPayload.title);
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response with 404 when threads not found in database', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/xxx`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread not found in database');
    });
    it('should response with 200 and getting detail threads as a return', async () => {
      // Arrange
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'ayiakbar',
          password: 'secret',
          fullname: 'Ayi Akbar Maulana',
        },
      });

      const authentications = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ayiakbar',
          password: 'secret',
        },
      });
      const responseAuthJson = JSON.parse(authentications.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Dicoding Awesome',
          body: 'The best course ever',
        },
        headers: { authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });
      const threadResponseJson = JSON.parse(thread.payload);

      await server.inject({
        method: 'POST',
        url: `/threads/${threadResponseJson.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: { authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      await server.inject({
        method: 'POST',
        url: `/threads/${threadResponseJson.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment 123',
        },
        headers: { authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadResponseJson.data.addedThread.id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.id).toEqual(threadResponseJson.data.addedThread.id);
      expect(responseJson.data.thread.title).toEqual(threadResponseJson.data.addedThread.title);
      expect(responseJson.data.thread.body).toEqual('The best course ever');
      expect(responseJson.data.thread.username).toEqual('ayiakbar');
    });
  });
});
