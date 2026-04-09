"use client";

type BulkActionBarProps = {
  selectedCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkDelete: () => void;
  onBulkAddTag: (tag: string) => void;
  onBulkRemoveTag: (tag: string) => void;
  onBulkMove: (collectionId: string) => void;
  onCancel: () => void;
  collections: { id: string; name: string }[];
  availableTags: string[];
  removableTags: string[];
  isProcessing: boolean;
};

export function BulkActionBar({
  selectedCount,
  onSelectAll,
  onDeselectAll,
  onBulkDelete,
  onBulkAddTag,
  onBulkRemoveTag,
  onBulkMove,
  onCancel,
  collections,
  availableTags,
  removableTags,
  isProcessing,
}: BulkActionBarProps) {
  return (
    <div className="fixed bottom-16 sm:bottom-0 inset-x-0 z-50 bg-surface-container-high/95 backdrop-blur border-t border-outline-variant/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Selection info */}
        <div className="flex items-center gap-2 mr-auto">
          <span className="font-headline font-bold text-on-surface text-sm">
            {selectedCount} selected
          </span>
          <button
            onClick={onSelectAll}
            disabled={isProcessing}
            className="text-xs text-primary hover:underline disabled:opacity-50"
          >
            Select All
          </button>
          <button
            onClick={onDeselectAll}
            disabled={isProcessing}
            className="text-xs text-primary hover:underline disabled:opacity-50"
          >
            Deselect All
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Add Tag */}
          <select
            disabled={isProcessing}
            value=""
            onChange={(e) => {
              if (e.target.value) onBulkAddTag(e.target.value);
            }}
            className="bg-surface-container border border-outline-variant/30 rounded-lg px-2 py-1.5 text-xs text-on-surface disabled:opacity-50 cursor-pointer"
          >
            <option value="" disabled>
              + Add Tag
            </option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          {/* Remove Tag — only tags present on selected items */}
          {removableTags.length > 0 && (
            <select
              disabled={isProcessing}
              value=""
              onChange={(e) => {
                if (e.target.value) onBulkRemoveTag(e.target.value);
              }}
              className="bg-surface-container border border-outline-variant/30 rounded-lg px-2 py-1.5 text-xs text-on-surface disabled:opacity-50 cursor-pointer"
            >
              <option value="" disabled>
                − Remove Tag
              </option>
              {removableTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          )}

          {/* Move to Collection */}
          {collections.length > 1 && (
            <select
              disabled={isProcessing}
              value=""
              onChange={(e) => {
                if (e.target.value) onBulkMove(e.target.value);
              }}
              className="bg-surface-container border border-outline-variant/30 rounded-lg px-2 py-1.5 text-xs text-on-surface disabled:opacity-50 cursor-pointer"
            >
              <option value="" disabled>
                Move to...
              </option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          {/* Delete */}
          <button
            onClick={onBulkDelete}
            disabled={isProcessing}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-error border border-error/30 hover:bg-error/10 transition disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
            Delete
          </button>

          {/* Cancel */}
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container transition disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        {/* Processing spinner */}
        {isProcessing && (
          <span className="material-symbols-outlined text-primary text-lg animate-spin">
            progress_activity
          </span>
        )}
      </div>
    </div>
  );
}
