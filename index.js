import ora from "ora";
import { Chalk } from "chalk";
import fetch from "node-fetch";
import enquirer from "enquirer";

const { prompt, Confirm, Invisible } = enquirer;

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sleep = async (ms) => {
  await timeout(ms);
};

const chalk = new Chalk({ level: 2 });

const createUser = async () => {
  console.log(`${chalk.hex("#7145D6").bold("CSI PRO DOOR ACCESS")}`);

  let spinner = ora("Iniciando...").start();

  await sleep(1500);
  spinner.stop();

  let enteredPasscode = "";

  const userPrompt = await prompt([
    {
      type: "input",
      name: "name",
      message: `¿Cuál es tu ${chalk.blue("nombre")}?`,
    },
    {
      type: "input",
      name: "unisonId",
      message: `Ingresa tu ${chalk
        .hex("#F51A9B")
        .bold("número de expediente")}`,
      validate: (unisonId) => {
        return /^(21){1}\d{1}(2){1}\d{5}$/gm.test(unisonId)
          ? true
          : `El ${chalk
              .hex("#F51A9B")
              .bold("número de expediente")} debe contener 9 dígitos.`;
      },
    },
    // {
    //   type: "password",
    //   name: "passcode",
    //   message: `Ingresa tu ${chalk.black("contraseña")}`,
    //   result: (passcode) => passcode.toUpperCase(),
    //   validate: (passcode) => {
    //     if (!/^[\dABCD]{4,8}$/gm.test(passcode.toUpperCase())) {
    //       return `La ${
    //        chalk.black("contraseña")
    //       } solo puede contener números, las letras A, B, C y D, y tener una longitud de 4 a 8 caracteres.`;
    //     }

    //     enteredPasscode = passcode;
    //     return true;
    //   },
    // },
    // {
    //   type: "password",
    //   name: "confirmPasscode",
    //   message: `Confirma tu ${chalk.black("contraseña")}`,
    //   validate: (passcode) =>
    //     passcode === enteredPasscode
    //       ? true
    //       : `Las ${chalk.black("contraseñas")} no coinciden.`,
    // },
  ]);

  const passcode = new Invisible({
    name: "passcode",
    message: `Ingresa tu ${chalk.black("contraseña")}`,
    result: (passcode) => passcode.toUpperCase(),
    validate: (passcode) => {
      if (!/^[\dABCD]{4,8}$/gm.test(passcode.toUpperCase())) {
        return `La ${chalk.black(
          "contraseña"
        )} solo puede contener números, las letras A, B, C y D, y tener una longitud de 4 a 8 caracteres.`;
      }

      return true;
    },
  });

  enteredPasscode = await passcode.run();

  const confirmPasscode = new Invisible({
    name: "confirmPasscode",
    message: `Confirma tu ${chalk.black("contraseña")}`,
    validate: (passcode) =>
      passcode.toUpperCase() === enteredPasscode
        ? true
        : `Las ${chalk.black("contraseñas")} no coinciden.`,
  });

  await confirmPasscode.run();
  const reqBody = {
    ...userPrompt,
    passcode: enteredPasscode,
  };

  spinner = ora("Creando usuario...").start();
  await sleep(1250);

  // POST request to API.
  const res = await fetch("http://localhost:3000/api/users/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  });
  spinner.stop();

  if (!res.ok) {
    console.log("Ocurrió un error al conectar con la API.");
    return;
  }

  spinner = ora("Generando nueva CSI ID...").start();
  await sleep(1250);

  spinner.stop();

  const { csiId } = await res.json();

  console.log(chalk.green("Usuario creado correctamente.\n"));
  console.log(
    `Tu ${chalk.hex("#7145D6").bold("CSI ID")} es ${chalk
      .hex("#7145D6")
      .bold(csiId)}.\n`
  );
  console.log(chalk.bgHex("#7145D6").bold("Happy hacking!\n"));
  await sleep(2000);

  const addAnother = new Confirm({
    name: "addAnother",
    message: `¿Añadir otro ${chalk.green("usuario")}?`,
  });

  if (await addAnother.run()) {
    console.log("\n\n\n\n\n\n")
    await createUser();
  }
};

createUser();
