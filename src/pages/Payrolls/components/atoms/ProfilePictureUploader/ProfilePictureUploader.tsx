import React, { useState, ChangeEvent } from "react";
import { useUploadProfilePicture } from "@/hooks/useEmployee";

type Props = {
  employeeId: string;
};

export default function ProfilePictureUploader({ employeeId }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const {
    mutate: uploadProfilePicture,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useUploadProfilePicture();

  // Cuando el usuario selecciona un archivo
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (!selected) {
      setFile(null);
      setPreview(null);
      return;
    }

    if (selected.type !== "image/png") {
      alert("Solo se permiten archivos PNG");
      e.target.value = "";
      return;
    }

    setFile(selected);
    // Generar URL de previsualización
    const url = URL.createObjectURL(selected);
    setPreview(url);
  };

  // Al pulsar "Subir"
  const handleUpload = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64Data = dataUrl.split(",")[1]; // quitar "data:image/png;base64,"
      uploadProfilePicture({ employeeId, base64Data });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4 border rounded-lg">
      <label className="block mb-2 font-medium">Foto de perfil (PNG)</label>
      <input
        type="file"
        accept="image/png"
        onChange={handleFileChange}
        disabled={isLoading}
      />

      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-full border"
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || isLoading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Subiendo..." : "Subir foto"}
      </button>

      {isError && (
        <p className="mt-2 text-red-600">
          {(error as Error).message}
        </p>
      )}

      {isSuccess && (
        <p className="mt-2 text-green-600">
          ¡Foto de perfil actualizada!
        </p>
      )}
    </div>
  );
}