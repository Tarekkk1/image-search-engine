import React, { useRef } from 'react'
import Image from 'next/image'



export default function Upload() {
    const fileInputRef = useRef(null);

    const handleImageUpload = () => {
        const file = fileInputRef.current?.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                // Perform any necessary logic with the uploaded image data
                console.log('Uploaded image:', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (

        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <label
                form="imageUpload"
                className="w-48 px-4 py-2 mb-52 text-white bg-slate-800  rounded-md cursor-pointer"


            >
                Upload Image

            </label>
            <input
                id="imageUpload"
                type="file"
                className="hidden"
                onClick={(e) => {
                    const file = e.target.files[0];
                    const reader = new FileReader();

                    reader.onload = () => {
                        // Perform any necessary logic with the uploaded image data
                        console.log('Uploaded image:', reader.result);
                    };

                    if (file) {
                        reader.readAsDataURL(file);
                    }

                }}



            />

        </div >


    )
}


