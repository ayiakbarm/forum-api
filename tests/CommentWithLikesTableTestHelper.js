/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentWithLikesTableTestHelper = {
  async addCommentLikes({
    id = 'comment-likes-123',
    userId = 'user-123',
    commentId = 'comment-123',
  }) {
    const query = {
      text: 'INSERT INTO comment_with_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, commentId],
    };

    await pool.query(query);
  },

  async findCommentWithLikesById(id) {
    const query = {
      text: 'SELECT * FROM comment_with_likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_with_likes WHERE 1=1');
  },
};

module.exports = CommentWithLikesTableTestHelper;
