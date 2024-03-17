const AddReply = require('../AddReply');

describe('AddReply entity', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specifications', () => {
    // Arrange
    const payload = {
      content: 'sebuah reply balasan',
      owner: true,
      comment: {},
      thread: 'thread-123',
    };

    // Action & Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should not throw any error and return AddReply object correctly', () => {
    const payload = {
      content: 'sebuah reply balasan',
      owner: 'user-123',
      comment: 'comment-123',
      thread: 'thread-123',
    };

    // Action
    const { content, owner, comment, thread } = new AddReply(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(comment).toEqual(payload.comment);
    expect(thread).toEqual(payload.thread);
  });
});
