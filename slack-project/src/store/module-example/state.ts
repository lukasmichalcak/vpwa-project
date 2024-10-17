export interface ExampleStateInterface {
  prop: boolean;
  user: null | { firstName: string, lastName: string, username: string, email: string, password: string }; //password will be hashed later
  genericUsers: null | { firstName: string, lastName: string, username: string, email: string, password: string }[];
  loginError: string;
  registrationError: string;
}

function state(): ExampleStateInterface {
  return {
    prop: false,
    user: null,
    genericUsers: null,
    loginError: '',
    registrationError: '',
  }
}

export default state;
