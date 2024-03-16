const DetailComment = require('../DetailComment');

describe('DetailComment entities', () => {
  it('should throw error not contain needed property when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      comment: true,
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create detailComment object correctly', () => {
    // Arrange
    const payload = {
      comment: 'comment-123',
    };

    // Action
    const { comment } = new DetailComment(payload);

    // Assert
    expect(comment).toEqual(payload.comment);
  });
});
