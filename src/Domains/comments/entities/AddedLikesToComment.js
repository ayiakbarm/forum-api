class AddedLikesToComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, userId, commentId } = payload;

    this.id = id;
    this.userId = userId;
    this.commentId = commentId;
  }

  _verifyPayload({ id, userId, commentId }) {
    if (!id || !userId || !commentId)
      throw new Error('ADDED_LIKES_TO_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');

    if (typeof id !== 'string' || typeof userId !== 'string' || typeof commentId !== 'string')
      throw new Error('ADDED_LIKES_TO_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

module.exports = AddedLikesToComment;
