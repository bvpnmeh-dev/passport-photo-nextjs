"use client";

import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  Camera,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  CreditCard,
} from "lucide-react";
import { compressImageFile } from "../utils/compressImage";
import { fileToBase64 } from "../utils/fileToBase64";
import { idpSaasService } from "../data/network/IdpSaasService";
import { constants } from "../constants";
import { formatPrice } from "../utils/formatPrice";

interface DocumentPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: string;
  documentIcon: string;
  documentColor: string;
}

interface PhotoRequirement {
  text: string;
}

const PHOTO_REQUIREMENTS: Record<string, PhotoRequirement[]> = {
  Passport: [
    { text: "Plain white or light-colored background" },
    { text: "Face clearly visible, looking straight at camera" },
    { text: "Neutral expression, mouth closed" },
    { text: "No glasses, hats, or head coverings (unless religious)" },
    { text: "Good lighting, no shadows on face" },
    { text: "Photo taken in last 6 months" },
  ],
  "Driving Licence": [
    { text: "Plain light-colored background" },
    { text: "Face clearly visible, neutral expression" },
    { text: "No sunglasses or tinted glasses" },
    { text: "Remove hat unless for religious or medical reasons" },
    { text: "Good quality, in focus" },
    { text: "Recent photo (within 6 months)" },
  ],
  "Oyster Card": [
    { text: "Clear face, looking at camera" },
    { text: "Plain background" },
    { text: "No sunglasses" },
    { text: "Good lighting" },
  ],
  "Travel Cards": [
    { text: "Recent passport-style photo" },
    { text: "Plain background" },
    { text: "Face clearly visible" },
    { text: "No filters or edits" },
  ],
  "Student ID": [
    { text: "Plain background preferred" },
    { text: "Face clearly visible" },
    { text: "Recent photo" },
    { text: "Professional appearance" },
  ],
  "Rail Cards": [
    { text: "Passport-style photo" },
    { text: "Plain background" },
    { text: "Face clearly visible" },
    { text: "No sunglasses or hats" },
  ],
};

export default function DocumentPhotoModal({
  isOpen,
  onClose,
  documentType,
  documentIcon,
  documentColor,
}: DocumentPhotoModalProps) {
  const [requirementsOpen, setRequirementsOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [issues, setIssues] = useState<string[]>([]);
  const [photoUuid, setPhotoUuid] = useState("");
  const [digitalCode, setDigitalCode] = useState("");
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const requirements =
    PHOTO_REQUIREMENTS[documentType] || PHOTO_REQUIREMENTS.Passport;

  const handleClose = () => {
    stopCamera();
    resetState();
    onClose();
  };

  const resetState = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setIsProcessing(false);
    setIsApproved(false);
    setValidationMessage("");
    setIssues([]);
    setPhotoUuid("");
    setDigitalCode("");
    setShowCode(false);
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setIsApproved(false);
    setValidationMessage("");
    setIssues([]);

    await processPhoto(file);
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setStream(mediaStream);
      setIsUsingCamera(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      setValidationMessage(
        "Unable to access camera. Please check permissions.",
      );
      console.error(error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsUsingCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], "camera-photo.jpg", {
              type: "image/jpeg",
            });
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            stopCamera();
            await processPhoto(file);
          }
        }, "image/jpeg");
      }
    }
  };

  const processPhoto = async (file: File) => {
    setIsProcessing(true);
    setValidationMessage("");
    setIssues([]);

    try {
      const base64 = await compressImageFile(file);

      const specCode = constants.defaultSpecCodes[0];

      // Get signed URL
      const signedUrlResponse = await idpSaasService.getSignedUrl({
        specCode,
      });

      // Create watermark photo
      const response = await idpSaasService.createWatermarkPhoto(
        signedUrlResponse.signedUrl,
        {
          imageBase64: base64,
        },
      );

      setPhotoUuid(response.photoUuid);
      const issuesList = response.issues || [];
      setIssues(issuesList);

      if (issuesList.length === 0) {
        setIsApproved(true);
        setValidationMessage("✓ Photo Approved - Meets all requirements");
      } else {
        setIsApproved(false);
        setValidationMessage(
          "Photo needs adjustment. Please review issues below:",
        );
      }
    } catch (error: any) {
      console.error("Processing error:", error);
      setIsApproved(false);
      setValidationMessage(
        error.message || "Failed to process photo. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!photoUuid) return;

    setIsPaymentProcessing(true);

    try {
      setTimeout(() => {
        const code = generateDigitalCode(photoUuid);
        setDigitalCode(code);
        setShowCode(true);
        setIsPaymentProcessing(false);
      }, 1500);
    } catch (error) {
      console.error("Payment error:", error);
      setIsPaymentProcessing(false);
    }
  };

  const generateDigitalCode = (uuid: string): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const hash = uuid
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)
      .toString(36)
      .toUpperCase()
      .padStart(4, "0");
    const part1 = timestamp.slice(0, 4).padEnd(4, "0");
    const part2 = hash.slice(0, 4).padEnd(4, "0");
    const part3 = uuid
      .slice(0, 4)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "0");
    const part4 = uuid
      .slice(-4)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "0");
    return `${part1}-${part2}-${part3}-${part4}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(digitalCode);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-t-3xl w-full max-w-3xl max-h-[80vh] overflow-y-auto shadow-2xl transform transition-transform duration-300 ease-out animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <style jsx>{`
          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
          .animate-slideUp {
            animation: slideUp 0.3s ease-out;
          }
        `}</style>

        <div
          className={`${documentColor} text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">
              {documentIcon}
            </span>
            <h2 id="modal-title" className="text-xl font-bold">
              {documentType} Photo
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="border rounded-lg">
            <button
              onClick={() => setRequirementsOpen(!requirementsOpen)}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg"
              aria-expanded={requirementsOpen}
              aria-controls="requirements-list"
            >
              <span className="font-semibold text-gray-900">
                Photo Requirements
              </span>
              {requirementsOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {requirementsOpen && (
              <ul
                id="requirements-list"
                className="px-4 py-3 space-y-2 text-sm text-gray-700"
              >
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle
                      className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span>{req.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {!previewUrl && !isUsingCamera && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-500 hover:bg-blue-50 transition-all min-h-[120px] flex flex-col items-center justify-center"
                aria-label="Upload a photo from your device"
              >
                <Upload
                  className="h-12 w-12 text-gray-400 mb-3"
                  aria-hidden="true"
                />
                <div className="text-sm font-medium text-gray-900">
                  Upload a Photo
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  From your device
                </div>
              </button>

              <button
                onClick={startCamera}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-500 hover:bg-blue-50 transition-all min-h-[120px] flex flex-col items-center justify-center"
                aria-label="Take a photo with your camera"
              >
                <Camera
                  className="h-12 w-12 text-gray-400 mb-3"
                  aria-hidden="true"
                />
                <div className="text-sm font-medium text-gray-900">
                  Take a Photo
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Use your camera
                </div>
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="File input for photo upload"
          />

          {isUsingCamera && (
            <div className="space-y-4">
              <div className="relative bg-black rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full"
                  aria-label="Live camera feed"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={capturePhoto}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  aria-label="Capture photo from camera"
                >
                  Capture Photo
                </button>
                <button
                  onClick={stopCamera}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  aria-label="Cancel camera"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {previewUrl && !isUsingCamera && (
            <div className="space-y-4">
              <img
                src={previewUrl}
                alt="Preview of uploaded photo"
                className="w-full max-w-md mx-auto rounded-xl border-2 border-gray-200"
              />

              {isProcessing && (
                <div className="text-center py-4">
                  <div
                    className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                    role="status"
                    aria-label="Processing photo"
                  ></div>
                  <p className="mt-2 text-gray-600">Validating photo...</p>
                </div>
              )}

              {!isProcessing && validationMessage && (
                <div
                  className={`rounded-lg p-4 ${isApproved ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                  role="alert"
                >
                  <div className="flex items-start gap-3">
                    {isApproved ? (
                      <CheckCircle
                        className="h-6 w-6 text-green-600 flex-shrink-0"
                        aria-hidden="true"
                      />
                    ) : (
                      <AlertCircle
                        className="h-6 w-6 text-red-600 flex-shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    <div className="flex-1">
                      <p
                        className={`font-semibold ${isApproved ? "text-green-900" : "text-red-900"}`}
                      >
                        {validationMessage}
                      </p>
                      {issues.length > 0 && (
                        <ul className="mt-2 space-y-1 text-sm text-red-800">
                          {issues.map((issue, index) => (
                            <li key={index}>• {issue}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  {!isApproved && (
                    <button
                      onClick={() => {
                        setPreviewUrl("");
                        setSelectedFile(null);
                        resetState();
                      }}
                      className="mt-3 w-full bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                      aria-label="Retake photo"
                    >
                      Retake Photo
                    </button>
                  )}
                </div>
              )}

              {isApproved && !showCode && (
                <button
                  onClick={handlePayment}
                  disabled={isPaymentProcessing}
                  className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                  aria-label={`Proceed to payment for ${formatPrice(constants.productPackages.find((pkg) => pkg.id === "standard")?.priceCents || 888, "gbp")}`}
                >
                  <CreditCard className="h-5 w-5" aria-hidden="true" />
                  {isPaymentProcessing
                    ? "Processing..."
                    : `Pay ${formatPrice(constants.productPackages.find((pkg) => pkg.id === "standard")?.priceCents || 888, "gbp")} & Get Code`}
                </button>
              )}

              {showCode && digitalCode && (
                <div className="bg-blue-50 rounded-lg p-6 space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <CheckCircle
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                    <span>Your Digital Photo Code</span>
                  </h3>
                  <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                    <p className="text-2xl font-mono font-bold text-center text-blue-600 select-all">
                      {digitalCode}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={copyToClipboard}
                      className="bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      aria-label="Copy code to clipboard"
                    >
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      Copy Code
                    </button>
                    <button
                      className="bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      aria-label="Download photo"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      Download
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 text-center">
                    Valid for 30 days • Use this code on gov.uk
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
