const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/thread/{threadId}/comments endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST comments', () => {
    it('should response with 401 when payload does not contain token for authentication', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah comment',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
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
      const addThreadPayload = {
        title: 'sebuah thread',
        body: 'lorem ipsum dolor sit amet, consectetur',
      };
      const requestPayload = {
        owner: {},
      };
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: registerUserPayload,
      });

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const responseAuthJson = JSON.parse(responseAuth.payload);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: addThreadPayload,
        headers: { authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });
      const responseThreadJson = JSON.parse(responseThread.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
        payload: requestPayload,
        headers: { authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response with 400 when payload does not meet data type specification', async () => {
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
      const addThreadPayload = {
        title: 'sebuah thread',
        body: 'lorem ipsum dolor sit amet, consectetur',
      };
      const requestPayload = {
        content: {},
      };
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: registerUserPayload,
      });

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const responseAuthJson = JSON.parse(responseAuth.payload);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: addThreadPayload,
        headers: { authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });
      const responseThreadJson = JSON.parse(responseThread.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
        payload: requestPayload,
        headers: { authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena tipe data tidak sesuai'
      );
    });

    it('should response with 404 when threads not found', async () => {
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
        content: 'sebuah comment',
      };
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: registerUserPayload,
      });

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const responseAuthJson = JSON.parse(responseAuth.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/abc/comments',
        payload: requestPayload,
        headers: { authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread not found in database');
    });

    it('should response with 201 when payload are valid and return addedComment object correctly', async () => {
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
      const addThreadPayload = {
        title: 'sebuah thread',
        body: 'lorem ipsum dolor sit amet, consectetur',
      };
      const requestPayload = {
        content: 'sebuah comment',
      };
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: registerUserPayload,
      });

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const responseAuthJson = JSON.parse(responseAuth.payload);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: addThreadPayload,
        headers: { authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });
      const responseThreadJson = JSON.parse(responseThread.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
        payload: requestPayload,
        headers: { authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment.content).toEqual('sebuah comment');
    });
  });
  describe('when DELETE comment threads/{threadId}/comments/{commentId} endpoint', () => {
    it('should response with 401 when payload does not contain token for authentication', async () => {
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
      const addThreadPayload = {
        title: 'sebuah thread',
        body: 'lorem ipsum dolor sit amet, consectetur',
      };
      const addCommentPayload = {
        content: 'sebuah comment',
      };

      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: registerUserPayload,
      });

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const responseAuthJson = JSON.parse(responseAuth.payload);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: addThreadPayload,
        headers: { authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });
      const responseThreadJson = JSON.parse(responseThread.payload);

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
        payload: addCommentPayload,
        headers: { authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });
      const responseCommentJson = JSON.parse(responseComment.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments/${responseCommentJson.data.addedComment.id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response with 403 when unauthorized user trying delete comment', async () => {
      // Arrange
      const registerUserAPayload = {
        username: 'ayiakbar',
        password: 'secret',
        fullname: 'Ayi Akbar Maulana',
      };
      const registerUserBPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const loginUserAPayload = {
        username: 'ayiakbar',
        password: 'secret',
      };
      const loginUserBPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const addThreadPayload = {
        title: 'sebuah thread',
        body: 'lorem ipsum dolor sit amet, consectetur',
      };
      const addCommentPayload = {
        content: 'sebuah comment',
      };

      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: registerUserAPayload,
      });
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: registerUserBPayload,
      });

      const responseAuthUserA = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginUserAPayload,
      });
      const responseAuthAJson = JSON.parse(responseAuthUserA.payload);

      const responseAuthUserB = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginUserBPayload,
      });
      const responseAuthBJson = JSON.parse(responseAuthUserB.payload);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: addThreadPayload,
        headers: { authorization: `Bearer ${responseAuthAJson.data.accessToken}` },
      });
      const responseThreadJson = JSON.parse(responseThread.payload);
      console.log('responseThreadJson', responseThreadJson);

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
        payload: addCommentPayload,
        headers: { authorization: `Bearer ${responseAuthAJson.data.accessToken}` },
      });
      const responseCommentJson = JSON.parse(responseComment.payload);
      console.log('responseCommentJson', responseCommentJson);
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments/${responseCommentJson.data.addedComment.id}`,
        headers: { authorization: `Bearer ${responseAuthBJson.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      console.log('response', responseJson);
      expect(response.statusCode).toEqual(403);
    });
  });
});
