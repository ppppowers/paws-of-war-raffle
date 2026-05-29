"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Detail-page gallery: one large preview plus a row of thumbnails.
 * - Click a thumbnail (or use the arrow buttons) to change the preview.
 * - Left / Right arrow keys move between photos when the gallery is focused.
 * Gracefully handles a single image (hides controls).
 */
export default function ImageGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const hasMultiple = count > 1;

  const go = (next: number) => setIndex((next + count) % count);

  return (
    <div
      className="flex flex-col gap-4"
      onKeyDown={(e) => {
        if (!hasMultiple) return;
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(index - 1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          go(index + 1);
        }
      }}
    >
      {/* Large selected preview */}
      <div className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-brand)] border border-line bg-surface">
        <Image
          key={images[index]}
          src={images[index]}
          alt={`${title} — photo ${index + 1} of ${count}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="animate-rise-in object-cover"
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-line bg-surface/85 p-2 text-ink opacity-0 backdrop-blur transition-opacity duration-200 hover:bg-surface focus-visible:opacity-100 group-hover:opacity-100"
            >
              <Arrow direction="left" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-line bg-surface/85 p-2 text-ink opacity-0 backdrop-blur transition-opacity duration-200 hover:bg-surface focus-visible:opacity-100 group-hover:opacity-100"
            >
              <Arrow direction="right" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/75 px-2.5 py-1 text-xs font-medium text-white tabular-nums">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <ul className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((src, i) => {
            const active = i === index;
            return (
              <li key={src}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={active}
                  className={`relative block aspect-square w-full overflow-hidden rounded-[calc(var(--radius-brand)-2px)] border-2 transition-all duration-200 ${
                    active
                      ? "border-accent"
                      : "border-line opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={direction === "left" ? "rotate-180" : ""}
    >
      <path
        d="M5 3l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
