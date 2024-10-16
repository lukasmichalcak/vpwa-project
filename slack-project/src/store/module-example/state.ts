export interface ExampleStateInterface {
  prop: boolean;
  user: null | { firstName: string, lastName: string, username: string, email: string, password: string }; //password will be hashed later
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
