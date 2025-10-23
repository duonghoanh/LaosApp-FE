"use client";

import { useState, useEffect } from "react";
import { WheelSegment } from "@/types";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSegments: WheelSegment[];
  onSave: (segments: WheelSegment[]) => Promise<void>;
  isHost: boolean;
}

const PRESET_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#C7CEEA",
  "#FF85A1",
  "#FFB3BA",
  "#BAE1FF",
];

export function SettingsModal({
  isOpen,
  onClose,
  currentSegments,
  onSave,
  isHost,
}: SettingsModalProps) {
  const [segments, setSegments] = useState<WheelSegment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSegments(
        currentSegments.map((seg, index) => ({
          ...seg,
          order: index,
        }))
      );
    }
  }, [isOpen, currentSegments]);

  const addSegment = () => {
    const newSegment: WheelSegment = {
      text: `Prize ${segments.length + 1}`,
      color: PRESET_COLORS[segments.length % PRESET_COLORS.length],
      weight: 1,
      order: segments.length,
    };
    setSegments([...segments, newSegment]);
  };

  const removeSegment = (index: number) => {
    if (segments.length <= 2) {
      toast.error("Wheel must have at least 2 segments");
      return;
    }
    setSegments(segments.filter((_, i) => i !== index));
  };

  const updateSegment = (
    index: number,
    field: keyof WheelSegment,
    value: string | number
  ) => {
    const updated = [...segments];
    updated[index] = { ...updated[index], [field]: value };
    setSegments(updated);
  };

  const handleSave = async () => {
    // Validation
    if (segments.length < 2) {
      toast.error("Wheel must have at least 2 segments");
      return;
    }

    for (const seg of segments) {
      if (!seg.text.trim()) {
        toast.error("All segments must have text");
        return;
      }
      if (seg.weight <= 0) {
        toast.error("Weight must be greater than 0");
        return;
      }
    }

    try {
      setLoading(true);
      await onSave(segments);
      toast.success("Settings saved successfully! 🎉");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Wheel Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {!isHost ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">Only the host can modify wheel settings</p>
            </div>
          ) : (
            <>
              {/* Segments List */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Segments ({segments.length})
                  </h3>
                  <button
                    onClick={addSegment}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <FaPlus />
                    Add Segment
                  </button>
                </div>

                {segments.map((segment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                  >
                    {/* Color Picker */}
                    <div className="relative">
                      <input
                        type="color"
                        value={segment.color}
                        onChange={(e) =>
                          updateSegment(index, "color", e.target.value)
                        }
                        className="w-12 h-12 rounded cursor-pointer border-2 border-gray-300"
                        title="Pick color"
                      />
                    </div>

                    {/* Text Input */}
                    <input
                      type="text"
                      value={segment.text}
                      onChange={(e) =>
                        updateSegment(index, "text", e.target.value)
                      }
                      placeholder="Segment text"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                    {/* Weight Input */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600 whitespace-nowrap">
                        Weight:
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={segment.weight}
                        onChange={(e) =>
                          updateSegment(
                            index,
                            "weight",
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => removeSegment(index)}
                      disabled={segments.length <= 2}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Delete segment"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Tips:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Weight determines the probability of selection</li>
                  <li>• Higher weight = higher chance of being selected</li>
                  <li>• Minimum 2 segments required</li>
                  <li>• Changes will be applied to all participants</li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {isHost && (
          <div className="flex gap-3 p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow font-medium disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
