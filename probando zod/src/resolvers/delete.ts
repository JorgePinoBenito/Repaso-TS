import { RouterContext } from "oak/router.ts";
import { ObjectId } from "mongo";
import { slotsCollection } from "../db/mongo.ts";
import { getQuery } from "oak/helpers.ts";
import * as validator from "./validation.ts";

type RemoveSlotContext = RouterContext<
  "/removeSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const removeSlot = async (context: RemoveSlotContext) => {
  const params = getQuery(context, { mergeParams: true });
  let validatedSlot;
  try {
    validatedSlot = validator.validatedeleteSlot(params);
    if (
      !validatedSlot.year ||
      !validatedSlot.month ||
      !validatedSlot.day ||
      !validatedSlot.hour
    ) {
      context.response.status = 406;
      return;
    }
    //const { year, month, day, hour } = params;
    const slot = await slotsCollection.findOne({
      year: validatedSlot.year,
      month: validatedSlot.month,
      day: validatedSlot.day,
      hour: validatedSlot.hour,
    });
    if (!slot) {
      context.response.status = 404;
      return;
    }
    if (!slot.available) {
      context.response.status = 403;
      return;
    }

    await slotsCollection.deleteOne({ _id: slot._id });
    context.response.status = 200;
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};
