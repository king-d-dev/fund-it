import fundItApi from '../api/fundIt';

import createDataContext from './createDataContext';

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'login':
      saveAuthSateLocally(payload);
      return { ...state, ...payload };
    case 'logout':
      localStorage.clear();
      return { ...state, token: null, user: null };
    case 'createUserAccount':
      saveAuthSateLocally(payload);
      return { ...state, ...payload };
    case 'seterrorMessage':
      return { ...state, errorMessage: payload };
    case 'seterrors':
      return { ...state, errors: payload };
    case 'setloading':
      return { ...state, loading: payload };
    default:
      return state;
  }
};

function saveAuthSateLocally({ token, user }) {
  window.localStorage.setItem('token', token);
  window.localStorage.setItem('user', JSON.stringify(user));
}

const actions = {
  logout: dispatch => () => {
    dispatch({ type: 'logout' });
  },
  login: dispatch => payload => {
    dispatch({ type: 'setloading', payload: true });

    // clear all previous errors and error messages from pevious requests before proceeding
    dispatch({ type: 'seterrorMessage', payload: null });
    dispatch({ type: 'seterrors', payload: {} });

    fundItApi
      .post('/login', { ...payload })
      .then(res => {
        // response from server is of format {token: String, user: Object}
        dispatch({ type: 'login', payload: res.data });
      })
      .catch(error => {
        let errorMessage =
          'We are facing some issues signing you in, try again after sometime';

        if (error.response && error.response.data) {
          errorMessage = error.response.data.errorMessage
            ? error.response.data.errorMessage
            : errorMessage;
        }

        dispatch({
          type: 'seterrorMessage',
          payload: errorMessage
        });
      })
      .finally(() => {
        dispatch({ type: 'setloading', payload: false });
      });
  },
  createUserAccount: dispatch => payload => {
    dispatch({ type: 'setloading', payload: true });

    // clear all previous errors and error messages before proceeding
    dispatch({ type: 'seterrorMessage', payload: null });
    dispatch({ type: 'seterrors', payload: {} });

    let formData = new FormData(document.getElementById('register-form'));
    formData.append('idType', payload.idType);

    fundItApi
      .post(`/register?userType=${payload.userType}`, formData)
      .then(({ data }) => {
        // response from server is of format {token: String, user: Object}
        dispatch({ type: 'createUserAccount', payload: data });
      })
      .catch(error => {
        console.log(error.response);
        let errorMessage =
          'We are facing some issues creating your account, try again after sometime';

        if (error.response && error.response.data) {
          const {
            response: { data }
          } = error;

          if (data.errors) {
            dispatch({ type: 'seterrors', payload: data.errors });
            return;
          } else {
            dispatch({
              type: 'seterrorMessage',
              payload: data.errorMessage ? data.errorMessage : errorMessage
            });
          }
        } else {
          if (error.response)
            errorMessage = error.response.statusText || errorMessage;

          dispatch({
            type: 'seterrorMessage',
            payload: errorMessage
          });
        }
      })
      .finally(() => {
        dispatch({ type: 'setloading', payload: false });
      });
  },
  setLoading: dispatch => payload =>
    dispatch({ type: 'setloading', loading: payload })
};

const user = JSON.parse(window.localStorage.getItem('user') || '{}');

const initialState = {
  token: window.localStorage.getItem('token'),
  user: Object.keys(user).length ? user : null,
  errorMessage: null,
  errors: {},
  loading: false
};

export const { Provider, Context } = createDataContext(
  reducer,
  actions,
  initialState
);
