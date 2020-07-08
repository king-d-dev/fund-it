import createDataContext from './createDataContext';
import fundItApi from '../api/fundIt';
import {
  SET_ERRORS,
  SET_ERROR_MESSAGE,
  CREATE_PROJECT,
  SET_PROJECTS,
} from './actionsTypes/projects';

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'setloading':
      return { ...state, loading: payload };
    case SET_PROJECTS:
      return { ...state, projects: payload };
    case 'createProject':
      return { ...state, projects: payload };
    case 'seterrors':
      return { ...state, errors: payload };
    default:
      return state;
  }
};

const actions = {
  getProjects: (dispatch) => (filters, callback) => {
    let err;

    fundItApi
      .get('/projects', { params: filters })
      .then(({ data }) => {
        // console.log(data);
        dispatch({ type: SET_PROJECTS, payload: data.data });
      })
      .catch((error) => {
        err = error;
      })
      .finally(() => {
        if (callback) callback(err);
      });
  },

  getUserProjects: (dispatch) => (userId, callback) => {
    let err;

    fundItApi
      .get(`/user/${userId}/projects`)
      .then(({ data }) => {
        dispatch({ type: SET_PROJECTS, payload: data.projects });
      })
      .catch((error) => {
        err = error?.response?.data;
      })
      .finally(() => {
        if (callback) callback(err);
      });
  },

  getProjectInvestors: (dispatch) => (projectId, callback) => {
    let err;

    fundItApi
      .get(`/projects/${projectId}/investors`)
      .then(({ data }) => {
        callback(null, data);
      })
      .catch((error) => {
        err = String(error);
      })
      .finally(() => {
        if (callback) callback(err);
      });
  },

  createProject: (dispatch) => (payload, callback) => {
    let err;
    dispatch({ type: 'setloading', payload: true });

    // clear all previous errors and error messages from pevious requests before proceeding
    dispatch({ type: 'seterrors', payload: {} });

    let formData = new FormData(document.getElementById('create-project'));
    formData.append('returnPeriod', payload.returnPeriod);
    formData.append('category', payload.category);

    fundItApi
      .post('/create-project', formData)
      .then(({ data }) => {
        console.log('done with', data);
        // dispatch({ type: 'createProject', payload: data.projects });
      })
      .catch((error) => {
        if (error.response.data.errors)
          dispatch({
            type: 'seterrors',
            payload: error.response.data.errors,
          });
        else err = error.response.data.errorMessage;
      })
      .finally(() => {
        if (callback) callback(err);
      });
  },
};

const categories = [
  'Engineering & Manufacturing',
  'Science & Research',
  'Social Development',
  'Fashion & Design',
];

const projects = [];

const returnsPeriods = ['Weekly', 'Monthly', 'Quarterly', 'Annualy'];

const initialState = {
  projects: projects,
  categories,
  returnsPeriods,
  loading: false,
  errors: {},
};

export const { Provider, Context } = createDataContext(
  reducer,
  actions,
  initialState
);
