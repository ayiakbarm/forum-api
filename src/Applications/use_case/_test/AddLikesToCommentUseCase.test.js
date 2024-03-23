const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddLikesToComment = require('../../../Domains/comments/entities/AddLikesToComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddedLikesToComment = require('../../../Domains/comments/entities/AddedLikesToComment');
const AddLikesToCommentUseCase = require('../AddLikesToCommentUseCase');

describe('AddLikesToCommentUseCase', () => {
  it('should orchestrating remove likes from comment when comment isLiked value equal to true', async () => {
    // Arrange
    const useCasePayload = new AddLikesToComment({
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    });

    /** creating dependency for use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkWhetherCommentIsLikedOrNot = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.removeLikesFromComment = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const addLikesToCommentUseCase = new AddLikesToCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const isLiked = await mockCommentRepository.checkWhetherCommentIsLikedOrNot(
      useCasePayload.userId,
      useCasePayload.commentId
    );

    // Action
    await addLikesToCommentUseCase.execute(useCasePayload);

    // Assert
    expect(isLiked).toBe(true);
    expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith(
      useCasePayload.commentId
    );
    expect(mockCommentRepository.checkWhetherCommentIsLikedOrNot).toHaveBeenCalledWith(
      useCasePayload.userId,
      useCasePayload.commentId
    );
    expect(mockCommentRepository.removeLikesFromComment).toHaveBeenCalledWith(
      useCasePayload.userId,
      useCasePayload.commentId
    );
  });

  it('should orchestrating add likes to comment when commen isLiked value equal to false', async () => {
    // Arrange
    const useCasePayload = new AddLikesToComment({
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    });

    const expectedAddedLikesToComment = new AddedLikesToComment({
      id: 'comment-likes-123',
      user_id: 'user-123',
      comment_id: 'comment-123',
    });

    /** creating dependency for use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkWhetherCommentIsLikedOrNot = jest.fn(() => Promise.resolve(false));
    mockCommentRepository.addLikesToComment = jest.fn(() =>
      Promise.resolve(
        new AddedLikesToComment({
          id: 'comment-likes-123',
          user_id: 'user-123',
          comment_id: 'comment-123',
        })
      )
    );

    /** creating use case instance */
    const addLikesToCommentUseCase = new AddLikesToCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const isLiked = await mockCommentRepository.checkWhetherCommentIsLikedOrNot(
      useCasePayload.userId,
      useCasePayload.commentId
    );

    // Action
    const addedLikes = await addLikesToCommentUseCase.execute(useCasePayload);

    // Assert
    expect(isLiked).toBe(false);
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.checkWhetherCommentIsLikedOrNot).toBeCalledWith(
      useCasePayload.userId,
      useCasePayload.commentId
    );
    expect(mockCommentRepository.addLikesToComment).toBeCalledWith(
      useCasePayload.userId,
      useCasePayload.commentId
    );
    expect(addedLikes).toStrictEqual(expectedAddedLikesToComment);
  });
});
