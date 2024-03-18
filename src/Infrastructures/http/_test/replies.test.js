const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentRepliesTableTestHelper = require('../../../../tests/CommentRepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  afterEach(async () => {
    await CommentRepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /replies', () => {
    it('should response with 401 when token authentication not provided', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments/xxx/replies',
        payload: {
          content: 'sebuah balasan komen',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response with 404 when threads are not found', async () => {
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

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ayiakbar',
          password: 'secret',
        },
      });
      const responseAuthJson = JSON.parse(responseAuth.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/abc/comments',
        payload: {
          content: 'sebuah comment',
        },
        headers: { authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread not found in database');
    });

    it('should response with 404 when comments are not found', async () => {
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
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const authUserA = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ayiakbar',
          password: 'secret',
        },
      });
      const authUserAResponse = JSON.parse(authUserA.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'lorem ipsum dolor sit amet, consectetur',
        },
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });
      const responseThreadJson = JSON.parse(thread.payload);

      await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments/xxx/replies`,
        payload: {
          content: 'sebuah balasan komen',
        },
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment not found in database');
    });

    it('should response with 400 when reply payload not contain needed property', async () => {
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
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const authUserA = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ayiakbar',
          password: 'secret',
        },
      });
      const authUserAResponse = JSON.parse(authUserA.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'lorem ipsum dolor sit amet, consectetur',
        },
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });
      const responseThreadJson = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });
      const responseCommentJson = JSON.parse(comment.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments/${responseCommentJson.data.addedComment.id}/replies`,
        payload: {},
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response with 400 when reply payload does not meet data type specification', async () => {
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
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const authUserA = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ayiakbar',
          password: 'secret',
        },
      });
      const authUserAResponse = JSON.parse(authUserA.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'lorem ipsum dolor sit amet, consectetur',
        },
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });
      const responseThreadJson = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });
      const responseCommentJson = JSON.parse(comment.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments/${responseCommentJson.data.addedComment.id}/replies`,
        payload: {
          content: true,
        },
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat reply baru karena tipe data tidak sesuai'
      );
    });

    it('should response with 201 when reply payload are valid', async () => {
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
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const authUserA = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ayiakbar',
          password: 'secret',
        },
      });
      const authUserAResponse = JSON.parse(authUserA.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'lorem ipsum dolor sit amet, consectetur',
        },
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });
      const responseThreadJson = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });
      const responseCommentJson = JSON.parse(comment.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments/${responseCommentJson.data.addedComment.id}/replies`,
        payload: {
          content: 'sebuah komen balasan',
        },
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply.content).toEqual('sebuah komen balasan');
    });
  });

  describe('when DELETE .../replies/{replyId}', () => {
    it('should response with 401 when token are not provided', async () => {
      // Arrange
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/xxx/comments/xxx/replies/xxx',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response with 403 when users are not authorized to delete reply', async () => {
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
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const authUserA = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ayiakbar',
          password: 'secret',
        },
      });
      const authUserAResponse = JSON.parse(authUserA.payload);

      const authUserB = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authUserBResponse = JSON.parse(authUserB.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'lorem ipsum dolor sit amet, consectetur',
        },
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });
      const responseThreadJson = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });
      const responseCommentJson = JSON.parse(comment.payload);

      const reply = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments/${responseCommentJson.data.addedComment.id}/replies`,
        payload: {
          content: 'sebuah komen balasan',
        },
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });
      const replyResponseJson = JSON.parse(reply.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments/${responseCommentJson.data.addedComment.id}/replies/${replyResponseJson.data.addedReply.id}`,
        headers: { authorization: `Bearer ${authUserBResponse.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('user not authorized to delete this reply');
    });
    it('should response with 404 when threads are not found in database', async () => {
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
      const authUserA = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ayiakbar',
          password: 'secret',
        },
      });
      const authUserAResponse = JSON.parse(authUserA.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/xxx/comments/xxx/replies/xxx}`,
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread not found in database');
    });

    it('should response with 404 when comments are not found in database', async () => {
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
      const authUserA = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ayiakbar',
          password: 'secret',
        },
      });
      const authUserAResponse = JSON.parse(authUserA.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'lorem ipsum dolor sit amet, consectetur',
        },
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });
      const responseThreadJson = JSON.parse(thread.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments/xxx/replies/xxx}`,
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment not found in database');
    });

    it('should response with 404 when reply are not found in database', async () => {
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
      const authUserA = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ayiakbar',
          password: 'secret',
        },
      });
      const authUserAResponse = JSON.parse(authUserA.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'lorem ipsum dolor sit amet, consectetur',
        },
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });
      const responseThreadJson = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });
      const responseCommentJson = JSON.parse(comment.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments/${responseCommentJson.data.addedComment.id}/replies/xxx}`,
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('reply not found in database');
    });

    it('should response with 200 when reply payload are available', async () => {
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

      const authUserA = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ayiakbar',
          password: 'secret',
        },
      });
      const authUserAResponse = JSON.parse(authUserA.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'lorem ipsum dolor sit amet, consectetur',
        },
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });
      const responseThreadJson = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });
      const responseCommentJson = JSON.parse(comment.payload);

      const reply = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments/${responseCommentJson.data.addedComment.id}/replies`,
        payload: {
          content: 'sebuah komen balasan',
        },
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });
      const replyResponseJson = JSON.parse(reply.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments/${responseCommentJson.data.addedComment.id}/replies/${replyResponseJson.data.addedReply.id}`,
        headers: { authorization: `Bearer ${authUserAResponse.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
