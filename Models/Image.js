const mongoose = require("mongoose");

class Image {
	constructor(FileName, Title, Comments, Likes, DatePosted, Tags, PostedBy) {
		this.FileName = FileName;
		this.Title = Title;
		this.Comments = Comments;
		this.Likes = Likes;
		this.DatePosted = DatePosted;
		this.Tags = Tags;
		this.PostedBy = PostedBy;
	}
}

module.exports = Image;