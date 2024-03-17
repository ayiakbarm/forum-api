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
      comments: 'sebuah comment',
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should remapping payload when depends on is_delete value', () => {
    // Arrange
    const payload = {
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2024-03-17T04:38:49.872Z',
          content: 'sebuah comment',
          is_delete: false,
        },
        {
          id: 'comment-abc',
          username: 'dicoding',
          date: '2024-03-17T04:38:49.874Z',
          content: 'sebuah comment',
          is_delete: true,
        },
      ],
    };

    const expectedComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2024-03-17T04:38:49.872Z',
        content: 'sebuah comment',
      },
      {
        id: 'comment-abc',
        username: 'dicoding',
        date: '2024-03-17T04:38:49.874Z',
        content: '**komentar telah dihapus**',
      },
    ];

    // Action
    const { comments } = new DetailComment(payload);

    // Assert
    expect(comments).toEqual(expectedComments);
  });

  it('should return detailComments object correctly', () => {
    // Arrange
    const payload = {
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2024-03-17T04:38:49.872Z',
          content: 'sebuah comment',
        },
        {
          id: 'comment-abc',
          username: 'dicoding',
          date: '2024-03-17T04:38:49.874Z',
          content: '**komentar telah dihapus**',
        },
      ],
    };

    // Action
    const { comments } = new DetailComment(payload);

    // Assert
    expect(comments).toEqual(payload.comments);
  });
});
