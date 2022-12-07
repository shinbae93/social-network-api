const chai = require("chai");
const chaiHttp = require("chai-http");
const chaiAsPromise = require("chai-as-promised");
const lodash = require('lodash')
require('../models/database/mongoose');
const { UserManager } = require('../services/UserManager');
const { User } = require('../models/_User');
const { PostManager } = require('../services/PostManager');
const { Post } = require('../models/_Post');
const { CommentManager } = require('../services/CommentManager');
const { LikeManager } = require('../services/LikeManager');
const { ShareManager } = require('../services/ShareManager');
const { dataSample } = require('./Data');
const { describe, it } = require('mocha');
// Assertion style
chai.should();

chai.use(chaiHttp);
chai.use(chaiAsPromise);

const assert = chai.assert;

const userManager = new UserManager();
const postManager = new PostManager();
const commentManager = new CommentManager();
const likeManager = new LikeManager();
const shareManager = new ShareManager();
//
describe('UserManager', function () {
  describe('function findUsers()', function () {
    it('[FUS-001] Find all users', async () => {
      // import 5 users
      await importUser();
      //
      const users = await userManager.findUsers();
      //
      assert.equal(users.count, 5);
    });
    //
    it('[FUS-002] Find users by name', async () => {
      // import 5 users
      await importUser();
      //
      const QUERY = {
        name: "Tran"
      }
      const users = await userManager.findUsers(QUERY);
      //
      assert.equal(users.count, 1);
      assert.equal(users.rows[0].name, "Tran Tan A");
    });
  });
  //
  describe('function getUser()', function () {
    it('[GUS-001] Get a user with defined id', async () => {
      // import 5 users
      await importUser();
      //
      const USER_ID = "638f3e18a812d5ddd888af29";
      let user = await userManager.getUser(USER_ID);
      user = lodash.pick(user.toJSON(), ["name", "email"]); 
      //
      const EXPECTED = {
        email: "a@gmail.com",
        name: "Tran Tan A"
      }
      assert.deepEqual(user, EXPECTED);
    });
    //
    it('[GUS-002] Get a user with undefined id, will throw error', async () => {
      // import 5 users
      await importUser();
      //
      const USER_ID = "638f3e18a812d5ddd888af28";
      //
      await assert.isRejected(userManager.getUser(USER_ID), "Not found user with id [638f3e18a812d5ddd888af28]!");
    });
  });
  //
  describe('function createUser()', function () {
    it('[CUS-001] Create a user with available data will ok', async () => {
      // import 5 users
      await importUser();
      //
      const USER_OBJ = {
        "name": "Le Minh Tri",
        "email": "tri@gmail.com",
        "password": "123456"
      };
      let { user } = await userManager.createUser(USER_OBJ);
      user = lodash.pick(user.toJSON(), ["name", "email"]); 
      //
      const EXPECTED = {
        email: "tri@gmail.com",
        name: "Le Minh Tri"
      }
      assert.deepEqual(user, EXPECTED);
    });
    //
    it('[CUS-002] Create a user with missing field will throw error', async () => {
      // import 5 users
      await importUser();
      //
      const USER_OBJ = {
        "name": "Le Minh Tri",
        "password": "123456"
      };
      await assert.isRejected(userManager.createUser(USER_OBJ), "User validation failed: email: Path `email` is required");
    });
    //
    it('[CUS-003] Create a user with duplicated field [email] will throw error', async () => {
      // import 5 users
      await importUser();
      //
      const USER_OBJ = {
        "name": "Le Minh Tri",
        "email": "a@gmail.com",
        "password": "123456"
      };
      await assert.isRejected(userManager.createUser(USER_OBJ), "E11000 duplicate key error collection: social-network-test.users index: email_1 dup key: { email: \"a@gmail.com\" }");
    });
  });
  //
  describe('function updateUser()', function () {
    it('[UUS-001] Update a user with undefined [id] will throw error', async () => {
      // import 5 users
      await importUser();
      //
      const USER_OBJ = {
        "name": "Le Minh Tri"
      };
      const USER_ID = "638f3e18a812d5ddd888af28";
      await assert.isRejected(userManager.updateUser(USER_ID, USER_OBJ), "Not found user with id [638f3e18a812d5ddd888af28]!");
    });
    //
    it('[UUS-002] Update a user with defined [id] will oke', async () => {
      // import 5 users
      await importUser();
      //
      const USER_OBJ = {
        "name": "Le Minh Tri"
      };
      const USER_ID = "638f3e18a812d5ddd888af29";
      //
      const oldUser = await userManager.getUser(USER_ID);
      assert.deepEqual(oldUser.name, "Tran Tan A");
      //
      await userManager.updateUser(USER_ID, USER_OBJ);
      //
      const newUser = await userManager.getUser(USER_ID);
      assert.deepEqual(newUser.name, "Le Minh Tri");
    });
    //
    it('[UUS-003] Update a user with duplicated [email] will throw error', async () => {
      // import 5 users
      await importUser();
      //
      const USER_OBJ = {
        "name": "Le Minh Tri",
        "email": "b@gmail.com",
      };
      const USER_ID = "638f3e18a812d5ddd888af29";
      await assert.isRejected(userManager.updateUser(USER_ID, USER_OBJ), "E11000 duplicate key error collection: social-network-test.users index: email_1 dup key: { email: \"b@gmail.com\" }");
    });
  });
  //
  describe('function deleteUser()', function () {
    it('[DUS-001] Delete a user with defined id', async () => {
      // import 5 users
      await importUser();
      //
      const USER_ID = "638f3e18a812d5ddd888af29";
      //
      let users = await userManager.findUsers();
      assert.deepEqual(users.count, 5);
      //
      await userManager.deleteUser(USER_ID);
      //
      users = await userManager.findUsers();
      assert.deepEqual(users.count, 4);
    });
    //
    it('[DUS-002] Delete a user with undefined id, will throw error', async () => {
      // import 5 users
      await importUser();
      //
      const USER_ID = "638f3e18a812d5ddd888af28";
      //
      await assert.isRejected(userManager.deleteUser(USER_ID), "Not found user with id [638f3e18a812d5ddd888af28]!");
    });
  });
});
//
describe('PostManager', function () {
  describe('function findPosts()', function () {
    it('[FPS-001] Get all posts', async function () {
      await importUser();
      await importPost();
      //
      const posts = await postManager.findPosts();
      //
      assert.deepEqual(posts.count, 5);
    });
    //
    it('[FPS-002] Get all posts of a user', async function () {
      await importUser();
      await importPost();
      //
      const QUERY = {
        userId: "638f3e19a812d5ddd888af2d"
      };
      const posts = await postManager.findPosts(QUERY);
      //
      assert.deepEqual(posts.count, 1);
    });
  });
  //
  describe('function getPost()', function () {
    it('[GPS-001] Get a post with undefined [id], will throw error', async function () {
      await importUser();
      await importPost();
      //
      const POST_ID = "638f677c73b49a317f37b569";
      await assert.isRejected(postManager.getPost(POST_ID), "Not found post with id [638f677c73b49a317f37b569]!");
    });
    //
    it('[GPS-002] Get a post with defined [id], will ok', async function () {
      await importUser();
      await importPost();
      //
      const POST_ID = "638f677c73b49a317f37b568";
      let post = await postManager.getPost(POST_ID);
      post = lodash.pick(post, ["content", "totalLikes", "totalComments", "totalShares"]);
      //
      const EXPECTED = {
        "content": "Welcome to Instagram",
        "totalComments": 0,
        "totalLikes": 0,
        "totalShares": 0,
      }
      //
      assert.deepEqual(post, EXPECTED);
    });
  });
  //
  describe('function createPosts()', function () {
    it('[CPS-001] Create a post', async function () {
      await importUser();
      await importPost();
      //
      const POST_OBJ = {
        "content": "Welcome to Happy hotpot",
        "userId": "638f3e19a812d5ddd888af2d"
      }
      let { post } = await postManager.createPost(POST_OBJ);
      post = lodash.pick(post.toJSON(), ["content", "totalLikes", "totalComments", "totalShares"]);
      //
      const EXPECTED = {
        "content": "Welcome to Happy hotpot",
        "totalLikes": 0,
        "totalComments": 0,
        "totalShares": 0
      }
      //
      assert.deepEqual(post, EXPECTED);
    });
  });
  //
  describe('function updatePost()', function () {
    it('[UPS-001] Update a post with undefined [id], will throw error', async function () {
      await importUser();
      await importPost();
      //
      const POST_ID = "638f677c73b49a317f37b569";
      await assert.isRejected(postManager.updatePost(POST_ID, { content: "Modified"}), "Not found post with id [638f677c73b49a317f37b569]!");
    });
    //
    it('[UPS-002] Update a post with defined [id], will ok', async function () {
      await importUser();
      await importPost();
      //
      const POST_ID = "638f677c73b49a317f37b568";
      //
      await postManager.updatePost(POST_ID, { content: "Modified"});
      //
      let post = await postManager.getPost(POST_ID);
      post = lodash.pick(post, ["content", "totalLikes", "totalComments", "totalShares"]);
      //
      const EXPECTED = {
        "content": "Modified",
        "totalComments": 0,
        "totalLikes": 0,
        "totalShares": 0,
      }
      //
      assert.deepEqual(post, EXPECTED);
    });
  });
  //
  describe('function createLike()', function () {
    it('[CLK-001] Create a Like, Post\'s [totalLikes] increase 1', async function () {
      await importUser();
      await importPost();
      //
      const POST_ID = "638f677c73b49a317f37b568";
      let post = await postManager.getPost(POST_ID);
      //
      assert.deepEqual(post.totalLikes, 0);
      //
      const LIKE_OBJ = {
        "postId": "638f677c73b49a317f37b568",
        "userId": "638f3e19a812d5ddd888af31"
      }
      //
      await likeManager.createLike(LIKE_OBJ);
      //
      post = await postManager.getPost(POST_ID);
      //
      assert.deepEqual(post.totalLikes, 1);
    });
  });
  //
  describe('function deleteLike()', function () {
    it('[DLK-001] Delete a Like, Post\'s [totalLikes] decrease 1', async function () {
      await importUser();
      await importPost();
      //
      const POST_ID = "638f677c73b49a317f37b568";
      let post = await postManager.getPost(POST_ID);
      //
      assert.deepEqual(post.totalLikes, 0);
      //
      const LIKE_OBJ = {
        "postId": "638f677c73b49a317f37b568",
        "userId": "638f3e19a812d5ddd888af31"
      }
      //
      const like = await likeManager.createLike(LIKE_OBJ);
      //
      post = await postManager.getPost(POST_ID);
      //
      assert.deepEqual(post.totalLikes, 1);
      //
      await likeManager.deleteLike(like._id);
      //
      post = await postManager.getPost(POST_ID);
      //
      assert.deepEqual(post.totalLikes, 0);
    });
  });
  //
  describe('function createComment()', function () {
    it('[CCM-001] Create a Comment, Post\'s [totalComments] increase 1', async function () {
      await importUser();
      await importPost();
      //
      const POST_ID = "638f677c73b49a317f37b568";
      let post = await postManager.getPost(POST_ID);
      //
      assert.deepEqual(post.totalComments, 0);
      //
      const CMT_OBJ = {
        "content": "Comment 1",
        "postId": "638f677c73b49a317f37b568",
        "userId": "638f3e19a812d5ddd888af31"
      }
      //
      await commentManager.createComment(CMT_OBJ);
      //
      post = await postManager.getPost(POST_ID);
      //
      assert.deepEqual(post.totalComments, 1);
    });
  });
  //
  describe('function deleteComment()', function () {
    it('[DCM-001] Delete a Comment, Post\'s [totalComments] decrease 1', async function () {
      await importUser();
      await importPost();
      //
      const POST_ID = "638f677c73b49a317f37b568";
      let post = await postManager.getPost(POST_ID);
      //
      assert.deepEqual(post.totalComments, 0);
      //
      const CMT_OBJ = {
        "content": "Comment 1",
        "postId": "638f677c73b49a317f37b568",
        "userId": "638f3e19a812d5ddd888af31"
      }
      //
      const comment = await commentManager.createComment(CMT_OBJ);
      //
      post = await postManager.getPost(POST_ID);
      //
      assert.deepEqual(post.totalComments, 1);
      //
      await commentManager.deleteComment(comment._id);
      //
      post = await postManager.getPost(POST_ID);
      //
      assert.deepEqual(post.totalComments, 0);
    });
  });
  //
  describe('function createShare()', function () {
    it('[CSH-001] Create a Share, Post\'s [totalShares] increase 1', async function () {
      await importUser();
      await importPost();
      //
      const POST_ID = "638f677c73b49a317f37b568";
      let post = await postManager.getPost(POST_ID);
      //
      assert.deepEqual(post.totalShares, 0);
      //
      const SHARE_OBJ = {
        "postId": "638f677c73b49a317f37b568",
        "userId": "638f3e19a812d5ddd888af31"
      }
      //
      await shareManager.createShare(SHARE_OBJ);
      //
      post = await postManager.getPost(POST_ID);
      //
      assert.deepEqual(post.totalShares, 1);
    });
  });
  //
  describe('function deleteShare()', function () {
    it('[DSH-001] Delete a Share, Post\'s [totalShares] decrease 1', async function () {
      await importUser();
      await importPost();
      //
      const POST_ID = "638f677c73b49a317f37b568";
      let post = await postManager.getPost(POST_ID);
      //
      assert.deepEqual(post.totalShares, 0);
      //
      const SHARE_OBJ = {
        "postId": "638f677c73b49a317f37b568",
        "userId": "638f3e19a812d5ddd888af31"
      }
      //
      const share = await shareManager.createShare(SHARE_OBJ);
      //
      post = await postManager.getPost(POST_ID);
      //
      assert.deepEqual(post.totalShares, 1);
      //
      await shareManager.deleteShare(share._id);
      //
      post = await postManager.getPost(POST_ID);
      //
      assert.deepEqual(post.totalShares, 0);
    });
  });
});

const importUser = async function() {
  await User.deleteMany();
  try {
    for (const userObj of dataSample.users) {
      await User.create(userObj);
    }
  } catch (error) {
    console.log(error);
  }
};

const importPost = async function() {
  await Post.deleteMany();
  try {
    for (const postObj of dataSample.posts) {
      await Post.create(postObj);
    }
  } catch (error) {
    console.log(error);
  }
};
