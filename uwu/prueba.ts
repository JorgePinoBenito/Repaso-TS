//funcion para comprobar que el dni es valido con expresion regular y longitud
const checkDni1 = (dni: string): boolean => {
  const dniRegex = /^[0-9]{8}[A-Z]$/;
  //comprobar que el dni tiene 9 caracteres
  if (!dni || dni.length !== 9 || !dniRegex.test(dni)) {
    return false;
  }
  return true;
};

//funcion para comprobar que la direccion del usuario es valida
const checkDireccion = (direccion: string): boolean => {
  const direccionRegex = /^[a-zA-Z0-9\s]{2,100}$/;
  //comprobar que el dni tiene 9 caracteres
  if (
    !direccion ||
    direccion.length < 2 ||
    direccion.length > 100 ||
    !direccionRegex.test(direccion)
  ) {
    return false;
  }
  return true;
};

//funcion para comprobar que el email es valido con expresion regular y longitud
const checkEmail1 = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  //comprobar que el email tiene 9 caracteres
  if (
    !email ||
    email.length < 5 ||
    email.length > 50 ||
    !emailRegex.test(email)
  ) {
    return false;
  }
  return true;
};

//funcion para comprobar que el email es valido con expresion regular y longitud
const checkEmail2 = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  //comprobar que el email tiene 9 caracteres
  if (!email || email.length < 5 || email.length > 50) {
    return false;
  }
  //comprobar que el email es valido con expresion regular
  return emailRegex.test(email);
};

//funcion para comprobar que el telefono es valido con expresion regular y longitud
const checkPhone1 = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{9}$/;
  //comprobar que el telefono tiene 9 caracteres
  if (!phone || phone.length !== 9 || !phoneRegex.test(phone)) {
    return false;
  }
  return true;
};

//funcion para comprobar que el telefono es valido con expresion regular y longitud
const checkPhone2 = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{9}$/;
  //comprobar que el telefono tiene 9 caracteres
  if (!phone || phone.length !== 9) {
    return false;
  }
  //comprobar que el telefono es valido con expresion regular
  return phoneRegex.test(phone);
};

//funcion para comprobar que un numero es positivo
const checkPositiveNumber = (number: number): boolean => {
  //comprobar que el numero es positivo
  if (number < 0) {
    return false;
  }
  return true;
};

//funcion para comprobar que un numero es entero
const checkIntegerNumber = (number: number): boolean => {
  //comprobar que el numero es entero
  if (number % 1 !== 0) {
    return false;
  }
  return true;
};

const printYears = (rawDates: any) => {
  //comprobar que los campos requeridos existen y que los valores de los campos son validos en el array dates
  if (
    !rawDates.dates ||
    !rawDates.dates.length ||
    rawDates.dates.some(
      (date: any) =>
        !date.day ||
        !date.month ||
        !date.year ||
        !date.hour ||
        date.day < 1 ||
        date.day > 31 ||
        date.month < 1 ||
        date.month > 12 ||
        date.year < 0 ||
        date.hour < 0 ||
        date.hour > 23 ||
        //comprobar que el dni es valido
        !checkDni1(date.dni) ||
        !checkEmail1(date.email)
    )
  ) {
    throw new Error("Error: los valores de los campos no son validos");
    //lanzar un error http
    //context.response.status = 406;
    //console.log("Error en el formato de las fechas");
    //return;
  }

  /*mostrar por pantalla las fechas
  console.log(
    `Fecha: ${rawDates.day}/${rawDates.month}/${rawDates.year} ${rawDates.hour}:00`
  );*/

  //mostrar por pantalla las fechas de cada date en el array dates en formato dd/mm/yyyy hh:00
  rawDates.dates.forEach((date: any) => {
    console.log(
      `Fecha: ${date.day}/${date.month}/${date.year} ${date.hour}:00`
    );
  });
};

//leer un archivo json con deno
const dataJson = await Deno.readTextFile("./data.json");
//convertir el json a un objeto
const data = JSON.parse(dataJson);

printYears(data);
