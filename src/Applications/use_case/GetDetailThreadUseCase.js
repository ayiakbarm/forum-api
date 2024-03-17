class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository, commentRepliesRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentRepliesRepository = commentRepliesRepository;
  }

  async execute(useCasePayload) {
    const { thread } = useCasePayload;
    this._validatePayload(useCasePayload);
    await this._threadRepository.checkAvailabilityThread(thread);
    const detailThread = await this._threadRepository.getDetailThread(thread);
    const getCommentsThread = await this._commentRepository.getDetailCommentThread(thread);
    const getRepliesComments = await Promise.all(
      getCommentsThread.map(async (comment) => {
        const tempReplyComments = await this._commentRepliesRepository.getDetailReplyComment(
          comment.id
        );
        return tempReplyComments;
      })
    );

    const updatedCommentsThread = this._groupRepliesWithComments(
      getCommentsThread,
      getRepliesComments
    );

    detailThread.comments = updatedCommentsThread;
    return detailThread;
  }

  _validatePayload({ thread }) {
    if (!thread) throw new Error('GET_DETAIL_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');

    if (typeof thread !== 'string')
      throw new Error('GET_DETAIL_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }

  _groupRepliesWithComments(getCommentsThread, getRepliesComments) {
    const commentsWithReplies = {};
    getCommentsThread.forEach((comment, index) => {
      if (!commentsWithReplies[comment.id]) {
        commentsWithReplies[comment.id] = { ...comment, replies: getRepliesComments[index] || [] };
      }
    });

    const updatedCommentsThread = Object.values(commentsWithReplies);
    return updatedCommentsThread;
  }
}

module.exports = GetDetailThreadUseCase;
