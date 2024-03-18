class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, commentRepliesRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentRepliesRepository = commentRepliesRepository;
  }

  async execute(useCasePayload) {
    const { thread, comment, owner, reply } = useCasePayload;
    await this._threadRepository.checkAvailabilityThread(thread);
    await this._commentRepository.checkAvailabilityComment(comment);
    await this._commentRepliesRepository.checkAvailabilityReply(reply);
    await this._commentRepliesRepository.verifyReplyOwner(reply, owner);
    await this._commentRepliesRepository.deleteReply(reply);
  }
}

module.exports = DeleteReplyUseCase;
