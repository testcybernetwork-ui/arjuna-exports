import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

type ZoomedImage = { src: string; alt: string };
type OpenZoom = (image: ZoomedImage) => void;

const ImageZoomContext = createContext<OpenZoom | null>(null);

export function ImageZoomProvider({ children }: { children: ReactNode }) {
  const [image, setImage] = useState<ZoomedImage | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeZoom = useCallback(() => {
    setImage(null);
    if (dialogRef.current?.open) dialogRef.current.close();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dialogRef.current?.open) {
        event.preventDefault();
        closeZoom();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeZoom]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (image && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    } else if (!image && dialog.open) {
      dialog.close();
    }
  }, [image]);

  return (
    <ImageZoomContext.Provider value={setImage}>
      {children}
      <dialog
        ref={dialogRef}
        className="image-zoom-dialog"
        aria-label="Image preview"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeZoom();
        }}
        onClose={() => setImage(null)}
        onCancel={(event) => {
          event.preventDefault();
          closeZoom();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closeZoom();
          }
        }}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="image-zoom-dialog__close"
          aria-label="Close image preview"
          onClick={closeZoom}
        >
          <X aria-hidden="true" />
        </button>
        {image && <img src={image.src} alt={image.alt} className="image-zoom-dialog__image" />}
      </dialog>
    </ImageZoomContext.Provider>
  );
}

export function ImageZoomButton({ src, alt, className }: ZoomedImage & { className?: string }) {
  const openZoom = useContext(ImageZoomContext);

  if (!openZoom) {
    throw new Error("ImageZoomButton must be rendered inside ImageZoomProvider.");
  }

  return (
    <button
      type="button"
      className={cn("image-zoom-button", className)}
      aria-label={`Zoom image: ${alt}`}
      onClick={() => openZoom({ src, alt })}
    >
      <ZoomIn aria-hidden="true" />
    </button>
  );
}
