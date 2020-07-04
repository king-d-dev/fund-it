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
        dispatch({ type: SET_PROJECTS, payload: data.projects });
      })
      .catch((error) => {
        err = error;
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
        dispatch({ type: 'createProject', payload: data.projects });
      })
      .catch(({ response: { data } }) => {
        console.log('error', data);
        if (data.errors) dispatch({ type: 'seterrors', payload: data.errors });
        else err = data.errorMessage;
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

const projects = [
  {
    title: 'Research to cure COVID 19',
    targetAmount: 1500,
    raisedAmount: 100,
    createdAt: '2 days ago',
    category: categories[0],
    imgSrc: require('../assets/images/science-project.jpg'),
    description:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis odit magnam voluptatum incidunt tenetur minus eligendi temporibus rerum placeat eum. Laboriosam neque dolores placeat illo necessitatibus facilis reiciendis sapiente dicta.',
  },
  {
    title: 'Locally manufactured car engine',
    targetAmount: 1500,
    raisedAmount: 100,
    createdAt: '13 days ago',
    category: categories[1],
    imgSrc: require('../assets/images/engineering-proj.jpg'),
    description:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis odit magnam voluptatum incidunt tenetur minus eligendi temporibus rerum placeat eum. Laboriosam neque dolores placeat illo necessitatibus facilis reiciendis sapiente dicta.',
  },
  {
    title: 'Home made Shirts',
    targetAmount: 8000,
    raisedAmount: 200,
    createdAt: '1 days ago',
    category: categories[2],
    imgSrc: require('../assets/images/clothing.jpg'),
    description:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis odit magnam voluptatum incidunt tenetur minus eligendi temporibus rerum placeat eum. Laboriosam neque dolores placeat illo necessitatibus facilis reiciendis sapiente dicta.',
  },
  {
    title: 'A fight against Poverty',
    targetAmount: 3000,
    raisedAmount: 20,
    createdAt: '10 days ago',
    category: categories[3],
    imgSrc: require('../assets/images/social-proj.jpg'),
    description:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis odit magnam voluptatum incidunt tenetur minus eligendi temporibus rerum placeat eum. Laboriosam neque dolores placeat illo necessitatibus facilis reiciendis sapiente dicta.',
  },
];

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
