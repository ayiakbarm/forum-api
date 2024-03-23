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
      user_id: 123,
      comment_id: 'comment-123',
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
      user_id: 'user-123',
      comment_id: 'comment-123',
    };

    // Action
    const { id, user_id, comment_id } = new AddedLikesToComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(user_id).toEqual(payload.user_id);
    expect(comment_id).toEqual(payload.comment_id);
  });
});
