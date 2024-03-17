class AddReply {
  constructor(payload) {
    this._validatePayload(payload);
    const { content, owner, comment } = payload;

    this.content = content;
    this.owner = owner;
    this.comment = comment;
  }

  _validatePayload({ content, owner, comment }) {
    if (!content || !owner || !comment) throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');

    if (typeof content !== 'string' || typeof owner !== 'string' || typeof comment !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
