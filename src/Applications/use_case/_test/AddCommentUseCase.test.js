const AddCommentUseCase = require('../AddCommentUseCase');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('AddCommentUseCase', () => {
  it('should orchestrating add comment use case correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah comment',
      owner: 'user-123',
    };
    const mockComment = new AddedComment({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    });

    /** creating dependency for use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.addComment).toBeCalledWith(useCasePayload);
    expect(addedComment).toStrictEqual(mockComment);
  });
});
