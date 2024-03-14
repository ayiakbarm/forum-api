/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('comments', {
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      defaultValue: false,
    },
    thread: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.createIndex('comments', 'thread');
  pgm.addConstraint('comments', 'fk_thread_comments', {
    foreignKeys: {
      columns: 'thread',
      references: 'threads(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('comments', 'fk_thread_comments');
};
