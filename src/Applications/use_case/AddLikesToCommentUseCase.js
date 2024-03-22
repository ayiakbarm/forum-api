const AddLikesToComment = require('../../Domains/comments/entities/AddLikesToComment');

class AddLikesToCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, userId } = useCasePayload;
    await this._threadRepository.checkAvailabilityThread(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);
    const addLikesToComment = new AddLikesToComment(useCasePayload);
    return await this._commentRepository.addLikesToComment(addLikesToComment);
  }
}

module.exports = AddLikesToCommentUseCase;
