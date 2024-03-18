const AddThreadUseCase = require('../AddThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThread = require('../../../Domains/threads/entities/AddThread');

describe('AddThreadUseCase', () => {
  it('should orchestrating add threads use case correctly', async () => {
    // Arrange
    const useCasePayload = new AddThread({
      title: 'dicoding',
      body: 'Dicoding are awesome',
      owner: 'owner-123',
    });
    const expectedThread = {
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: 'owner-123',
      date: '2024-03-09T13:28:57.124Z',
    };

    /** creating dependency for use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn(() => ({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: 'owner-123',
      date: '2024-03-09T13:28:57.124Z',
    }));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new AddThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
      })
    );
    expect(addedThread).toStrictEqual(expectedThread);
  });
});
