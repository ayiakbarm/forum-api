const DetailComment = require('../../Domains/comments/entities/DetailComment');

class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { thread } = useCasePayload;
    this._validatePayload(useCasePayload);
    await this._threadRepository.checkAvailabilityThread(thread);
    const detailThread = await this._threadRepository.getDetailThread(thread);
    const getCommentsThread = await this._commentRepository.getDetailCommentThread(thread);
    detailThread.comments = new DetailComment({ comments: getCommentsThread }).comments;
    return {
      thread: detailThread,
    };
  }

  _validatePayload({ thread }) {
    if (!thread) throw new Error('GET_DETAIL_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');

    if (typeof thread !== 'string')
      throw new Error('GET_DETAIL_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

module.exports = GetDetailThreadUseCase;
