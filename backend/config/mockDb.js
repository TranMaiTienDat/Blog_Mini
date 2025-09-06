// Mock Database for testing without MongoDB
let users = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@test.com',
    dateOfBirth: '1990-01-01',
    gender: 'prefer-not-to-say',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password123
  }
]

let posts = [
  {
    _id: '1',
    title: 'Welcome to BlogMini',
    content: 'This is the first post on our blog platform. Feel free to create your own posts!',
    author: { _id: '1', name: 'Admin User', email: 'admin@test.com' },
    authorId: '1',
    createdAt: new Date().toISOString()
  }
]

module.exports = {
  users,
  posts,
  
  // Helper functions
  findUserByEmail: (email) => users.find(user => user.email === email),
  findUserById: (id) => users.find(user => user._id === id),
  createUser: (userData) => {
    const newUser = {
      _id: (users.length + 1).toString(),
      ...userData,
      createdAt: new Date().toISOString()
    }
    users.push(newUser)
    return newUser
  },
  
  getAllPosts: () => posts,
  getPostById: (id) => posts.find(post => post._id === id),
  createPost: (postData) => {
    const newPost = {
      _id: (posts.length + 1).toString(),
      ...postData,
      createdAt: new Date().toISOString()
    }
    posts.push(newPost)
    return newPost
  },
  updatePost: (id, updateData) => {
    const index = posts.findIndex(post => post._id === id)
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updateData }
      return posts[index]
    }
    return null
  },
  deletePost: (id) => {
    const index = posts.findIndex(post => post._id === id)
    if (index !== -1) {
      return posts.splice(index, 1)[0]
    }
    return null
  }
}
