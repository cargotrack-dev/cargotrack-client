// src/features/Waybills/schemas/schema.ts
import { z } from "zod";

// Helper schemas
const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const emailSchema = z.string().email("Invalid email format").optional().or(z.literal(""));
const phoneSchema = z.string().regex(phoneRegex, "Invalid phone number format").optional().or(z.literal(""));

// Dimensions schema
const dimensionsSchema = z.object({
  length: z.number().min(0, "Length cannot be negative"),
  width: z.number().min(0, "Width cannot be negative"),
  height: z.number().min(0, "Height cannot be negative"),
});

// Additional charge schema
const additionalChargeSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0, "Amount cannot be negative"),
});

// Base waybill schema without refinements
const baseWaybillSchema = z.object({
  truckId: z.string().min(1, "Truck selection is required"),
  clientId: z.string().min(1, "Client selection is required"),
  
  client: z.object({
    name: z.string().min(1, "Client name is required"),
    contactPerson: z.string().optional(),
    phone: phoneSchema,
    email: emailSchema,
  }),

  shipper: z.object({
    name: z.string().min(1, "Shipper name is required"),
    address: z.string().min(1, "Shipper address is required"),
    phone: phoneSchema,
    email: emailSchema,
  }),

  consignee: z.object({
    name: z.string().min(1, "Consignee name is required"),
    address: z.string().min(1, "Consignee address is required"),
    phone: phoneSchema,
    email: emailSchema,
  }),

  origin: z.string().min(1, "Origin location is required"),
  destination: z.string().min(1, "Destination location is required"),

  cargo: z.object({
    description: z.string().min(1, "Cargo description is required"),
    type: z.string().optional(),
    weight: z.number()
      .min(0.01, "Weight must be greater than 0")
      .max(1000000, "Weight seems unusually high"),
    units: z.number()
      .min(1, "Units must be at least 1")
      .max(1000, "Units seem unusually high"),
    value: z.number()
      .min(0, "Value cannot be negative"),
    dimensions: dimensionsSchema,
    hazardous: z.boolean(),
    hazardClass: z.string().optional(),
    specialInstructions: z.string().optional(),
  }),

  pricing: z.object({
    baseRate: z.number()
      .min(0.01, "Base rate must be greater than 0"),
    additionalCharges: z.array(additionalChargeSchema),
    tax: z.number()
      .min(0, "Tax rate cannot be negative")
      .max(100, "Tax rate cannot exceed 100%"),
    total: z.number()
      .min(0, "Total cannot be negative"),
    currency: z.string()
      .min(1, "Currency is required")
      .refine((val) => ['USD', 'EUR', 'GBP', 'CAD', 'AUD'].includes(val), {
        message: "Invalid currency selection"
      }),
  }),

  pickupDate: z.string()
    .min(1, "Pickup date is required"),
  estimatedDeliveryDate: z.string()
    .min(1, "Estimated delivery date is required"),
  notes: z.string().optional(),
});

// Main waybill schema with refinements
export const waybillSchema = baseWaybillSchema.refine((data) => {
  // Validate dates are not in the past
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const pickup = new Date(data.pickupDate);
  const delivery = new Date(data.estimatedDeliveryDate);
  
  return pickup >= today && delivery >= today && delivery > pickup;
}, {
  message: "Invalid dates. Ensure pickup date is not in the past and delivery date is after pickup date",
  path: ["estimatedDeliveryDate"],
});

// Draft schema (partial version of base schema)
export const draftWaybillSchema = baseWaybillSchema.partial();

// Export types
export type WaybillFormSchema = z.infer<typeof waybillSchema>;
export type DraftWaybillFormSchema = z.infer<typeof draftWaybillSchema>;