class DetailReply {
  constructor(payload) {
    this._validatePayload(payload);
    const replies = this._remappingPayload(payload);
    this.replies = replies;
  }

  _validatePayload({ replies }) {
    if (!replies) throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    if (!Array.isArray(replies)) throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }

  _remappingPayload({ replies }) {
    return replies.map((item) => {
      // eslint-disable-next-line no-unused-vars
      const { is_delete, ...rest } = item;
      return {
        ...rest,
        id: item.id,
        content: item.is_delete ? '**balasan telah dihapus**' : item.content,
        date: item.date,
        username: item.username,
      };
    });
  }
}

module.exports = DetailReply;
