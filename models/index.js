const Users = require('./Users');
const Posts = require('./Posts');
const Comments = require('./comments');

Users.hasMany(Posts, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

Posts.belongsTo(Users, {
    foreignKey: 'userId'
});

Posts.hasMany(Comments, {
    foreignKey: 'postId',
    onDelete: 'CASCADE'
});

Comments.belongsTo(Users, {
    foreignKey: 'userId'
});

Comments.belongsTo(Posts, {
    foreignKey: 'postId'
});

Users.hasMany(Comments, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

module.exports = { Users, Posts, Comments };