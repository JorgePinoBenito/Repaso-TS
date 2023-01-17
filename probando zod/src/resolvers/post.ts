import { RouterContext } from "oak/router.ts";
import { SlotSchema } from "../db/schemas.ts";
import { Slot } from "../types.ts";
import { slotsCollection } from "../db/mongo.ts";
import { z, ZodError, ZodType } from "zod";
import * as validator from "./validation.ts";

type PostAddSlotContext = RouterContext<
  "/addSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

// months are 0-indexed, so 0 is January, 1 is February, etc.
/*const isValidDate = (
  year: number,
  month: number,
  day: number,
  hour: number
): boolean => {
  const date = new Date(year, month, day, hour);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day &&
    date.getHours() === hour
  );
};*/

/*const DateSchema = z.object({
  year: z.number().positive().int(),
  month: z.number().min(1).max(12).int(),
  day: z.number().min(1).max(31).int(),
  hour: z.number().min(0).max(23).int(),
  available: z.boolean(),
  dni: z
    .string()
    .min(1)
    .max(9)
    .regex(/^[0-9]{8,9}[A-Za-z]$/),
});*/

//type Date = z.infer<typeof DateSchema>;

export const addSlot = async (context: PostAddSlotContext): Promise<void> => {
  const params = await context.request.body({ type: "json" }).value;
  let validatedSlot;
  try {
    validatedSlot = validator.validatepostSlot(params);

    if (
      !validatedSlot.day ||
      !validatedSlot.month ||
      !validatedSlot.year ||
      !validatedSlot.hour
    ) {
      context.response.status = 406;
      return;
    }

    //const { day, month, year, hour } = value;

    /*if (!isValidDate(year, month - 1, day, hour)) {
      context.response.status = 406;
      return;
    }*/

    // check if slot is already booked
    const foundSlot = await slotsCollection.findOne({ validatedSlot });
    if (foundSlot) {
      if (!foundSlot.available) {
        context.response.status = 409;
        return;
      } else {
        context.response.status = 200;
        return;
      }
    }

    const slot: Partial<Slot> = {
      ...validatedSlot,
      available: true,
    };

    await slotsCollection.insertOne(slot as SlotSchema);
    const { _id, ...slotWithoutId } = slot as SlotSchema;
    context.response.body = slotWithoutId;
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};
