import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, AlertCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { validateImage } from '../utils/imageValidation';
import Button from './ui/Button';

const ImageUpload = ({ onImageSelect, onImageRemove, disabled = false }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);
    const [validationWarnings, setValidationWarnings] = useState([]);
    const [isValidating, setIsValidating] = useState(false);

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        setIsValidating(true);
        setValidationErrors([]);
        setValidationWarnings([]);

        // Validate image
        const validation = await validateImage(file);

        if (!validation.valid) {
            setValidationErrors(validation.errors);
            setIsValidating(false);
            return;
        }

        if (validation.warnings.length > 0) {
            setValidationWarnings(validation.warnings);
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
            setSelectedImage(file);
            setIsValidating(false);

            if (onImageSelect) {
                onImageSelect(file, validation.metadata);
            }
        };
        reader.readAsDataURL(file);
    }, [onImageSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png']
        },
        multiple: false,
        disabled: disabled || isValidating
    });

    const handleRemove = () => {
        setSelectedImage(null);
        setPreview(null);
        setValidationErrors([]);
        setValidationWarnings([]);

        if (onImageRemove) {
            onImageRemove();
        }
    };

    return (
        <div className="w-full">
            {
                !preview ? (
                    <div
                        {...getRootProps()}
                        className={`dropzone border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'active border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                            } ${disabled || isValidating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <input {...getInputProps()} />

                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 bg-primary-100 rounded-full">
                                <Upload className="w-12 h-12 text-primary-600" />
                            </div>

                            {isValidating ? (
                                <div className="space-y-2">
                                    <div className="spinner mx-auto"></div>
                                    <p className="text-gray-600">Validating image...</p>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <p className="text-lg font-semibold text-gray-700">
                                            {isDragActive ? 'Drop the image here' : 'Drag & drop a leaf image'}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                                    </div>

                                    <div className="text-xs text-gray-400">
                                        <p>Supported formats: JPG, PNG</p>
                                        <p>Maximum size: 5MB</p>
                                        <p>Minimum resolution: 224x224</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Image Preview */}
                        <div className="relative group">
                            <img
                                src={preview}
                                alt="Selected leaf"
                                className="w-full h-96 object-contain bg-gray-100 rounded-xl"
                            />

                            {/* Remove Button */}
                            <button
                                onClick={handleRemove}
                                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                                title="Remove image"
                            >
                                <X size={20} />
                            </button>

                            {/* Image Info Overlay */}
                            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-sm font-medium">{selectedImage?.name}</p>
                                <p className="text-xs text-gray-300 mt-1">
                                    {(selectedImage?.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        </div>

                        {/* Validation Warnings */}
                        {validationWarnings.length > 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-yellow-800 mb-2">Image Quality Warnings</h4>
                                        <ul className="space-y-1">
                                            {validationWarnings.map((warning, index) => (
                                                <li key={index} className="text-sm text-yellow-700">• {warning}</li>
                                            ))}
                                        </ul>
                                        <p className="text-xs text-yellow-600 mt-2">
                                            You can still proceed, but results may be less accurate.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Success Message */}
                        {validationWarnings.length === 0 && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <p className="text-sm font-medium text-green-800">
                                        Image validated successfully! Ready for analysis.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Change Image Button */}
                        <Button
                            variant="outline"
                            onClick={handleRemove}
                            className="w-full"
                            icon={<ImageIcon size={18} />}
                        >
                            Change Image
                        </Button>
                    </div>
                )
            }

            {/* Validation Errors */}
            {
                validationErrors.length > 0 && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-red-800 mb-2">Validation Errors</h4>
                                <ul className="space-y-1">
                                    {validationErrors.map((error, index) => (
                                        <li key={index} className="text-sm text-red-700">• {error}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ImageUpload;
