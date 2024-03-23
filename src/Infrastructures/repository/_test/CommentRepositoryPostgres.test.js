const AddComment = require('../../../Domains/comments/entities/AddComment');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentWithLikesTableTestHelper = require('../../../../tests/CommentWithLikesTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddLikesToComment = require('../../../Domains/comments/entities/AddLikesToComment');
const AddedLikesToComment = require('../../../Domains/comments/entities/AddedLikesToComment');

describe('CommentRepositoryPostgres interface', () => {
  it('should be instance of CommentRepository domain', () => {
    const threadRepositoryPostgres = new CommentRepositoryPostgres({}, {}); // Dummy dependency

    expect(threadRepositoryPostgres).toBeInstanceOf(CommentRepository);
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentWithLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add new comments function and return comments object correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ title: 'sebuah thread' });
      const newComment = new AddComment({
        content: 'sebuah comment',
        owner: 'user-123',
        thread: 'thread-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: 'sebuah comment',
          owner: 'user-123',
          thread: 'thread-123',
        })
      );
      expect(comment).toHaveLength(1);
    });
  });

  describe('checkAvailabilityComment function', () => {
    it('should throw NotFoundError when comment are not found/available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const payload = {
        commentId: 'comment-123',
      };

      // Action & Assert
      await expect(commentRepositoryPostgres.checkAvailabilityComment(payload)).rejects.toThrow(
        NotFoundError
      );
    });

    it('should not throw NotFoundError when comment are available in database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'sebuah title', body: 'lorem ipsum dolor' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        thread: 'thread-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.checkAvailabilityComment('comment-123')
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizedError wheen comment owner is not authorized', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'sebuah title', body: 'lorem ipsum dolor' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        thread: 'thread-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner({
          commentId: 'comment-xxx',
          owner: 'thread-xxx',
        })
      ).rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizedError when comment exist in database and owner are valid', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'sebuah title', body: 'lorem ipsum dolor' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        thread: 'thread-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('getDetailCommentThread function', () => {
    it('should return detail comment when given right payload', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'sebuah title', body: 'lorem ipsum dolor' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        thread: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const detailCommentThread = await commentRepositoryPostgres.getDetailCommentThread(
        'thread-123'
      );
      // Assert
      expect(Array.isArray(detailCommentThread)).toBe(true);
      expect(detailCommentThread[0].id).toEqual('comment-123');
      expect(detailCommentThread[0].username).toEqual('dicoding');
      expect(detailCommentThread[0].content).toEqual('sebuah comment');
      expect(detailCommentThread[0].is_delete).toEqual(false);
      expect(detailCommentThread[0].date).not.toBeNull();
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'sebuah title', body: 'lorem ipsum dolor' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        thread: 'thread-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const commentId = 'comment-123';

      // Action
      await commentRepositoryPostgres.deleteComment(commentId);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(commentId);
      expect(comment[0].is_delete).toEqual(true);
    });
  });

  describe('addLikesToComment function', () => {
    it('should persist add likes to comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const newLikes = new AddLikesToComment({
        threadId: 'thread-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedLikes = await commentRepositoryPostgres.addLikesToComment(newLikes);

      const commentWithLikes = await CommentWithLikesTableTestHelper.findCommentWithLikesById(
        'comment-likes-123'
      );
      expect(addedLikes).toStrictEqual(
        new AddedLikesToComment({
          id: 'comment-likes-123',
          user_id: 'user-123',
          comment_id: 'comment-123',
        })
      );
      expect(commentWithLikes).toHaveLength(1);
    });
  });

  describe('removeLikesFromComment function', () => {
    it('should remove likes from comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread: 'thread-123',
        owner: 'user-123',
      });
      await CommentWithLikesTableTestHelper.addCommentLikes({
        id: 'comment-likes-123',
        userId: 'user-123',
        commentId: 'comment-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const payload = {
        userId: 'user-123',
        commentId: 'comment-123',
      };

      // Action
      await commentRepositoryPostgres.removeLikesFromComment(payload);

      // Assert
      const commentWithLikes = await CommentWithLikesTableTestHelper.findCommentWithLikesById(
        'comment-likes-123'
      );
      expect(commentWithLikes).toHaveLength(0);
    });
  });

  describe('checkWhetherCommentIsLikedOrNot function', () => {
    it('should return true if comment are liked ', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread: 'thread-123',
        owner: 'user-123',
      });
      await CommentWithLikesTableTestHelper.addCommentLikes({
        id: 'comment-likes-123',
        userId: 'user-123',
        commentId: 'comment-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const payload = {
        userId: 'user-123',
        commentId: 'comment-123',
      };

      // Action
      const isLiked = await commentRepositoryPostgres.checkWhetherCommentIsLikedOrNot(payload);

      // Assert
      expect(isLiked).toBe(true);
    });

    it('should return false if comment are not liked', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread: 'thread-123',
        owner: 'user-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const payload = {
        userId: 'user-123',
        commentId: 'comment-123',
      };

      // Action
      const isLiked = await commentRepositoryPostgres.checkWhetherCommentIsLikedOrNot(payload);

      // Assert
      expect(isLiked).toBe(false);
    });
  });
});
