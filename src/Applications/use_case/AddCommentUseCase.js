const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { thread } = useCasePayload;
    this._validatePayload(useCasePayload);
    await this._threadRepository.checkAvailabilityThread(thread);
    const newComment = new AddComment(useCasePayload);
    return this._commentRepository.addComment(newComment);
  }

  _validatePayload({ thread, owner, content }) {
    if (!thread || !owner || !content)
      throw new Error('ADD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');

    if (typeof thread !== 'string' || typeof owner !== 'string' || typeof content !== 'string')
      throw new Error('ADD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

module.exports = AddCommentUseCase;
