import { modalState } from "../atoms/modalAtom"
import { useRecoilState } from "recoil";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { CameraIcon } from "@heroicons/react/outline";
import { db, storage } from "../firebase";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadString  } from "firebase/storage";
import { useSession } from "next-auth/react";

function Modal() {
    const { data: session } = useSession();
    const [open, setOpen] = useRecoilState(modalState)
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const filePickerRef = useRef(null)
    const captionRef = useRef(null)

    const addImageToPost = (e) => {
        const reader = new FileReader()
        if (e.target.files[0]) {
            if (e.target.files[0].size < 5242880) {
                reader.readAsDataURL(e.target.files[0])
            }   
        }

        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result)
        }
    }

    const uploadPost = async () => {
        if (loading) return

        setLoading(true)

        //1 create a post and add to firestore
        //2 get the post id and newly created post
        //3 upload the image to firebase storage with post id
        //4 get a download url from firebase storage and update the original post with image

        const docRef = await addDoc(collection(db, 'posts'), {
            username: session.user.username,
            caption: captionRef.current.value,
            profileImg: session.user.image,
            timestamp: serverTimestamp()
        })

        console.log("new doc added with ID", docRef.id)

        const imageRef = ref(storage, `posts/${docRef.id}/image`)

        await uploadString(imageRef, selectedFile, "data_url").then(async snapshot => {
            console.log(snapshot)
            const downloadUrl = await getDownloadURL(imageRef)
            await updateDoc(doc(db, 'posts', docRef.id), {
                image: downloadUrl
            })
        })

        setOpen(false)
        setLoading(false)
        setSelectedFile(null)
    }

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

                                {selectedFile ? (
                                    <img src={selectedFile} className="w-full object-contain cursor-pointer" onClick={() => setSelectedFile(null)} alt="" />
                                ) : (
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer" onClick={() => filePickerRef.current.click()}>

                                        <CameraIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                    </div>
                                )}


                                <div className="text-center mt-3 sm:mt-5">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Upload a photo
                                    </Dialog.Title>
                                    <div>
                                        <input type="file" hidden ref={filePickerRef} onChange={addImageToPost} />
                                    </div>
                                    <div className="mt-2">
                                        <input type="text"
                                            ref={captionRef}
                                            className="border-none focus:ring-0 w-full text-center"
                                            placeholder="Please enter a caption"
                                        />
                                    </div>
                                    <div className="mt-5 sm:mt-6">
                                        <button 
                                        type="button" 
                                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300"
                                        disabled={!selectedFile}
                                        onClick={uploadPost}
                                        >
                                            {loading? "Uploading..." :"Upload Post"}
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default Modal