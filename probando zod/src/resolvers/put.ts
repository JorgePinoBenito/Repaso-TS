import { ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { slotsCollection } from "../db/mongo.ts";
import { SlotSchema } from "../db/schemas.ts";
import * as validator from "./validation.ts";

type PutBookSlotContext = RouterContext<
  "/bookSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const bookSlot = async (context: PutBookSlotContext) => {
  const params = await context.request.body().value;
  let validatedSlot;
  try {
    validatedSlot = validator.validateputSlot(params);
    if (
      !validatedSlot.year ||
      !validatedSlot.month ||
      !validatedSlot.day ||
      !validatedSlot.hour ||
      !validatedSlot.dni
    ) {
      context.response.status = 406;
      return;
    }
    //params = validator.validateputSlot(value);
    //const { year, month, day, hour, dni } = value;

    const citacondnirepetido = await slotsCollection.findOne({
      dni: validatedSlot.dni,
    });
    if (citacondnirepetido) {
      context.response.status = 404;
      context.response.body = {
        message: "Ya existe una cita con ese DNI",
      };
      return;
    }

    const slot = await slotsCollection.findOne({
      year: validatedSlot.year,
      month: validatedSlot.month,
      day: validatedSlot.day,
      hour: validatedSlot.hour,
      available: true,
    });
    if (!slot) {
      context.response.status = 404;
      return;
    }
    const dni = validatedSlot.dni;
    await slotsCollection.updateOne(
      { _id: slot._id },
      { $set: { available: false, dni } }
    );
    context.response.status = 200;
    const { _id, ...rest } = slot;
    context.response.body = { ...rest, available: false, dni };
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};
