"use client";

import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-surface cursor-zoom-in"
          aria-label="Vis større bilde"
        >
          <Image
            src={selectedImage}
            alt={productName}
            fill
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.02]"
            priority
          />
        </button>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {images.map((image, index) => {
            const isSelected = image === selectedImage;

            return (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={`relative aspect-square overflow-hidden rounded-xl border bg-surface transition ${
                  isSelected
                    ? "border-pink-dark"
                    : "border-border hover:border-pink-light"
                }`}
                aria-label={`Vis bilde ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${productName} - bilde ${index + 1}`}
                  fill
                  className="object-contain p-2"
                />
              </button>
            );
          })}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setIsOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-6 top-6 text-4xl text-white"
            aria-label="Lukk bilde"
          >
            ×
          </button>

          <div
            className="relative h-[90vh] w-[90vw] max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt={productName}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}