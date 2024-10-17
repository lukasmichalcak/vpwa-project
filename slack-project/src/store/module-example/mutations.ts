import { MutationTree } from 'vuex';
import { ExampleStateInterface } from './state';

const mutation: MutationTree<ExampleStateInterface> = {

  SET_USER(state, user) {
    if (state.user) {
      state.user.firstName = user.firstName;
      state.user.lastName = user.lastName;
      state.user.username = user.username;
      state.user.email = user.email;
      state.user.password = user.password // will be hashed later
    }
  },

  SET_FIRST_NAME(state, firstName){
    if (state.user){
      state.user.firstName = firstName;
    }
  },

  SET_LAST_NAME(state, lastName){
    if (state.user){
      state.user.lastName = lastName;
    }
  },

  SET_USERNAME(state, username){
    if (state.user){
      state.user.username = username;
    }
    else {
      state.user = {firstName: 'John', lastName: 'Doe', username: username, email:'examplemail@gmail.com', password: '1234'} // password will be hashed later
      // this is an ugly solution, until we have a database there is nothing to do
    }
  },

  SET_EMAIL(state, email){
    if (state.user){
      state.user.email = email;
    }
  },

  SET_PASSWORD(state, password){
    if (state.user){
      state.user.password = password;
    }
  },

  SET_USER_NULL(state){
    state.user = null;
  },

  SET_LOGIN_ERROR(state, error) {
    state.loginError = error;
  },

  SET_REGISTRATION_ERROR(state, error) {
    state.registrationError = error;
  },

  SET_GENERIC_USERS(state, genericUsers){
    state.genericUsers = genericUsers;
  }
};

export default mutation;
