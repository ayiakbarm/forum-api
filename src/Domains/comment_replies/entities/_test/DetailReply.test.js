const DetailReply = require('../DetailReply');

describe('DetailReply entity', () => {
  it('should throw error not contain needed property when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      replies: 'sebuah comment',
    };

    // Action & Assert
    expect(() => new DetailReply(payload)).toThrowError(
      'DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should remapping payload when depends on is_delete value', () => {
    // Arrange
    const payload = {
      replies: [
        {
          id: 'reply-BErOXUSefjwWGW1Z10Ihk',
          content: 'sebuah balasan yang akan dihapus',
          date: '2021-08-08T07:59:48.766Z',
          username: 'johndoe',
          is_delete: true,
        },
        {
          id: 'reply-xNBtm9HPR-492AeiimpfN',
          content: 'sebuah balasan',
          date: '2021-08-08T08:07:01.522Z',
          username: 'dicoding',
          is_delete: false,
        },
      ],
    };

    const expectedReplies = [
      {
        id: 'reply-BErOXUSefjwWGW1Z10Ihk',
        content: '**balasan telah dihapus**',
        date: '2021-08-08T07:59:48.766Z',
        username: 'johndoe',
      },
      {
        id: 'reply-xNBtm9HPR-492AeiimpfN',
        content: 'sebuah balasan',
        date: '2021-08-08T08:07:01.522Z',
        username: 'dicoding',
      },
    ];

    // Action
    const { replies } = new DetailReply(payload);

    // Assert
    expect(replies).toEqual(expectedReplies);
  });

  it('should return detail reply object correctly', () => {
    // Arrange
    const payload = {
      replies: [
        {
          id: 'reply-BErOXUSefjwWGW1Z10Ihk',
          content: '**balasan telah dihapus**',
          date: '2021-08-08T07:59:48.766Z',
          username: 'johndoe',
        },
        {
          id: 'reply-xNBtm9HPR-492AeiimpfN',
          content: 'sebuah balasan',
          date: '2021-08-08T08:07:01.522Z',
          username: 'dicoding',
        },
      ],
    };

    // Action
    const { replies } = new DetailReply(payload);

    // Assert
    expect(replies).toEqual(payload.replies);
  });
});
