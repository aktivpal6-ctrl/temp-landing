"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required").max(120, "Title must be 120 characters or less"),
  description: z.string().min(1, "Description is required").max(1000, "Description must be 1000 characters or less"),
  location: z.string().min(1, "Location is required").max(200, "Location must be 200 characters or less"),
  location_link: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  start_time: z.string().min(1, "Start time is required"),
  duration: z.string().min(1, "Duration is required"),
  difficulty: z.enum(["Beginner", "Moderate", "Expert"], { required_error: "Difficulty is required" }),
  join_deadline: z.string().optional(),
  images: z.array(z.string().url("Must be a valid URL")).optional(),
}).refine(
  (data) => {
    if (!data.join_deadline || !data.start_time) return true;
    return new Date(data.join_deadline) < new Date(data.start_time);
  },
  { message: "Join deadline must be before the event start time", path: ["join_deadline"] },
);

function toDatetimeLocal(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const EventForm = ({ initialData, onSubmit, submitLabel = "Create event", submitting = false }) => {
  const [imageUrls, setImageUrls] = useState(() => {
    if (initialData?.images?.length) return initialData.images;
    return [];
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      location: initialData?.location || "",
      location_link: initialData?.location_link || "",
      start_time: toDatetimeLocal(initialData?.start_time),
      duration: initialData?.duration || "",
      difficulty: initialData?.difficulty || "",
      join_deadline: toDatetimeLocal(initialData?.join_deadline),
      images: initialData?.images || [],
    },
  });

  const difficulty = watch("difficulty");
  const startTime = watch("start_time");

  const addImageUrl = () => {
    setImageUrls((prev) => [...prev, ""]);
  };

  const removeImageUrl = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const updateImageUrl = (index, value) => {
    setImageUrls((prev) => prev.map((url, i) => (i === index ? value : url)));
  };

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      images: imageUrls.filter((url) => url.trim() !== ""),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-bold text-[#0F291E]">
              Title
            </Label>
            <Input
              id="title"
              placeholder="e.g. Morning Grouse Grind"
              {...register("title")}
              className="border-black/10"
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-bold text-[#0F291E]">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the event, what to bring, meeting point details..."
              rows={4}
              {...register("description")}
              className="border-black/10"
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-bold text-[#0F291E]">
              Location
            </Label>
            <Input
              id="location"
              placeholder="e.g. Grouse Mountain, North Vancouver"
              {...register("location")}
              className="border-black/10"
            />
            {errors.location && (
              <p className="text-xs text-red-500">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location_link" className="text-sm font-bold text-[#0F291E]">
              Location link (optional)
            </Label>
            <Input
              id="location_link"
              type="url"
              placeholder="https://maps.google.com/..."
              {...register("location_link")}
              className="border-black/10"
            />
            <p className="text-xs text-[#4A524A]">
              Google Maps or other map link for directions.
            </p>
            {errors.location_link && (
              <p className="text-xs text-red-500">{errors.location_link.message}</p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_time" className="text-sm font-bold text-[#0F291E]">
                Start time
              </Label>
              <Input
                id="start_time"
                type="datetime-local"
                min={toDatetimeLocal(new Date().toISOString())}
                {...register("start_time")}
                className="border-black/10"
              />
              {errors.start_time && (
                <p className="text-xs text-red-500">{errors.start_time.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-bold text-[#0F291E]">
                Duration
              </Label>
              <Input
                id="duration"
                placeholder="e.g. 2 hours"
                {...register("duration")}
                className="border-black/10"
              />
              {errors.duration && (
                <p className="text-xs text-red-500">{errors.duration.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-[#0F291E]">
              Difficulty
            </Label>
            <Select
              value={difficulty}
              onValueChange={(val) => setValue("difficulty", val, { shouldValidate: true })}
            >
              <SelectTrigger className="border-black/10">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            {errors.difficulty && (
              <p className="text-xs text-red-500">{errors.difficulty.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="join_deadline" className="text-sm font-bold text-[#0F291E]">
              Join deadline (optional)
            </Label>
            <Input
              id="join_deadline"
              type="datetime-local"
              min={toDatetimeLocal(new Date().toISOString())}
              max={startTime || undefined}
              {...register("join_deadline")}
              className="border-black/10"
            />
            <p className="text-xs text-[#4A524A]">
              After this date, users can no longer join this event. Leave empty for no deadline.
            </p>
            {errors.join_deadline && (
              <p className="text-xs text-red-500">{errors.join_deadline.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
        <div className="mb-4 flex items-center justify-between">
          <Label className="text-sm font-bold text-[#0F291E]">Images (optional)</Label>
          <button
            type="button"
            onClick={addImageUrl}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5C00]/20 bg-[#FF5C00]/5 px-3 py-1.5 text-xs font-bold text-[#FF5C00] transition-colors hover:bg-[#FF5C00]/10"
          >
            <Plus size={12} /> Add URL
          </button>
        </div>

        {imageUrls.length === 0 && (
          <p className="text-sm text-[#4A524A]">No images added. Events look great with photos.</p>
        )}

        <div className="space-y-3">
          {imageUrls.map((url, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                placeholder="https://example.com/image.jpg"
                value={url}
                onChange={(e) => updateImageUrl(i, e.target.value)}
                className="border-black/10"
              />
              <button
                type="button"
                onClick={() => removeImageUrl(i)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-black/10 text-[#4A524A] transition-colors hover:border-red-300 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-[#FF5C00] px-6 py-3 text-sm font-bold text-white hover:bg-[#e64f00] disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
};
