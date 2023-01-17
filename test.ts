import { Collection } from "mongo";
import { z, ZodError, ZodObject, ZodRawShape, ZodType } from "zod";
import * as lodash from "lodash";
import { UsersCollection } from "../db/db.ts";

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

const parse = <T>(zod: ZodType<T>) => (data: any) => {
  const x = zod.safeParse(data);
  if (!x.success) {
    throw formatValidationError(x.error);
  }
  return x.data;
};

const parseAsync = <T>(zod: ZodType<T>) => async (data: any) => {
  const x = await zod.safeParseAsync(data);
  if (!x.success) {
    throw formatValidationError(x.error);
  }
  return x.data;
};

export const mongoUniqueParser = <T extends ZodRawShape, S>(
  collection: Collection<S>,
  keys: (keyof T)[],
  zod: ZodObject<T>,
) => {
  return zod.refine(async (obj) => {
    const result = await collection.findOne(lodash.pick(obj, keys));
    return result === undefined;
  });
};

export const usernameParser = z
  .string({ required_error: "El nombre de usuario es obligatorio" })
  .regex(
    /^[a-zA-Z0-9]{4,}$/,
    {
      message: "El nombre de usuario debe contener al menos 4 caracteres," +
        " incluyendo mayúsculas, minúsculas y números",
    },
  );

export const passwordParser = z
  .string({ required_error: "La contraseña es obligatoria" })
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    {
      message:
        "La contraseña debe contener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números",
    },
  );

export const createUser = parseAsync(
  mongoUniqueParser(
    UsersCollection,
    ["username"],
    z.object({
      username: usernameParser,
      password: passwordParser,
    }),
  ),
);
