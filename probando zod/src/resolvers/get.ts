import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { slotsCollection } from "../db/mongo.ts";
import { SlotSchema } from "../db/schemas.ts";
import * as validator from "./validation.ts";
type GetAvailabeSlotsContext = RouterContext<
  "/availableSlots",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const availableSlots = async (context: GetAvailabeSlotsContext) => {
  const params = getQuery(context, { mergeParams: true });
  let validatedSlot;
  try {
    validatedSlot = validator.validategetSlot(params);
    if (!validatedSlot.year || !validatedSlot.month) {
      context.response.status = 403;
      return;
    }

    //const { year, month, day } = params;

    if (!validatedSlot.day) {
      const slots = await slotsCollection
        .find({
          year: validatedSlot.year,
          month: validatedSlot.month,
          available: true,
        })
        .toArray();
      context.response.body = context.response.body = slots.map((slot) => {
        const { _id, ...rest } = slot;
        return rest;
      });
    } else {
      const slots = await slotsCollection
        .find({
          year: validatedSlot.year,
          month: validatedSlot.month,
          day: validatedSlot.day,
          available: true,
        })
        .toArray();
      context.response.body = slots.map((slot) => {
        const { _id, ...rest } = slot;
        return rest;
      });
    }
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};
