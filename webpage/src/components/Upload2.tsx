import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

const ImageUploadComponent = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePaths, setImagePaths] = useState<string[]>([]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
    };

    const callApi = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await axios.post('http://127.0.0.1:8080/search', formData);

            if (response.status === 200) {
                console.log('API Response:', response.data);
                setImagePaths(response.data);
            } else {
                console.error('API Call failed with status:', response.status);
            }
        } catch (error) {
            console.error('Error occurred during API call:', error);
        }
    };

    useEffect(() => {
        // Call the API and update imagePaths whenever selectedFile changes
        callApi();
    }, [selectedFile]);

    const basicPath = '/';

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <label
                htmlFor="imageUpload"
                className="w-48 px-4 text-white bg-slate-800 rounded-md cursor-pointer"
            >
                Upload Image
            </label>
            <input
                id="imageUpload"
                type="file"
                className="hidden"
                onChange={handleImageUpload}
            />
            {imagePaths.length > 0 && (
                <div className="mx-20">
                    <h2 className="text-xl font-bold">Images</h2>
                    <div className="flex gap-1">
                        {imagePaths.map((path, index) => (
                            <Image key={index} src={`${basicPath}${path}`} alt="" width={300} height={200} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploadComponent;
