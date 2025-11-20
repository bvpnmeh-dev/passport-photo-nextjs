"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Upload,
  Users,
  CheckCircle,
  XCircle,
  CreditCard,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import { allPhotoSpecs, type PhotoSpec } from "@/models/PhotoSpec";
import { constants } from "@/constants";
import { compressImageFile } from "@/utils/compressImage";
import { idpSaasService } from "@/data/network/IdpSaasService";

const CREDENTIALS = [
  { user: "wallington.cameras@yahoo.com", pass: "Admin08" },
  { user: "wallington.cameras@gmail.com", pass: "Admin28" },
];

const ADMIN_KEY = "wallington-admin-2024";

interface AdminStats {
  totalCustomers: number;
  approvedPhotos: number;
  rejectedPhotos: number;
  totalRevenue: number;
  todayCustomers: number;
  todayApproved: number;
  todayRejected: number;
  todayRevenue: number;
}

interface ProcessedPhoto {
  photoUuid: string;
  idPhotoUrl: string;
  issues?: string[];
}

export default function AdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "upload">(
    "dashboard",
  );

  // Upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedSpec, setSelectedSpec] = useState<PhotoSpec>(
    allPhotoSpecs[constants.defaultSpecCodes[0]],
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedPhoto, setProcessedPhoto] = useState<ProcessedPhoto | null>(
    null,
  );
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Dashboard stats (mock data - in production, fetch from backend)
  const [stats, setStats] = useState<AdminStats>({
    totalCustomers: 2847,
    approvedPhotos: 2789,
    rejectedPhotos: 58,
    totalRevenue: 25289.76,
    todayCustomers: 12,
    todayApproved: 11,
    todayRejected: 1,
    todayRevenue: 106.56,
  });

  useEffect(() => {
    // Check if already logged in
    const isAuth = localStorage.getItem("admin-auth");
    if (isAuth === "1") {
      setLoggedIn(true);
    }
  }, []);

  function tryLogin(e: React.FormEvent) {
    e.preventDefault();
    const found = CREDENTIALS.find(
      (c) => c.user === email && c.pass === password,
    );
    if (found) {
      setLoggedIn(true);
      setError(null);
      localStorage.setItem("admin-auth", "1");
    } else {
      setError("Invalid credentials");
    }
  }

  function logout() {
    setLoggedIn(false);
    setEmail("");
    setPassword("");
    localStorage.removeItem("admin-auth");
    setActiveTab("dashboard");
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setProcessedPhoto(null);
    setUploadError("");
  };

  const startCamera = async () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setProcessedPhoto(null);
    setUploadError("");

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
      setUploadError("Unable to access camera. Please check permissions.");
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
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-photo.jpg", {
              type: "image/jpeg",
            });
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            stopCamera();
          }
        }, "image/jpeg");
      }
    }
  };

  const processPhoto = async () => {
    if (!selectedFile) {
      setUploadError("Please select a photo first");
      return;
    }

    setIsProcessing(true);
    setUploadError("");
    setProcessedPhoto(null);

    try {
      const compressedFile = await compressImageFile(selectedFile);
      const base64 = await fileToBase64(compressedFile);

      const response = await idpSaasService.getIdPhotoNoWatermark({
        imageBase64: base64,
        height: selectedSpec.photoHeightPixels,
        width: selectedSpec.photoWidthPixels,
        faceHeight: selectedSpec.faceHeightPixels,
        whiteMarginHeight: selectedSpec.whiteMarginHeightPixels,
        topPaddingHeightForBg: selectedSpec.topPaddingHeightPixelsForBg,
        dpiForPrint: selectedSpec.dpi,
        printablePhotoNumber: 0,
      });

      if (response.data?.status === "success") {
        const photoUuid = response.data.photoUuid;
        const idPhotoUrl = response.data.idPhotoUrl;
        const issues = response.data.issues || [];

        setProcessedPhoto({
          photoUuid,
          idPhotoUrl,
          issues,
        });

        // Redirect to order page with admin bypass
        setTimeout(() => {
          router.push(
            `/orders/${photoUuid}?payment_intent=admin-bypass&admin=true`,
          );
        }, 1500);
      } else {
        setUploadError(response.data?.message || "Processing failed");
      }
    } catch (error: any) {
      console.error("Processing error:", error);
      setUploadError(error.message || "Failed to process photo");
    } finally {
      setIsProcessing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-sm text-gray-600 mt-2">
              Access your admin dashboard
            </p>
          </div>

          <form onSubmit={tryLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Login to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Camera className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">{email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="/" className="text-sm text-gray-600 hover:text-gray-900">
                View Site
              </a>
              <button
                onClick={logout}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "dashboard"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </div>
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-4 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "upload"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Process Customer Photo
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "dashboard" ? (
          <div className="space-y-8">
            {/* Today's Stats */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Today's Activity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.todayCustomers}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Customers Today
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.todayApproved}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Approved Today
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.todayRejected}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Rejected Today
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <CreditCard className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    £{stats.todayRevenue.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Revenue Today
                  </div>
                </div>
              </div>
            </div>

            {/* All Time Stats */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                All Time Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.totalCustomers}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Total Customers
                  </div>
                  <div className="mt-3 text-xs text-gray-500">Since launch</div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.approvedPhotos}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Total Approved
                  </div>
                  <div className="mt-3 text-xs text-green-600 font-medium">
                    {(
                      (stats.approvedPhotos / stats.totalCustomers) *
                      100
                    ).toFixed(1)}
                    % approval rate
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.rejectedPhotos}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Total Rejected
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    {(
                      (stats.rejectedPhotos / stats.totalCustomers) *
                      100
                    ).toFixed(1)}
                    % rejection rate
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <CreditCard className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    £{stats.totalRevenue.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Total Revenue
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Avg £
                    {(stats.totalRevenue / stats.totalCustomers).toFixed(2)} per
                    customer
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab("upload")}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                >
                  <Upload className="h-5 w-5 text-blue-600 mb-2" />
                  <div className="font-semibold text-gray-900">
                    Process Customer Photo
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Upload and process without payment
                  </div>
                </button>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-left opacity-60">
                  <BarChart3 className="h-5 w-5 text-gray-400 mb-2" />
                  <div className="font-semibold text-gray-900">
                    View Reports
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Coming soon</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-left opacity-60">
                  <Users className="h-5 w-5 text-gray-400 mb-2" />
                  <div className="font-semibold text-gray-900">
                    Customer List
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Coming soon</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Process Customer Photo
                </h2>
                <p className="text-gray-600">
                  Upload a customer's photo to process without payment
                </p>
                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ <strong>Admin Mode:</strong> Payment will be
                    automatically bypassed. This order will be marked as "Admin
                    Processed".
                  </p>
                </div>
              </div>

              {/* Photo Spec Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <select
                  value={selectedSpec.specCode}
                  onChange={(e) => {
                    const spec = allPhotoSpecs[e.target.value];
                    if (spec) setSelectedSpec(spec);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {constants.defaultSpecCodes.map((code) => {
                    const spec = allPhotoSpecs[code];
                    return (
                      <option key={code} value={code}>
                        {spec.specCodeInEnglish}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Upload Options */}
              {!previewUrl && !isUsingCamera && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <div className="text-sm font-medium text-gray-900">
                      Upload Photo
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Click to browse files
                    </div>
                  </button>

                  <button
                    onClick={startCamera}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <div className="text-sm font-medium text-gray-900">
                      Use Camera
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Take photo directly
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
              />

              {/* Camera View */}
              {isUsingCamera && (
                <div className="mb-6">
                  <div className="relative bg-black rounded-xl overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={capturePhoto}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                    >
                      Capture Photo
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Preview & Process */}
              {previewUrl && !isUsingCamera && (
                <div className="mb-6">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full max-w-md mx-auto rounded-xl border-2 border-gray-200"
                  />
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={processPhoto}
                      disabled={isProcessing}
                      className="flex-1 bg-green-600 text-white px-6 py-4 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                    >
                      {isProcessing
                        ? "Processing..."
                        : "Process Photo (No Payment)"}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl("");
                        setProcessedPhoto(null);
                        setUploadError("");
                      }}
                      className="bg-gray-200 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {uploadError}
                </div>
              )}

              {processedPhoto && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div className="font-semibold text-gray-900">
                      Photo Processed Successfully
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    Redirecting to order page with admin bypass...
                  </p>
                  <div className="text-xs text-gray-600">
                    Order ID:{" "}
                    <span className="font-mono font-semibold">
                      {processedPhoto.photoUuid}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
