const Post = require('../../src/models/Post');

// Example helper function
function bugExists(id) {
  return Post.findById(id).then(bug => !!bug);
}

describe('bugExists', () => {
  it('returns true if bug exists', async () => {
    jest.spyOn(Post, 'findById').mockResolvedValue({ _id: '1', title: 'Bug' });
    const result = await bugExists('1');
    expect(result).toBe(true);
    Post.findById.mockRestore();
  });
  it('returns false if bug does not exist', async () => {
    jest.spyOn(Post, 'findById').mockResolvedValue(null);
    const result = await bugExists('2');
    expect(result).toBe(false);
    Post.findById.mockRestore();
  });
}); 