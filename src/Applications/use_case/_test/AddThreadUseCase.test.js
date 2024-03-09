const AddThreadUseCase = require('../AddThreadUseCase');
const Thread = require('../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddThreadUseCase', () => {
  it('should orchestrating add threads use case correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'dicoding',
      body: 'Dicoding are awesome',
      owner: 'owner-123',
    };
    const mockThread = new Thread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: 'owner-123',
      date: '2024-03-09T13:28:57.124Z',
    });

    /** creating dependency for use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.addThread).toBeCalledWith(useCasePayload);
    expect(addedThread).toStrictEqual(
      new Thread({
        id: 'thread-123',
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: 'owner-123',
        date: '2024-03-09T13:28:57.124Z',
      })
    );
  });
});
