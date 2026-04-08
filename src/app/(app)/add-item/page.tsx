"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { SearchStep } from "@/components/add-item/search-step";
import { MetadataStep, type MetadataFormData } from "@/components/add-item/metadata-step";
import { ValuationStep } from "@/components/add-item/valuation-step";
import {
  createItemAction,
  checkDuplicateItemAction,
  createCustomProductAction,
} from "@/lib/actions/items";
import { createCollectionAction } from "@/lib/actions/collections";
import type { SearchResultWithDbId } from "@/lib/actions/search";

type Step = "search" | "metadata" | "valuation";
type DuplicateInfo = { id: string; name: string; quantity: number };

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
    useState<SearchResultWithDbId | null>(null);
  const [metadataValues, setMetadataValues] = useState<MetadataFormData | null>(
    null
  );
  const [duplicate, setDuplicate] = useState<DuplicateInfo | null>(null);

  function handleSelectProduct(result: SearchResultWithDbId) {
    // Check for duplicate if we have a db product id
    if (result.dbProductId) {
      checkDuplicateItemAction(result.dbProductId).then((existing) => {
        if (existing) {
          setDuplicate(existing);
          setSelectedProduct(result);
          return;
        }
        setDuplicate(null);
        setSelectedProduct(result);
        setStep("metadata");
      });
      return;
    }
    setDuplicate(null);
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

      const itemName =
        selectedProduct?.name ?? metadataValues.itemName ?? "Unnamed Item";
      const imageUrl =
        selectedProduct?.imageUrl ?? metadataValues.imageUrl ?? null;

      // For manual entries with a market price, create a custom product record
      let productId: number | null = selectedProduct?.dbProductId ?? null;
      if (!selectedProduct && metadataValues.marketPrice) {
        const customProduct = await createCustomProductAction({
          name: itemName,
          price: metadataValues.marketPrice,
          imageUrl,
        });
        productId = customProduct.id;
      }

      await createItemAction({
        collectionId,
        userId: "", // overwritten by server action via auth()
        name: itemName,
        pricechartingId: productId,
        gradingService:
          metadataValues.gradingService !== "None"
            ? metadataValues.gradingService
            : null,
        grade: metadataValues.grade || null,
        certNumber: metadataValues.certNumber || null,
        notes: metadataValues.notes || null,
        imageUrl,
        tags: metadataValues.tags,
        askingPrice: metadataValues.askingPrice || null,
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

      {/* Duplicate warning */}
      {duplicate && step === "search" && (
        <div className="mb-8 bg-tertiary/10 border border-tertiary/30 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-tertiary text-2xl mt-0.5">
              warning
            </span>
            <div className="flex-1">
              <p className="font-headline font-bold text-on-surface mb-1">
                You already own this item
              </p>
              <p className="text-sm text-on-surface-variant mb-3">
                <strong>{duplicate.name}</strong> is already in your collection
                (qty: {duplicate.quantity}). To add more copies, go to the item
                and increase the quantity instead of adding a duplicate entry.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/collection/${duplicate.id}`}
                  className="inline-flex items-center gap-2 bg-tertiary text-on-tertiary font-headline font-bold text-sm px-5 py-2.5 rounded-xl transition-transform active:scale-95"
                >
                  <span className="material-symbols-outlined text-base">
                    edit
                  </span>
                  Go to Item &amp; Update Quantity
                </Link>
                <button
                  onClick={() => {
                    setDuplicate(null);
                    if (selectedProduct) setStep("metadata");
                  }}
                  className="inline-flex items-center gap-2 bg-surface-container text-on-surface-variant font-headline font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-surface-container-high transition-colors"
                >
                  Add Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            itemName={selectedProduct?.name ?? metadataValues.itemName ?? "Item"}
            imageUrl={selectedProduct?.imageUrl ?? metadataValues.imageUrl ?? null}
            marketValue={selectedProduct?.price ?? metadataValues.marketPrice ?? null}
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
