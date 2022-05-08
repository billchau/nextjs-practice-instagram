import {
  BookmarkIcon,
  ChatIcon,
  DotsHorizontalIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon
} from "@heroicons/react/outline";

import {
  HeartIcon as HeartIconSolid
} from "@heroicons/react/solid";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { db } from "../firebase";
import Moment from "react-moment";

function Post({ id, username, userImg, img, caption }) {
  const { data: session } = useSession();
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState([])
  const [hasLike, setHasLike] = useState(false)

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'posts', id, 'comments'), orderBy('timestamp', 'desc')), snapshot => {
      console.log("latest comment snapshot", snapshot.docs)
      setComments(snapshot.docs)
    })
    return () => {
      unsubscribe()
    }
  }, [db, id])

  const sendComment = async (e) => {
    e.preventDefault()

    const commentToSend = comment;
    setComment('')
    await addDoc(collection(db, 'posts', id, 'comments'), {
      comment: commentToSend,
      username: session.user.username,
      userImage: session.user.image,
      timestamp: serverTimestamp()
    })
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'posts', id, 'likes'), snapshot => {
      console.log("latest like snapshot", snapshot.docs)
      setLikes(snapshot.docs)
    })
    return () => {
      unsubscribe()
    }
  }, [db, id])

  const likePost = async () => {
    console.log("likePost trigger", hasLike, session.user.uid)
    if (hasLike) {
      await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid))
    } else {
      await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
        username: session.user.username
      })
    }
  }

  useEffect(() => {
    console.log("likes changes", likes)
    setHasLike(
      likes.findIndex((like) => (like.id === session?.user?.uid)) !== -1
    )
  }, [likes])

  return (
    <div className="bg-white my-7 border rounded-sm">
      {/* header */}
      <div className="flex items-center p-5">
        <img src={userImg} className="h-12 rounded-full object-contain border p-1 mr-3" />
        <p className="flex-1 font-bold">{username}</p>
        <DotsHorizontalIcon className="h-5" />
      </div>

      {/* img */}
      <img src={img} className="object-cover w-full" alt="" />


      {/* buttons */}
      {session && (
        <div className="flex justify-between px-4 pt-4">
          <div className="flex space-x-4">

            {
              hasLike ? (
                <HeartIconSolid className="btn text-red-500" onClick={likePost} />
              ) : (
                <HeartIcon className="btn" onClick={likePost} />
              )
            }

            <ChatIcon className="btn" />
            <PaperAirplaneIcon className="btn" />
          </div>
          <BookmarkIcon className="btn" />
        </div>
      )}

      {/* caption */}
      <p className="p-5 truncate">
        {likes.length > 0 && (
          <p className="font-bold mb-1">{likes.length} likes</p>
        )}
        <span className="font-bold mr-1">{username} </span>
        {caption}
      </p>

      {/* comments */}
      {comments.length > 0 && (
        <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
          {comments.map(commentDisplay => (
            <div key={commentDisplay.id} className="flex items-center space-x-2 mb-3">
              <img className="h-7 rounded-full" src={commentDisplay.data().userImage} alt="" />
              <p className="text-sm flex-1">
                <span className="font-bold">
                  {commentDisplay.data().username}
                </span>{(" ")}
                {commentDisplay.data().comment}
              </p>


              <Moment fromNow className="pr-5 text-xs">
                {commentDisplay.data().timestamp?.toDate()}
              </Moment>
            </div>
          ))}
        </div>
      )}
      {/* input box */}
      {session && (
        <form className="flex items-center p-4">

          <EmojiHappyIcon className="h-7" />
          <input type="text" value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment" className="border-none flex-1 focus:ring-0" />
          <button disabled={!comment.trim()} className="font-semi-bold text-blue-400" type="submit" onClick={sendComment}>Post</button>
        </form>
      )}
    </div>
  )
}

export default Post