import { useState } from 'react';
import axios from 'axios';

function ImageUploadComponent() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
        if (file) {
            const reader = new FileReader();

            reader.onload = async () => {
                try {
                    const base64Image = reader.result?.toString() || '';

                    const response = await axios.post('http://127.0.0.1:5000/search', { image: base64Image });

                    if (response.status === 200) {
                        console.log('API Response:', response.data);
                    } else {
                        console.error('API Call failed with status:', response.status);
                    }
                } catch (error) {
                    console.error('Error occurred during API call:', error);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <label
                htmlFor="imageUpload"
                className="w-48 px-4 py-2 mb-72 text-white bg-slate-800 rounded-md cursor-pointer"
            >
                Upload Image
            </label>
            <input id="imageUpload" type="file" className="hidden" onChange={handleImageUpload} />
        </div>
    );
}

export default ImageUploadComponent;
