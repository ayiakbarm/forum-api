const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('GetDetailThreadUseCase', () => {
  it('should throw an error when payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};
    /** creating dependency for use case */
    const mockThreadRepository = new ThreadRepository();

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
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

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
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

    /** creating dependency for use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailabilityThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getDetailThread = jest.fn().mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    await getDetailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.thread);
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(useCasePayload.thread);
  });
});
