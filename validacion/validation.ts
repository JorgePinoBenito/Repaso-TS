import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { z, ZodError, ZodType } from "https://deno.land/x/zod@v3.19.1/mod.ts";

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

export const usernameParser = z
  .string({ required_error: "El nombre de usuario es obligatorio" })
  .regex(/^[a-zA-Z0-9]{4,}$/, {
    message:
      "El nombre de usuario debe contener al menos 4 caracteres," +
      " incluyendo mayúsculas, minúsculas y números",
  });

export const passwordParser = z
  .string({ required_error: "La contraseña es obligatoria" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      "La contraseña debe contener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números",
  });

const langParser = z.string({ required_error: "No se encontró el idioma" });

export const pageParser = z
  .number()
  .positive({ message: "La página debe ser positiva" });

export const perPageParser = z
  .number()
  .gte(10, {
    message:
      "Elementos por página deben ser mayor o igual a 10 y menor o igual a 200",
  })
  .lte(200, {
    message:
      "Elementos por página deben ser mayor o igual a 10 y menor o igual a 200",
  });

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

const parseAsync =
  <T>(zod: ZodType<T>) =>
  async (data: any): Promise<T> => {
    const x = await zod.safeParseAsync(data);
    if (!x.success) {
      throw formatValidationError(x.error);
    }
    return x.data;
  };

export const pruebaParser2 = z
  .string()
  .length(9, { message: "El DNI debe tener 8 caracteres y una letra al final" })
  .regex(/^[0-9]{8,9}[A-Za-z]$/, {
    message: "El DNI debe tener 8 caracteres y una letra al final",
  })
  //no se puede repetir el usuario en la base de datos
  .refine(
    async (v) => {
      const userExist = await UsersCollection.findOne({ dni: v });
      return !userExist;
    },
    { message: "El DNI ya existe en la base de datos" }
  );

export const date = parseAsync(
  z.object({
    dates: z.array(
      z.object({
        year: yearParser,
        month: monthParser,
        day: dayParser,
        hour: hourParser,
        available: z.boolean(),
        dni: pruebaParser2,
      })
    ),
  })
);

export const objectIdParser = z.string().refine(
  (v) => {
    try {
      new ObjectId(v);
      return true;
    } catch {
      return false;
    }
  },
  { message: "Formato de ID inválido" }
);

export const sendMessage = parse(
  z.object({
    userreceiver: objectIdParser,
    content: z.string().min(1, {
      message: "El contenido del mensaje no puede estar vacío",
    }),
  })
);

export const login = parse(
  z.object({
    usernameParser,
    passwordParser,
  })
);

export const createUser = parse(
  z.object({
    username: usernameParser,
    password: passwordParser,
  })
);

export const getMessages = parse(
  z.object({
    page: pageParser,
    perPage: perPageParser,
  })
);

export const lang = parse(langParser);
