import { z } from "https://deno.land/x/zod@v3.19.1/mod.ts";
import { formatValidationError } from "./validation.ts";
import { ZodError } from "https://deno.land/x/zod@v3.19.1/ZodError.ts";

const DateSchema = z.object({
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
});

type Date = z.infer<typeof DateSchema>;

const printYears = (rawDates: Date) => {
  // Sirve pero es muy largo y tiene un try.
  try {
    const dates = DateSchema.parse(rawDates);
    console.log(dates.year);
  } catch (e) {
    if (e instanceof ZodError) {
      console.log(formatValidationError(e));
    } else {
      throw e;
    }
  }

  //manera de hacerlo con if invertido - no tiene sentido
  let result = DateSchema.safeParse(rawDates);
  if (result.success) {
    const dates = result.data;
    console.log(dates);
  } else {
    console.log(formatValidationError(result.error));
  }

  // Formato correcto.
  result = DateSchema.safeParse(rawDates);
  if (!result.success) {
    throw formatValidationError(result.error);
  }
  const dates = result.data;
  console.log(dates.year);
};

const data: string = await Deno.readTextFile("data.json");
const dataJson: Date = JSON.parse(data);

printYears(dataJson);
