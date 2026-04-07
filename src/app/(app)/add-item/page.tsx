"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { SearchStep } from "@/components/add-item/search-step";
import { MetadataStep, type MetadataFormData } from "@/components/add-item/metadata-step";
import { ValuationStep } from "@/components/add-item/valuation-step";
import { createItemAction } from "@/lib/actions/items";
import { createCollectionAction } from "@/lib/actions/collections";
import type { PricechartingSearchResult } from "@/lib/scraper/pricecharting";

type Step = "search" | "metadata" | "valuation";

const STEPS = [
  { id: "search", label: "Identify", icon: "search" },
  { id: "metadata", label: "Details", icon: "edit_note" },
  { id: "valuation", label: "Confirm", icon: "verified" },
] as const;

export default function AddItemPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState<Step>("search");
  const [selectedProduct, setSelectedProduct] =
    useState<PricechartingSearchResult | null>(null);
  const [metadataValues, setMetadataValues] = useState<MetadataFormData | null>(
    null
  );

  function handleSelectProduct(result: PricechartingSearchResult) {
    setSelectedProduct(result);
    setStep("metadata");
  }

  function handleManualEntry() {
    setSelectedProduct(null);
    setStep("metadata");
  }

  function handleMetadataSubmit(data: MetadataFormData) {
    setMetadataValues(data);
    setStep("valuation");
  }

  function handleConfirm() {
    if (!metadataValues) return;

    startTransition(async () => {
      let collectionId = metadataValues.collectionId;

      // Create new collection if needed
      if (collectionId.startsWith("new:")) {
        const collectionName =
          metadataValues.newCollectionName?.trim() || "My Collection";
        const newCollection = await createCollectionAction({
          name: collectionName,
        });
        collectionId = newCollection.id;
      }

      const itemName = selectedProduct?.name ?? "Unnamed Item";

      await createItemAction({
        collectionId,
        userId: "", // overwritten by server action via auth()
        name: itemName,
        pricechartingId: undefined,
        gradingService:
          metadataValues.gradingService !== "None"
            ? metadataValues.gradingService
            : null,
        grade: metadataValues.grade || null,
        certNumber: metadataValues.certNumber || null,
        purchasePrice: metadataValues.purchasePrice || null,
        purchaseDate: metadataValues.purchaseDate || null,
        notes: metadataValues.notes || null,
        imageUrl: selectedProduct?.imageUrl ?? null,
      });

      router.push("/collection");
    });
  }

  const currentStepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <header className="mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-on-surface tracking-tighter mb-2">
          Identify Your{" "}
          <span className="text-primary italic">Treasure</span>
        </h1>
        <p className="font-body text-base text-on-surface-variant max-w-lg">
          Search for your collectible on PriceCharting, fill in your details,
          and vault it.
        </p>
      </header>

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-10">
        {STEPS.map((s, idx) => {
          const isActive = s.id === step;
          const isCompleted = idx < currentStepIndex;
          return (
            <div key={s.id} className="flex items-center">
              {/* Step circle */}
              <div
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-headline font-bold transition-all",
                  isActive &&
                    "bg-primary text-on-primary shadow-md",
                  isCompleted &&
                    "bg-surface-container text-primary",
                  !isActive &&
                    !isCompleted &&
                    "bg-surface-container text-on-surface-variant"
                )}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isCompleted ? "check_circle" : s.icon}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>

              {/* Connector */}
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-8 mx-1 rounded-full transition-colors",
                    idx < currentStepIndex
                      ? "bg-primary"
                      : "bg-outline-variant/30"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div>
        {step === "search" && (
          <SearchStep
            onSelect={handleSelectProduct}
            onManualEntry={handleManualEntry}
          />
        )}

        {step === "metadata" && (
          <MetadataStep
            selectedProduct={selectedProduct}
            onSubmit={handleMetadataSubmit}
            onBack={() => setStep("search")}
          />
        )}

        {step === "valuation" && metadataValues && (
          <ValuationStep
            itemName={selectedProduct?.name ?? metadataValues.newCollectionName ?? "Item"}
            imageUrl={selectedProduct?.imageUrl ?? null}
            marketValue={selectedProduct?.price ?? null}
            purchasePrice={metadataValues.purchasePrice}
            onConfirm={handleConfirm}
            onBack={() => setStep("metadata")}
            isPending={isPending}
          />
        )}
      </div>

      {/* Bottom bar */}
      <div className="mt-14 pt-6 border-t border-outline-variant/15 flex items-center justify-between">
        <Link
          href="/collection"
          className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors font-body"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          Cancel and Return
        </Link>

        {step === "search" && (
          <button
            onClick={handleManualEntry}
            className="text-sm text-primary font-headline font-semibold hover:underline transition-colors"
          >
            Manual Entry
          </button>
        )}
      </div>
    </div>
  );
}
