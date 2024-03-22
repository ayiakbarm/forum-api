/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn('comment_replies', {
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      defaultValue: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('comment_replies', 'is_delete');
};
