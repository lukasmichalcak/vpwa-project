export interface ExampleStateInterface {
  prop: boolean;
  user: null | { username: string };
  loginError: string;
  registrationError: string;
}

function state(): ExampleStateInterface {
  return {
    prop: false,
    user: null,
    loginError: '',
    registrationError: '',
  }
}

export default state;
