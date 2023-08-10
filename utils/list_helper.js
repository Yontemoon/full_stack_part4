const dummy = (string) => {
    return 1;
}

const likes = (listOfArray) => {
    let sum = 0;
    listOfArray.forEach(element => {
        sum += element.likes;
    });
    return sum;
}

const favoriteBlog = (listOfArrays) => {
    if (listOfArrays.length === 0) {
        return 0
    }

    let favorite = listOfArrays[0]
    listOfArrays.forEach(blog => {
        if (blog.likes > favorite.likes) {
            favorite = blog
        }
    })
    return favorite.title
}

const mostBlogs = (listOfBlogs) => {
    //REVIEW THIS!!
    let authorCounts = listOfBlogs.reduce((authorCount, blog) => {
        authorCount[blog.author] = (authorCount[blog.author] || 0) + 1
        return authorCount
    }, {})
    let maxCount = Math.max(...Object.values(authorCounts)) // 3
    const filterAuthor = Object.keys(authorCounts).filter((author => authorCounts[author] === maxCount))
    return {
        author: filterAuthor[0],
        blogs: maxCount
    }
}

const mostLikes = (listOfBlogs) => {
    let mostLikesNum = 0;
    let mostLikedBlog = {};

    listOfBlogs.forEach(blog => {
        if (blog.likes > mostLikesNum) {
            mostLikesNum = blog.likes
            mostLikedBlog = blog
        }
    })

    return {
        author: mostLikedBlog.author,
        likes: mostLikedBlog.likes
    }
}



module.exports = {dummy, likes, favoriteBlog, mostBlogs, mostLikes };