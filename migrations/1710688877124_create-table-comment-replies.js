/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('comment_replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    thread: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'TIMESTAMPTZ',
    },
  });

  pgm.createIndex('comment_replies', 'owner');
  pgm.addConstraint('comment_replies', 'fk_owner_comment_replies', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.createIndex('comment_replies', 'comment');
  pgm.addConstraint('comment_replies', 'fk_comment_comment_replies', {
    foreignKeys: {
      columns: 'comment',
      references: 'comments(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.createIndex('comment_replies', 'thread');
  pgm.addConstraint('comment_replies', 'fk_thread_comment_replies', {
    foreignKeys: {
      columns: 'thread',
      references: 'threads(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('comment_replies', 'fk_owner_comment_replies');
  pgm.dropConstraint('comment_replies', 'fk_comment_comment_replies');
  pgm.dropConstraint('comment_replies', 'fk_thread_comment_replies');
  pgm.dropTable('comment_replies');
};
