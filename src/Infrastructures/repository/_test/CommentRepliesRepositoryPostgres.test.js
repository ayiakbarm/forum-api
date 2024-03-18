const CommentRepliesTableTestHelper = require('../../../../tests/CommentRepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

const pool = require('../../database/postgres/pool');
const CommentRepliesRepositoryPostgres = require('../CommentRepliesRepositoryPostgres');
const AddReply = require('../../../Domains/comment_replies/entities/AddReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const CommentRepliesRepository = require('../../../Domains/comment_replies/CommentRepliesRepository');
const AddedReply = require('../../../Domains/comment_replies/entities/AddedReply');

describe('CommentRepliesRepositoryPostgres interface', () => {
  it('should be instance of CommentRepliesRepository domain', () => {
    const threadRepositoryPostgres = new CommentRepliesRepositoryPostgres({}, {}); // Dummy dependency

    expect(threadRepositoryPostgres).toBeInstanceOf(CommentRepliesRepository);
  });

  afterEach(async () => {
    await CommentRepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add new reply function and return comment_reply object correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ owner: 'user-123', thread: 'thread-123' });
      const newReply = new AddReply({
        content: 'sebuah balasan komen',
        owner: 'user-123',
        comment: 'comment-123',
        thread: 'thread-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepliesRepositoryPostgres = new CommentRepliesRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedReply = await commentRepliesRepositoryPostgres.addReply(newReply);

      // Assert
      const reply = await CommentRepliesTableTestHelper.findReplyById('reply-123');
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: 'reply-123',
          content: 'sebuah balasan komen',
          owner: 'user-123',
          comment: 'comment-123',
          thread: 'thread-123',
        })
      );
      expect(reply).toHaveLength(1);
    });
  });

  describe('getDetailReplyComment function', () => {
    it('should return detail reply when given right payload', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'sebuah title', body: 'lorem ipsum dolor' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        thread: 'thread-123',
      });
      await CommentRepliesTableTestHelper.addReply({
        content: 'sebuah balasan komen dari comment 123',
      });

      const commentRepliesRepositoryPostgres = new CommentRepliesRepositoryPostgres(pool, {});

      // Action
      const detailReplyComment = await commentRepliesRepositoryPostgres.getDetailReplyComment(
        'comment-123'
      );

      // Assert
      expect(Array.isArray(detailReplyComment)).toBe(true);
      expect(detailReplyComment[0].id).toEqual('reply-123');
      expect(detailReplyComment[0].content).toEqual('sebuah balasan komen dari comment 123');
      expect(detailReplyComment[0].username).toEqual('dicoding');
    });
  });

  describe('checkAvailabilityReply function', () => {
    it('should throw NotFoundError when reply are not found', async () => {
      // Arrange
      const commentRepliesRepositoryPostgres = new CommentRepliesRepositoryPostgres(pool, {});
      const payload = {
        reply: 'reply-123',
      };

      // Action & Assert
      await expect(
        commentRepliesRepositoryPostgres.checkAvailabilityReply(payload)
      ).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when reply are available in database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'sebuah title', body: 'lorem ipsum dolor' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        thread: 'thread-123',
      });
      await CommentRepliesTableTestHelper.addReply({
        content: 'sebuah balasan komen dari comment 123',
      });
      const commentRepliesRepositoryPostgres = new CommentRepliesRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepliesRepositoryPostgres.checkAvailabilityReply('reply-123')
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizedError when reply owner is not authorized', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'sebuah title', body: 'lorem ipsum dolor' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        thread: 'thread-123',
      });
      await CommentRepliesTableTestHelper.addReply({
        content: 'sebuah balasan komen dari comment 123',
      });
      const commentRepliesRepositoryPostgres = new CommentRepliesRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepliesRepositoryPostgres.verifyReplyOwner('reply-xxx', 'user-xxx')
      ).rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizedError when reply are exist and owner is a valid owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'sebuah title', body: 'lorem ipsum dolor' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        thread: 'thread-123',
      });
      await CommentRepliesTableTestHelper.addReply({
        content: 'sebuah balasan komen dari comment 123',
      });
      const commentRepliesRepositoryPostgres = new CommentRepliesRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepliesRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteReply function', () => {
    it('should delete reply from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'sebuah title', body: 'lorem ipsum dolor' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        thread: 'thread-123',
      });
      await CommentRepliesTableTestHelper.addReply({
        content: 'sebuah balasan komen dari comment 123',
      });
      const commentRepliesRepositoryPostgres = new CommentRepliesRepositoryPostgres(pool, {});

      // Action
      await commentRepliesRepositoryPostgres.deleteReply('reply-123');

      // Assert
      const reply = await CommentRepliesTableTestHelper.findReplyById('reply-123');
      expect(reply[0].is_delete).toEqual(true);
    });
  });
});
