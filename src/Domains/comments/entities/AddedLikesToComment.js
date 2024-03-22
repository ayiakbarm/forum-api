class AddedLikesToComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, user_id, comment_id } = payload;

    this.id = id;
    this.user_id = user_id;
    this.comment_id = comment_id;
  }

  _verifyPayload({ id, user_id, comment_id }) {
    if (!id || !user_id || !comment_id)
      throw new Error('ADDED_LIKES_TO_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');

    if (typeof id !== 'string' || typeof user_id !== 'string' || typeof comment_id !== 'string')
      throw new Error('ADDED_LIKES_TO_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

module.exports = AddedLikesToComment;
