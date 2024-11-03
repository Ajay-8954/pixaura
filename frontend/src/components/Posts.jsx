import React from 'react';
import Post from './Post';
import { useSelector } from 'react-redux';

const Posts = () => {
  // Getting posts from the store
  const { posts } = useSelector(store => store.post);

  return (
    <div className='mr-10'>
      {
        posts && posts.length > 0 ? (
          posts.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <p>No posts available</p> // Handling case if there are no posts
        )
      }
    </div>
  );
}

export default Posts;
