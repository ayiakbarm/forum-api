/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('comment_with_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.createIndex('comment_with_likes', 'comment_id');
  pgm.addConstraint('comment_with_likes', 'fk_comment_id_comment_with_likes', {
    foreignKeys: {
      columns: 'comment_id',
      references: 'comments(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.createIndex('comment_with_likes', 'user_id');
  pgm.addConstraint('comment_with_likes', 'fk_user_id_comment_with_likes', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('comment_with_likes', 'fk_comment_id_comment_with_likes');
  pgm.dropConstraint('comment_with_likes', 'fk_user_id_comment_with_likes');
  pgm.dropTable('comment_with_likes');
};
