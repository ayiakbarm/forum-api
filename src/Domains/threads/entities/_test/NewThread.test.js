const NewThread = require('../NewThread');

describe('NewThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'dicoding judul',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: true,
      body: 123,
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should throw error when title payload contains more 100 characters', () => {
    // Arrange
    const payload = {
      title:
        'DicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesomeDicodingAreAwesome',
      body: 'Dicoding Indonesia',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.TITLE_LIMIT_CHARACTERS');
  });

  it('should create newThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'Dicoding The Best',
      body: 'Dicoding Awesome as always',
    };

    // Action
    const { title, body } = new NewThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
