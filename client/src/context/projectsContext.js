import createDataContext from './createDataContext';
import fundItApi from '../api/fundIt';

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'setloading':
      return { ...state, loading: payload };
    case 'setprojects':
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
  createProject: dispatch => payload => {
    dispatch({ type: 'setloading', payload: true });

    // clear all previous errors and error messages from pevious requests before proceeding
    dispatch({ type: 'seterrors', payload: {} });

    let formData = new FormData(document.getElementById('create-project'));
    formData.append(payload.returnPeriod);
    formData.append(payload.category);

    fundItApi
      .post('/create-project', formData)
      .then(({ data }) => {
        console.log(data);
        dispatch({ type: 'createProject', payload: data.projects });
      })
      .catch(({ response: { data } }) => {
        console.log('error', data);
        dispatch({ type: 'seterrors', payload: data.errors });
      })
      .finally(() => {
        dispatch({ type: 'setloading', payload: false });
      });
  }
};

const categories = [
  'Engineering & Manufacturing',
  'Science & Research',
  'Social Development',
  'Fashion & Design'
];

const projects = [
  {
    title: 'Research to cure COVID 19 ',
    targetAmount: 1500,
    raisedAmount: 100,
    createdAt: '2 days ago',
    category: categories[0],
    imgSrc: require('../images/science-project.jpg'),
    description:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis odit magnam voluptatum incidunt tenetur minus eligendi temporibus rerum placeat eum. Laboriosam neque dolores placeat illo necessitatibus facilis reiciendis sapiente dicta.'
  },
  {
    title: 'Locally manufactured car engine',
    targetAmount: 1500,
    raisedAmount: 100,
    createdAt: '13 days ago',
    category: categories[1],
    imgSrc: require('../images/engineering-proj.jpg'),
    description:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis odit magnam voluptatum incidunt tenetur minus eligendi temporibus rerum placeat eum. Laboriosam neque dolores placeat illo necessitatibus facilis reiciendis sapiente dicta.'
  },
  {
    title: 'Home made Shirts',
    targetAmount: 8000,
    raisedAmount: 200,
    createdAt: '1 days ago',
    category: categories[2],
    imgSrc: require('../images/clothing.jpg'),
    description:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis odit magnam voluptatum incidunt tenetur minus eligendi temporibus rerum placeat eum. Laboriosam neque dolores placeat illo necessitatibus facilis reiciendis sapiente dicta.'
  },
  {
    title: 'A fight against Poverty',
    targetAmount: 3000,
    raisedAmount: 20,
    createdAt: '10 days ago',
    category: categories[3],
    imgSrc: require('../images/social-proj.jpg'),
    description:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis odit magnam voluptatum incidunt tenetur minus eligendi temporibus rerum placeat eum. Laboriosam neque dolores placeat illo necessitatibus facilis reiciendis sapiente dicta.'
  }
];

const returnsPeriods = ['Weekly', 'Monthly', 'Quarterly', 'Annualy'];

const initialState = {
  projects: [...projects, ...projects],
  categories,
  returnsPeriods,
  loading: false,
  errors: {}
};

export const { Provider, Context } = createDataContext(
  reducer,
  actions,
  initialState
);
