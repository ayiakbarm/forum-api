class AddReply {
  constructor(payload) {
    this._validatePayload(payload);
    const { content, owner, comment, thread } = payload;

    this.content = content;
    this.owner = owner;
    this.comment = comment;
    this.thread = thread;
  }

  _validatePayload({ content, owner, comment, thread }) {
    if (!content || !owner || !comment || !thread)
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');

    if (
      typeof content !== 'string' ||
      typeof owner !== 'string' ||
      typeof comment !== 'string' ||
      typeof thread !== 'string'
    ) {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
