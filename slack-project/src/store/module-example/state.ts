export interface ExampleStateInterface {
  prop: boolean;
  user: null | {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  };
  genericUsers:
    | null
    | {
        firstName: string;
        lastName: string;
        username: string;
        email: string;
        password: string;
      }[];
  token: string | null;
  messages: object[];
  unfinished_messages: object[];
  loginError: string;
  registrationError: string;
  commandJoin: null | object;
  commandQuit: null | string;
  commandCancel: null | string;
}

function state(): ExampleStateInterface {
  return {
    prop: false,
    user: null,
    genericUsers: null,
    token: null,
    messages: [],
    unfinished_messages: [],
    loginError: '',
    registrationError: '',
    commandJoin: null,
    commandQuit: null,
    commandCancel: null,
  };
}

export default state;
