const CommentRepliesTableTestHelper = require('../../../../tests/CommentRepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

const pool = require('../../database/postgres/pool');
const CommentRepliesRepositoryPostgres = require('../CommentRepliesRepositoryPostgres');
const AddReply = require('../../../Domains/comment_replies/entities/AddReply');

describe('CommentRepliesRepositoryPostgres interface', () => {
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
      await commentRepliesRepositoryPostgres.addReply(newReply);

      // Assert
      const reply = await CommentRepliesTableTestHelper.findReplyById('reply-123');
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
      console.log(detailReplyComment);

      // Assert
      expect(Array.isArray(detailReplyComment)).toBe(true);
      expect(detailReplyComment[0].id).toEqual('reply-123');
      expect(detailReplyComment[0].content).toEqual('sebuah balasan komen dari comment 123');
      expect(detailReplyComment[0].username).toEqual('dicoding');
    });
  });
});
