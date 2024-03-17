const AddCommentUseCase = require('../AddCommentUseCase');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
  it('should throw an error when payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah comment',
    };
    /** creating dependency for use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addCommentUseCase.execute(useCasePayload)).rejects.toThrowError(
      'ADD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw an error when payload meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      content: true,
      owner: 123,
    };
    /** creating dependency for use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addCommentUseCase.execute(useCasePayload)).rejects.toThrowError(
      'ADD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating add comment use case correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      content: 'sebuah comment',
      owner: 'user-123',
    };
    const mockComment = new AddedComment({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
      thread: 'thread-123',
    });

    /** creating dependency for use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.addComment).toBeCalledWith({
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      thread: useCasePayload.thread,
    });
    expect(addedComment).toStrictEqual(mockComment);
  });
});
