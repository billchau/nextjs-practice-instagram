import { useEffect, useState } from 'react';
import { faker } from "@faker-js/faker";
import Story from './Story';
import { useSession } from "next-auth/react";

function Stories() {
  const [suggestions, setSuggestions] = useState([])
  const { data: session } = useSession();
  useEffect(() => {
    const suggestions = [...Array(20)].map((_, i) => ({
      name: faker.fake('{{name.lastName}}, {{name.firstName}} {{name.suffix}}'),
      avatar: faker.image.avatar(),
      id: i
    }))
    setSuggestions(suggestions)
  }, [])

  return (
    <div className='flex space-x-2 p-6 bg-white mt-8 border-gray-200 rounded-sm overflow-x-scroll scrollbar-thin scrollbar-thumb-black'>
      {session && (
          <Story key={session.uid} avatar={session.user.image} username={session.user.username} />
      )}

      {suggestions.map(profile => (
        <Story key={profile.id} avatar={profile.avatar} username={profile.name} />
      ))}
    </div>
  )
}

export default Stories