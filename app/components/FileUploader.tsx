import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "~/utils/formatSize";

interface Props {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selected = acceptedFiles[0] || null;
      setError(null);
      setFile(selected);
      onFileSelect?.(selected);
    },
    [onFileSelect],
  );

  const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected: (fileRejections) => {
      const code = fileRejections[0]?.errors[0]?.code;
      if (code === "file-too-large") {
        setError(`File exceeds the ${formatSize(maxFileSize)} limit.`);
      } else if (code === "file-invalid-type") {
        setError("Invalid file type. Please upload a PDF.");
      } else {
        setError("File not accepted. Please upload a valid PDF.");
      }
    },
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: maxFileSize,
  });

  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="space-y-4 cursor-pointer">
          {file ? (
            <div
              className="uploader-selected-file"
              onClick={(e) => e.stopPropagation()}
            >
              <img src="/images/pdf.png" alt="pdf" className="size-10" />
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-lg font-semibold text-gray-700 truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatSize(file.size)}
                  </p>
                </div>
              </div>

              <button
                className="p-2 cursor-pointer"
                onClick={() => {
                  setFile(null);
                  onFileSelect?.(null);
                }}
              >
                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <div className="mx-auto w-16 h-16 flex items-center justify-center mb-3">
                <img src="/icons/info.svg" alt="upload" className="size-20" />
              </div>
              <p className="text-lg text-grey-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-lg text-gray-500">
                PDF (max {formatSize(maxFileSize)})
              </p>
              {error && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <img src="/icons/error.svg" alt="error" className="w-6 h-6" />
                  <p className="text-md text-red-500 font-semibold">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
