const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddLikesToComment = require('../../../Domains/comments/entities/AddLikesToComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddedLikesToComment = require('../../../Domains/comments/entities/AddedLikesToComment');
const AddLikesToCommentUseCase = require('../AddLikesToCommentUseCase');

describe('AddLikesToCommentUseCase', () => {
  it('should orchestrating add likes to comment use case correctly', async () => {
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

    // Action
    const addedLikes = await addLikesToCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith(
      useCasePayload.commentId
    );
    expect(mockCommentRepository.addLikesToComment).toHaveBeenCalledWith(useCasePayload);
    expect(addedLikes).toStrictEqual(expectedAddedLikesToComment);
  });
});
