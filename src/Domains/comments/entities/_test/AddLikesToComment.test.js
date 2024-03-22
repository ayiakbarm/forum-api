const AddLikesToComment = require('../AddLikesToComment');

describe('AddLikesToComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new AddLikesToComment(payload)).toThrowError(
      'ADD_LIKES_TO_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specifications', () => {
    // Arrange
    const payload = {
      threadId: true,
      commentId: {},
    };

    // Action & Assert
    expect(() => new AddLikesToComment(payload)).toThrowError(
      'ADD_LIKE_TO_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create AddLikesToComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // Action
    const { threadId, commentId } = new AddLikesToComment(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
  });
});
