const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw an error when payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {
      thread: true,
      commentId: {},
    };
    /** creating dependency for use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw an error when payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      thread: true,
      commentId: {},
      owner: 'hello world',
    };
    /** creating dependency for use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });
  it('should orchestrating delete comment correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };
    /** creating dependency for use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailabilityThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.commentId);
  });
});
