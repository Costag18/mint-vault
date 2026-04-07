"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { fetchProductImageAction } from "@/lib/actions/search";

export function LazyResultImage({
  externalId,
  initialImageUrl,
  alt,
  size = 32,
}: {
  externalId: string;
  initialImageUrl: string | null;
  alt: string;
  size?: number;
}) {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(!!initialImageUrl);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fetched || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          setLoading(true);
          fetchProductImageAction(externalId)
            .then((url) => {
              if (url) setImageUrl(url);
              setFetched(true);
            })
            .catch(() => setFetched(true))
            .finally(() => setLoading(false));
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [externalId, fetched]);

  return (
    <div
      ref={ref}
      className="relative shrink-0 rounded overflow-hidden bg-surface-container-highest"
      style={{ width: size, height: size * 1.25 }}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover"
          sizes={`${size}px`}
          unoptimized
        />
      ) : loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-xs text-primary animate-spin">
            progress_activity
          </span>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-xs text-on-surface-variant opacity-40">
            image
          </span>
        </div>
      )}
    </div>
  );
}
