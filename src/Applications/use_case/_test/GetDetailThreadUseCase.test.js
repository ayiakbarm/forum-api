const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('GetDetailThreadUseCase', () => {
  it('should throw an error when payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};
    /** creating dependency for use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
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

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
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
      },
      {
        id: 'comment-yksuCoxM2s4MMrZJO-qVD',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: '**komentar telah dihapus**',
      },
    ];

    /** creating dependency for use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailabilityThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getDetailThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getDetailCommentThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedComments));

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await getDetailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.thread);
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.getDetailCommentThread).toBeCalledWith(useCasePayload.thread);
  });
});
