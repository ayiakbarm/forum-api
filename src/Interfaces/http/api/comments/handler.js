const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const AddLikesToCommentUseCase = require('../../../../Applications/use_case/AddLikesToCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentsHandler = this.postCommentsHandler.bind(this);
    this.deleteCommentsHandler = this.deleteCommentsHandler.bind(this);
    this.putCommentsLikesHandler = this.putCommentsLikesHandler.bind(this);
  }

  async postCommentsHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;

    const useCasePayload = {
      content: request.payload.content,
      owner,
      thread: threadId,
    };
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentsHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const useCasePayload = {
      thread: threadId,
      owner,
      commentId,
    };

    await deleteCommentUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async putCommentsLikesHandler(request, h) {
    const addLikesToCommentUseCase = this._container.getInstance(AddLikesToCommentUseCase.name);
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const useCasePayload = {
      threadId,
      commentId,
      userId,
    };

    await addLikesToCommentUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
