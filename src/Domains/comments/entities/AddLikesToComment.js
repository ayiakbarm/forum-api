class AddLikesToComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { threadId, commentId, userId } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
    this.userId = userId;
  }

  _verifyPayload({ threadId, commentId, userId }) {
    if (!threadId || !commentId || !userId)
      throw new Error('ADD_LIKES_TO_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');

    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof userId !== 'string')
      throw new Error('ADD_LIKE_TO_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

module.exports = AddLikesToComment;
