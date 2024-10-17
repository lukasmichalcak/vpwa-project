export interface ExampleStateInterface {
  prop: boolean;
  user: null | { firstName: string, lastName: string, username: string, email: string, password: string }; //password will be hashed later
  loginError: string;
  registrationError: string;
  commandJoin: object;
}

function state(): ExampleStateInterface {
  return {
    prop: false,
    user: null,
    loginError: '',
    registrationError: '',
    commandJoin: {},
  }
}

export default state;
