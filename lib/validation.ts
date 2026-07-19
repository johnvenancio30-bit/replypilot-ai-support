import { z } from "zod";

export const ticketInputSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  email: z.string().trim().email("Enter a valid email address.").max(160),
  orderNumber: z.string().trim().max(40).optional().or(z.literal("")),
  topic: z.string().trim().min(2).max(60),
  message: z.string().trim().min(20, "Please add a little more detail.").max(2000),
  website: z.string().trim().max(0).optional(),
});

export const ticketActionSchema = z.object({
  action: z.enum(["approve", "reject", "regenerate"]),
  draftReply: z.string().trim().min(20).max(5000).optional(),
});

export const sendTicketSchema = z.object({
  draftReply: z.string().trim().min(20).max(5000),
});

export const aiResponseSchema = z.object({
  summary: z.string().trim().min(10).max(300),
  category: z.enum(["shipping", "returns", "billing", "product", "account", "other"]),
  priority: z.enum(["low", "normal", "high", "urgent"]),
  sentiment: z.enum(["positive", "neutral", "frustrated", "angry"]),
  confidence: z.number().int().min(0).max(100),
  suggestedAction: z.string().trim().min(5).max(300),
  draftSubject: z.string().trim().min(5).max(150),
  draftReply: z.string().trim().min(20).max(5000),
});

export type AiResponse = z.infer<typeof aiResponseSchema>;
