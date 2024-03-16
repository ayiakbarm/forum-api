const DetailThread = require('../DetailThread');

describe('DetailThread entities', () => {
  it('should throw error not contain needed property when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      thread: true,
    };

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create detailThread object correctly', () => {
    // Arrange
    const payload = {
      thread: 'thread-123',
    };

    // Action
    const { thread } = new DetailThread(payload);

    // Assert
    expect(thread).toEqual(payload.thread);
  });
});
