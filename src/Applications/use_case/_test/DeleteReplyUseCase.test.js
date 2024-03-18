const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/comment_replies/CommentRepliesRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating delete reply use case correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
      reply: 'reply-123',
    };

    /** creating dependency for use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailabilityThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.checkAvailabilityReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn().mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload.comment);
    expect(mockReplyRepository.checkAvailabilityReply).toBeCalledWith(useCasePayload.reply);
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(
      useCasePayload.reply,
      useCasePayload.owner
    );
    expect(mockReplyRepository.deleteReply).toBeCalledWith(useCasePayload.reply);
  });
});
