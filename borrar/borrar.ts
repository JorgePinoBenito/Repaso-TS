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

const printYears = (dates: Date) => {
  //manera de hacerlo con try catch, parse y formatValidationError
  try {
    DateSchema.parse(dates);
    console.log(dates.year);
  } catch (e) {
    console.log(formatValidationError(e));
  }

  //manera de hacerlo con if-else y safeParse
  if (DateSchema.safeParse(dates).success) {
    console.log(dates.year);
  } else {
    console.log("Bad data");
  }

  //manera de hacerlo con if, safeParse y formatValidationError -> mejor manera limpia y segura
  const x = DateSchema.safeParse(dates);
  if (!x.success) {
    throw formatValidationError(x.error);
  }
  console.log(x.data.year);
  return x.data;
};

const data: string = await Deno.readTextFile("data.json");
const dataJson: Date = JSON.parse(data);

printYears(dataJson);
