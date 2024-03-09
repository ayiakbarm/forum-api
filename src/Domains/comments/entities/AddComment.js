class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);
  }

  _verifyPayload({ content }) {
    if (!content) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

module.exports = AddComment;
