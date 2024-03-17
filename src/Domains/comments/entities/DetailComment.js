class DetailComment {
  constructor(payload) {
    this._validatePayload(payload);
    const comments = this._remappingPayload(payload);
    this.comments = comments;
  }

  _validatePayload({ comments }) {
    if (!comments) throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    if (!Array.isArray(comments))
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }

  _remappingPayload({ comments }) {
    return comments.map((item) => {
      return {
        id: item.id,
        username: item.username,
        date: item.date,
        content: item.is_delete ? '**komentar telah dihapus**' : item.content,
      };
    });
  }
}

module.exports = DetailComment;
