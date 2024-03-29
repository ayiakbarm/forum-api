const AddComment = require('../AddComment');

describe('AddComment entity', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: true,
      owner: 'user-123',
      thread: {},
    };

    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create addComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'siapa yang mau beli cilok?',
      owner: 'user-123',
      thread: 'thread-123',
    };

    // Action
    const { content, owner, thread } = new AddComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(thread).toEqual(payload.thread);
  });
});
