const AddThread = require('../../../Domains/threads/entities/AddThread');
const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

describe('ThreadRepositoryPostgres', () => {
  it('should be instance of ThreadRepository domain', () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {}); // Dummy dependency

    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add new thread and return the thread that create before correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'user12345' });
      const newThread = new AddThread({
        title: 'Dicoding Awesome',
        body: 'This is the best course ever.',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'Dicoding Awesome',
          owner: 'user-123',
        })
      );
    });
  });

  describe('checkAvailabilityThread function', () => {
    it('should throw error NotFoundError when thread are not found/available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const threadId = 'abc';

      // Action & Assert
      await expect(threadRepositoryPostgres.checkAvailabilityThread(threadId)).rejects.toThrow(
        NotFoundError
      );
    });

    it('should not throw error NotFoundError when thread are exist in database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'sebuah thread' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.checkAvailabilityThread('thread-123')
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getDetailThread function', () => {
    it('should get detail thread when given right payload', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'lorem ipsum dolor sit amet',
        created_at: new Date().toISOString(),
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({ content: 'sebuah comment' });
      await CommentsTableTestHelper.addComment({ id: 'comment-abc', content: 'sebuah comment' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const detailThread = await threadRepositoryPostgres.getDetailThread('thread-123');

      // Assert
      expect(detailThread.id).toEqual('thread-123');
      expect(detailThread.title).toEqual('sebuah thread');
      expect(detailThread.body).toEqual('lorem ipsum dolor sit amet');
      expect(detailThread.username).toEqual('dicoding');
      expect(detailThread.date).not.toBeNull();
    });
  });
});
