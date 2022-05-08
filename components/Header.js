import Image from "next/image"
import {
  SearchIcon,
  PlusCircleIcon,
  UserGroupIcon,
  PaperAirplaneIcon,
  MenuIcon,
  HomeIcon,
  HeartIcon
} from "@heroicons/react/outline";
import { useSession, signOut, signIn } from "next-auth/react";
import { useRecoilState } from 'recoil'
import { useRouter } from "next/router";
import { modalState } from "../atoms/modalAtom";

function Header() {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState)
  const router = useRouter()
  return (
    <div className="shadow-sm border-b sticky top-0 z-50 bg-white">
      <div className="flex justify-between  max-w-6xl px-5 lg:mx-auto">
        {/* left - icon*/}
        <div className="relative hidden lg:inline-grid w-24 cursor-pointer" onClick={() => router.push("/")}>
          <Image src="/assets/instagram-text-icon.png"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="relative lg:hidden w-10  flex-shrink-0 cursor-pointer" onClick={() => router.push("/")}>
          <Image src="/assets/instagram-logo.png"
            layout="fill"
            objectFit="contain"
          />
        </div>
        {/* middle - search and input */}
        <div className="mt-1 relative p-3 rounded-md">
          <div className="absolute inset-y-0 pl-3 flex items-center">
            <SearchIcon className="h-5 w-5 text-gray-500" />
          </div>
          <input className="bg-gray-50 block w-full pl-10 sm:text-sm border-gray-300 focus:ring-black focus:border-black rounded-md" type="text" placeholder="Search" />
        </div>
        {/* right - */}
        <div className="flex items-center justify-end space-x-4">
          <HomeIcon className="navBtn" onClick={() => router.push("/")} />
          <MenuIcon className="h-6 md:hidden cursor-pointer" />

          {session ? (
            <>
              <div className="relative navBtn">
                <div className="absolute -top-2 -right-1 text-xs w-5 h-5 bg-red-300 rounded-full flex items-center justify-center animate-pulse text-white">3</div>
                <PaperAirplaneIcon className="navBtn rotate-45" />
              </div>
              <PlusCircleIcon onClick={() => setOpen(true)} className="navBtn" />
              <UserGroupIcon className="navBtn" />
              <HeartIcon className="navBtn" />

              <img src={session?.user?.image} onClick={signOut} className="w-10 h-10 rounded-full cursor-pointer" alt="profile pic" />
            </>
          ) :
            <button onClick={signIn}>Sign In</button>
          }

        </div>
      </div>
    </div>
  )
}

export default Header