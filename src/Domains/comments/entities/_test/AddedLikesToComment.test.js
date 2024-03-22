const AddedLikesToComment = require('../AddedLikesToComment');

describe('AddedLikesToComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new AddedLikesToComment(payload)).toThrowError(
      'ADDED_LIKES_TO_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: true,
      userId: 123,
      commentId: 'comment-123',
    };

    // Action & Assert
    expect(() => new AddedLikesToComment(payload)).toThrowError(
      'ADDED_LIKES_TO_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create addedLikesToComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-likes-123',
      userId: 'user-123',
      commentId: 'comment-123',
    };

    // Action
    const { id, userId, commentId } = new AddedLikesToComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(userId).toEqual(payload.userId);
    expect(commentId).toEqual(payload.commentId);
  });
});
