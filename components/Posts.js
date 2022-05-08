import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { db } from "../firebase"
import Post from "./Post"
import { useState, useEffect  } from "react";

function Posts() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        //listener
      const unsubscribe = onSnapshot(query(collection(db, 'posts'), orderBy("timestamp", 'desc')), snapshot => {
          setPosts(snapshot.docs)
      })

      return () => {
          // remove once added
        unsubscribe();
      }
    }, [db])
    
    console.log(posts)
    return (
        <div>
            {posts.map(post => (
                <Post
                    key={post.id}
                    id={post.id}
                    username={post.data().username}
                    userImg={post.data().profileImg}
                    img={post.data().image}
                    caption={post.data().caption}
                />
            ))}
        </div>
    )
}

export default Posts