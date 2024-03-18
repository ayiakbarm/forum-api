const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentRepliesRepository = require('../../../Domains/comment_replies/CommentRepliesRepository');

describe('GetDetailThreadUseCase', () => {
  it('should throw an error when payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};
    /** creating dependency for use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentRepliesRepository = new CommentRepliesRepository();

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentRepliesRepository: mockCommentRepliesRepository,
    });

    // Action & Assert
    await expect(getDetailThreadUseCase.execute(useCasePayload)).rejects.toThrowError(
      'GET_DETAIL_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw an error when payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      thread: true,
    };
    /** creating dependency for use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentRepliesRepository = new CommentRepliesRepository();

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentRepliesRepository: mockCommentRepliesRepository,
    });

    // Action & Assert
    await expect(getDetailThreadUseCase.execute(useCasePayload)).rejects.toThrowError(
      'GET_DETAIL_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating get detail thread correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
    };

    const expectedThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'lorem ipsum dolor sit amet',
      date: '2024-03-17T04:38:49.874Z',
      username: 'dicoding',
    };

    const expectedComments = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        thread: 'thread-123',
        is_delete: false,
      },
      {
        id: 'comment-yksuCoxM2s4MMrZJO-qVD',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'tolong tunjukkan errornya',
        is_delete: true,
      },
    ];

    const expectedReplies = [
      {
        id: 'reply-BErOXUSefjwWGW1Z10Ihk',
        content: 'sebuah balasan yang akan di hapus',
        date: '2021-08-08T07:59:48.766Z',
        username: 'johndoe',
        thread: 'thread-123',
        is_delete: true,
      },
      {
        id: 'reply-xNBtm9HPR-492AeiimpfN',
        content: 'sebuah balasan',
        date: '2021-08-08T08:07:01.522Z',
        username: 'dicoding',
        thread: 'thread-abc',
        is_delete: false,
      },
    ];

    const expectedDetailThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'lorem ipsum dolor sit amet',
      date: '2024-03-17T04:38:49.874Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          thread: 'thread-123',
          replies: [
            {
              id: 'reply-BErOXUSefjwWGW1Z10Ihk',
              content: '**balasan telah dihapus**',
              date: '2021-08-08T07:59:48.766Z',
              username: 'johndoe',
              thread: 'thread-123',
            },
            {
              id: 'reply-xNBtm9HPR-492AeiimpfN',
              content: 'sebuah balasan',
              date: '2021-08-08T08:07:01.522Z',
              username: 'dicoding',
              thread: 'thread-abc',
            },
          ],
        },
        {
          id: 'comment-yksuCoxM2s4MMrZJO-qVD',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: '**komentar telah dihapus**',
          replies: [
            {
              id: 'reply-BErOXUSefjwWGW1Z10Ihk',
              content: '**balasan telah dihapus**',
              date: '2021-08-08T07:59:48.766Z',
              username: 'johndoe',
              thread: 'thread-123',
            },
            {
              id: 'reply-xNBtm9HPR-492AeiimpfN',
              content: 'sebuah balasan',
              date: '2021-08-08T08:07:01.522Z',
              username: 'dicoding',
              thread: 'thread-abc',
            },
          ],
        },
      ],
    };
    /** creating dependency for use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentRepliesRepository = new CommentRepliesRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailabilityThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getDetailThread = jest.fn(() => ({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'lorem ipsum dolor sit amet',
      date: '2024-03-17T04:38:49.874Z',
      username: 'dicoding',
    }));
    mockCommentRepository.getDetailCommentThread = jest.fn(() => [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        thread: 'thread-123',
        is_delete: false,
      },
      {
        id: 'comment-yksuCoxM2s4MMrZJO-qVD',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'tolong tunjukkan errornya',
        is_delete: true,
      },
    ]);
    mockCommentRepliesRepository.getDetailReplyComment = jest.fn(() => [
      {
        id: 'reply-BErOXUSefjwWGW1Z10Ihk',
        content: 'sebuah balasan yang akan di hapus',
        date: '2021-08-08T07:59:48.766Z',
        username: 'johndoe',
        thread: 'thread-123',
        is_delete: true,
      },
      {
        id: 'reply-xNBtm9HPR-492AeiimpfN',
        content: 'sebuah balasan',
        date: '2021-08-08T08:07:01.522Z',
        username: 'dicoding',
        thread: 'thread-abc',
        is_delete: false,
      },
    ]);

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentRepliesRepository: mockCommentRepliesRepository,
    });

    const thread = mockThreadRepository.getDetailThread(useCasePayload.thread);
    const detailCommentsThread = mockCommentRepository.getDetailCommentThread(
      useCasePayload.thread
    );
    const commentId = detailCommentsThread.map((item) => item.id);
    const detailRepliesComment = mockCommentRepliesRepository.getDetailReplyComment(commentId[0]);

    // Action
    const detailThread = await getDetailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.thread);
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.getDetailCommentThread).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepliesRepository.getDetailReplyComment).toBeCalledWith(commentId[0]);
    expect(mockCommentRepliesRepository.getDetailReplyComment).toBeCalledWith(commentId[1]);
    expect(thread).toStrictEqual(expectedThread);
    expect(detailRepliesComment).toStrictEqual(expectedReplies);
    expect(detailCommentsThread).toStrictEqual(expectedComments);
    expect(detailThread).toStrictEqual(expectedDetailThread);
  });
});

describe('_groupRepliesWithComments function ', () => {
  it('should group comments with replies correctly', () => {
    // Arrange
    const expectedDetailComments = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: '**komentar telah dihapus**',
        thread: 'thread-123',
        replies: [
          {
            id: 'reply-BErOXUSefjwWGW1Z10Ihk',
            content: 'sebuah komen balasan',
            date: '2021-08-08T07:59:48.766Z',
            username: 'johndoe',
            thread: 'thread-123',
          },
          {
            id: 'reply-xNBtm9HPR-492AeiimpfN',
            content: '**balasan telah dihapus**',
            date: '2021-08-08T08:07:01.522Z',
            username: 'dicoding',
            thread: 'thread-abc',
          },
        ],
      },
    ];

    const getCommentsThread = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        thread: 'thread-123',
        is_delete: true,
      },
    ];
    const getRepliesComments = [
      [
        {
          id: 'reply-BErOXUSefjwWGW1Z10Ihk',
          content: 'sebuah komen balasan',
          date: '2021-08-08T07:59:48.766Z',
          username: 'johndoe',
          thread: 'thread-123',
          is_delete: false,
        },
        {
          id: 'reply-xNBtm9HPR-492AeiimpfN',
          content: 'sebuah balasan',
          date: '2021-08-08T08:07:01.522Z',
          username: 'dicoding',
          thread: 'thread-abc',
          is_delete: true,
        },
      ],
    ];

    /** use case instance */

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: null,
      commentRepository: null,
      commentRepliesRepository: null,
    });

    // Action
    const result = getDetailThreadUseCase._groupRepliesWithComments(
      getCommentsThread,
      getRepliesComments
    );

    // Assert
    expect(result).toStrictEqual(expectedDetailComments);
  });
});
