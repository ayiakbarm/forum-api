const CommentRepliesRepository = require('../CommentRepliesRepository');

describe('CommentRepliesRepository interface', () => {
  it('should throw error when invoke abstract class', async () => {
    const commentRepliesRepository = new CommentRepliesRepository();

    await expect(commentRepliesRepository.addReply({})).rejects.toThrowError(
      'COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
  });
});
