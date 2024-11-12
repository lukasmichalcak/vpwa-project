export interface ExampleStateInterface {
  prop: boolean;
  user: null | {
    id: number;
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
  channels: object[];
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
    channels: [],
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
