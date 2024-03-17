const AddReply = require('../../Domains/comment_replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, commentRepliesRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentRepliesRepository = commentRepliesRepository;
  }

  async execute(useCasePayload) {
    const { comment, thread } = useCasePayload;
    await this._threadRepository.checkAvailabilityThread(thread);
    await this._commentRepository.checkAvailabilityComment(comment);
    const newReply = new AddReply(useCasePayload);
    return await this._commentRepliesRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
