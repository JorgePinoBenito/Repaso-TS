import * as validator from "./validation.ts";
import { date } from "./validation.ts";
import { z } from "https://deno.land/x/zod@v3.19.1/mod.ts";

const printYears = (rawDates: any) => {
  const result = validator.date(rawDates);

  //mostrar por pantalla los años de las fechas
  result.dates.forEach((date: any) => {
    console.log(date.month);
  });
};

const n: number = 10;

const data: string = await Deno.readTextFile("data.json");
const dataJson = JSON.parse(data);

printYears(dataJson);
