const { prompt, Confirm } = require("enquirer");

const createUser = async () => {
  let enteredPasscode = "";

  const userPrompt = await prompt([
    {
      type: "input",
      name: "name",
      message: "¿Cuál es tu nombre?",
    },
    {
      type: "input",
      name: "unisonId",
      message: "Ingresa tu número de expediente",
      validate: (unisonId) => {
        return /^(21){1}\d{1}(2){1}\d{5}$/gm.test(unisonId)
          ? true
          : "El número de expediente debe contener 9 dígitos.";
      },
    },
    {
      type: "password",
      name: "passcode",
      message: "Ingresa tu contraseña",
      validate: (passcode) => {
        if (!/^\d{4,8}$/.test(passcode)) {
          return "La contraseña debe contener solo números, y tener un mínimo de 4 dígitos y un máximo de 8.";
        }

        enteredPasscode = passcode;
        return true;
      },
    },
    {
      type: "password",
      name: "passcode",
      message: "Confirma tu contraseña",
      validate: (passcode) =>
        passcode === enteredPasscode ? true : "Las contraseñas no coinciden.",
    },
  ]);

  // POST request to API.

  const addAnother = new Confirm({
    name: "addAnother",
    message: "¿Añadir otro usuario?",
  });

  if (await addAnother.run()) createUser();
};

createUser();
