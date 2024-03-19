const AddReplyUseCase = require('../AddReplyUseCase');
const AddReply = require('../../../Domains/comment_replies/entities/AddReply');
const AddedReply = require('../../../Domains/comment_replies/entities/AddedReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentRepliesRepository = require('../../../Domains/comment_replies/CommentRepliesRepository');

describe('AddReplyUseCase', () => {
  it('should orchestrating add reply use case correctly', async () => {
    // Arrange
    const useCasePayload = new AddReply({
      content: 'sebuah balasan komen',
      owner: 'user-123',
      comment: 'comment-123',
      thread: 'thread-123',
    });
    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    });

    /** creating dependency for use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentRepliesRepository = new CommentRepliesRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailabilityThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepliesRepository.addReply = jest.fn(
      () =>
        new AddedReply({
          id: 'reply-123',
          content: 'sebuah balasan',
          owner: 'user-123',
        })
    );

    /** creating useCase instance */
    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentRepliesRepository: mockCommentRepliesRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload.comment);
    expect(mockCommentRepliesRepository.addReply).toBeCalledWith(
      new AddReply({
        content: useCasePayload.content,
        owner: useCasePayload.owner,
        comment: useCasePayload.comment,
        thread: useCasePayload.thread,
      })
    );
    expect(addedReply).toStrictEqual(expectedAddedReply);
  });
});
