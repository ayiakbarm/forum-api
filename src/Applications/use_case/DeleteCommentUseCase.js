class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { thread, owner, commentId } = useCasePayload;
    this._validatePayload({ thread, owner, commentId });
    await this._threadRepository.checkAvailabilityThread(thread);
    await this._commentRepository.checkAvailabilityComment(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, owner);
    await this._commentRepository.deleteComment(commentId);
  }

  _validatePayload({ thread, owner, commentId }) {
    if (!thread || !owner || !commentId)
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');

    if (typeof thread !== 'string' || typeof owner !== 'string' || typeof commentId !== 'string')
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

module.exports = DeleteCommentUseCase;
