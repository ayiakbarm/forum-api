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
});
