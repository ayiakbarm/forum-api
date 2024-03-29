const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postRepliesHandler = this.postRepliesHandler.bind(this);
    this.deleteRepliesHandler = this.deleteRepliesHandler.bind(this);
  }

  async postRepliesHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const useCasePayload = {
      content: request.payload.content,
      comment: commentId,
      thread: threadId,
      owner,
    };

    const addedReply = await addReplyUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteRepliesHandler(request, h) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;

    const useCasePayload = {
      thread: threadId,
      comment: commentId,
      reply: replyId,
      owner,
    };

    await deleteReplyUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
