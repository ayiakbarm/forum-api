class AddLikesToCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, userId } = useCasePayload;
    await this._threadRepository.checkAvailabilityThread(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);
    const isLiked = await this._commentRepository.checkWhetherCommentIsLikedOrNot(
      userId,
      commentId
    );
    if (isLiked) {
      return await this._commentRepository.removeLikesFromComment(userId, commentId);
    } else {
      return await this._commentRepository.addLikesToComment(userId, commentId);
    }
  }
}

module.exports = AddLikesToCommentUseCase;
