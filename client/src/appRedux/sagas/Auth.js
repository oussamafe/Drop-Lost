import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from 'axios';
import {
  auth,
  facebookAuthProvider,
  githubAuthProvider,
  twitterAuthProvider,
  googleAuthProvider
} from "../../firebase/firebase";
import {
  SIGNIN_FACEBOOK_USER,
  SIGNIN_GITHUB_USER,
  SIGNIN_GOOGLE_USER,
  SIGNIN_TWITTER_USER,
  SIGNIN_USER,
  SIGNOUT_USER,
  SIGNUP_USER
} from "constants/ActionTypes";
import { showAuthMessage, userSignInSuccess, userSignOutSuccess, userSignUpSuccess } from "../../appRedux/actions/Auth";
import {
  userFacebookSignInSuccess,
  userGithubSignInSuccess,
  userGoogleSignInSuccess,
  userTwitterSignInSuccess
} from "../actions/Auth";
const BASE_URL=process.env.REACT_APP_API_URL

const createUserWithEmailPasswordRequest = async (nom, prenom, ville, adresse, numero, email, password) =>
  await axios.post(BASE_URL+'users/signUp', nom, prenom, ville, adresse, numero, email, password, { withCredentials: true })
    .then(authUser => authUser)
    .catch(error => error);

const signInUserWithEmailPasswordRequest = async (payload) =>
  await axios.post(BASE_URL+'users/signIn', payload, { withCredentials: true })
    .then((authUser) =>  {return authUser} )
    .catch(error => error);

const signOutRequest = async () =>
  await axios.get(BASE_URL+'users/signout', { withCredentials: true })
    .then(authUser => authUser)
    .catch(error => error);

const signInUserWithGoogleRequest = async () =>
  await auth.signInWithPopup(googleAuthProvider)
    .then(authUser => authUser)
    .catch(error => error);


const signInUserWithFacebookRequest = async () =>
  await auth.signInWithPopup(facebookAuthProvider)
    .then(authUser => authUser)
    .catch(error => error);

const signInUserWithGithubRequest = async () =>
  await auth.signInWithPopup(githubAuthProvider)
    .then(authUser => authUser)
    .catch(error => error);

const signInUserWithTwitterRequest = async () =>
  await auth.signInWithPopup(twitterAuthProvider)
    .then(authUser => authUser)
    .catch(error => error);

function* createUserWithEmailPassword({ payload }) {
  try {
    const signUpUser = yield call(createUserWithEmailPasswordRequest, payload);
    if (signUpUser.message) {
      yield put(showAuthMessage("Email already exists"));
    } else {
      yield put(userSignUpSuccess(signUpUser.data));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signInUserWithGoogle(access_token) {

  try {
    const signUpUser = yield call(signInUserWithGoogleRequest, access_token.access_token);

    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message));
    } else {
      localStorage.setItem('user_id', signUpUser.user.uid);
      yield put(userGoogleSignInSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}


function* signInUserWithFacebook() {
  try {
    const signUpUser = yield call(signInUserWithFacebookRequest);
    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message));
    } else {
      yield put(userFacebookSignInSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}


function* signInUserWithGithub() {
  try {
    const signUpUser = yield call(signInUserWithGithubRequest);
    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message));
    } else {
      yield put(userGithubSignInSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}


function* signInUserWithTwitter() {
  try {
    const signUpUser = yield call(signInUserWithTwitterRequest);
    if (signUpUser.message) {
      if (signUpUser.message.length > 100) {
        yield put(showAuthMessage('Your request has been canceled.'));
      } else {
        yield put(showAuthMessage(signUpUser.message));
      }
    } else {
      yield put(userTwitterSignInSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signInUserWithEmailPassword({ payload }) {
  try {
    const signInUser = yield call(signInUserWithEmailPasswordRequest, payload);
    if (signInUser.message) {
      yield put(showAuthMessage("Check your information or verify your account "));
    } else {
      
      localStorage.setItem('User', JSON.stringify(signInUser.data.User));
      yield put(userSignInSuccess(signInUser.data.User));

    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signOut() {
  try {
    const signOutUser = yield call(signOutRequest);
    if (signOutUser ) {
      localStorage.removeItem('User');
      this.props.isLoggedIn(false);
    } else {
      yield put(showAuthMessage(signOutUser.message));

    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

export function* createUserAccount() {
  yield takeEvery(SIGNUP_USER, createUserWithEmailPassword);
}

export function* signInWithGoogle() {
  yield takeEvery(SIGNIN_GOOGLE_USER, signInUserWithGoogle);
}

export function* signInWithFacebook() {
  yield takeEvery(SIGNIN_FACEBOOK_USER, signInUserWithFacebook);
}

export function* signInWithTwitter() {
  yield takeEvery(SIGNIN_TWITTER_USER, signInUserWithTwitter);
}

export function* signInWithGithub() {
  yield takeEvery(SIGNIN_GITHUB_USER, signInUserWithGithub);
}

export function* signInUser() {
  yield takeEvery(SIGNIN_USER, signInUserWithEmailPassword);
}

export function* signOutUser() {
  yield takeEvery(SIGNOUT_USER, signOut);
}

export default function* rootSaga() {
  yield all([fork(signInUser),
  fork(createUserAccount),
  fork(signInWithGoogle),
  fork(signInWithFacebook),
  fork(signInWithTwitter),
  fork(signInWithGithub),
  fork(signOutUser)]);
}
