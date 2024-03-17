class GetDetailThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { thread } = useCasePayload;
    this._validatePayload(useCasePayload);
    this._threadRepository.checkAvailabilityThread(thread);
    this._threadRepository.getDetailThread(thread);
  }

  _validatePayload({ thread }) {
    if (!thread) throw new Error('GET_DETAIL_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');

    if (typeof thread !== 'string')
      throw new Error('GET_DETAIL_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

module.exports = GetDetailThreadUseCase;
