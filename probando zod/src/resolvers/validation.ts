import { ObjectId } from "mongo";
import { z, ZodError, ZodType } from "zod";
import { slotsCollection } from "../db/mongo.ts";

const parse = (zod: ZodType) => (data: any) => {
  const x = zod.safeParse(data);
  if (!x.success) {
    throw formatValidationError(x.error);
  }
  return x.data;
};

const parseplantilla =
  <T>(zod: ZodType<T>) =>
  (data: any): T => {
    const x = zod.safeParse(data);
    if (!x.success) {
      throw formatValidationError(x.error);
    }
    return x.data;
  };

const parseAsync =
  <T>(zod: ZodType<T>) =>
  async (data: any): Promise<T> => {
    const x = await zod.safeParseAsync(data);
    if (!x.success) {
      throw formatValidationError(x.error);
    }
    return x.data;
  };

export const formatValidationError = (err: ZodError): Error => {
  const f: any = err.format();
  let s = f._errors.join("\n");
  for (const k in f) {
    if (k === "_errors") {
      continue;
    }
    if (f[k]._errors.length > 0) {
      if (s !== "") {
        s += "\n";
      }
      s += `Field ${k}: ` + f[k]._errors.join(", ");
    }
  }
  return new Error(s);
};

export const yearParser = z
  .number()
  .positive({ message: "El año debe ser positivo" })
  .int({ message: "El año debe ser un número entero" })
  .gte(0, {
    message: "El año debe ser mayor o igual a 0 y menor o igual a 2022",
  })
  .lte(2022, {
    message: "El año debe ser mayor o igual a 0 y menor o igual a 2022",
  });

export const monthParser = z
  .number()
  .positive({ message: "El mes debe ser positivo" })
  .int({ message: "El mes debe ser un número entero" })
  .gte(1, {
    message: "El mes debe ser mayor o igual a 1 y menor o igual a 12",
  })
  .lte(12, {
    message: "El mes debe ser mayor o igual a 1 y menor o igual a 12",
  });

export const dayParser = z
  .number()
  .positive({ message: "El dia debe ser positivo" })
  .int({ message: "El dia debe ser un número entero" })
  .gte(1, {
    message: "El dia debe ser mayor o igual a 1 y menor o igual a 31",
  })
  .lte(31, {
    message: "El mes debe ser mayor o igual a 1 y menor o igual a 31",
  });

export const hourParser = z
  .number()
  //comprobar si contiene hora

  .positive({ message: "El dia debe ser positivo" })
  .int({ message: "El dia debe ser un número entero" })
  .gte(0, {
    message: "La hora debe ser mayor o igual a 0 y menor o igual a 23",
  })
  .lte(23, {
    message: "La hora debe ser mayor o igual a 0 y menor o igual a 23",
  });

export const dniParser = z
  .string()
  .length(9, { message: "El DNI debe tener 8 caracteres y una letra al final" })
  .regex(/^[0-9]{8,9}[A-Za-z]$/, {
    message: "El DNI debe tener 8 caracteres y una letra al final",
  });

export const validategetSlot = parseplantilla(
  z.object({
    year: yearParser.optional(),
    month: monthParser.optional(),
    day: dayParser.optional(),
    //lanzar codigo de error 403
  })
);

export const validateputSlot = parseplantilla(
  z.object({
    year: yearParser.optional(),
    month: monthParser.optional(),
    day: dayParser.optional(),
    hour: hourParser.optional(),
    dni: dniParser.optional(),
  })
);

export const validatepostSlot = parseplantilla(
  z.object({
    year: yearParser.optional(),
    month: monthParser.optional(),
    day: dayParser.optional(),
    hour: hourParser.optional(),
  })
);

export const validatedeleteSlot = parseplantilla(
  z.object({
    year: yearParser.optional(),
    month: monthParser.optional(),
    day: dayParser.optional(),
    hour: hourParser.optional(),
  })
);

/*if (!value?.day || !value?.month || !value?.year || !value?.hour) {
      context.response.status = 406;
      return;
    }*/
