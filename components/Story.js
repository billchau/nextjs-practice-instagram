function Story({avatar, username}) {
  return (
    <div>
      <img className="h-14 w-14 rounded-full p-[2px] border-red-500 border-2 object-contain cursor-pointer hover:scale-110 transition transform duration-200 ease-out" src={avatar} alt=""/>
      <p className="text-xs w-14 truncate text-center">{username}</p>
    </div>
  )
}

export default Story