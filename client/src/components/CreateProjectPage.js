import React, { useReducer, useContext } from 'react';
import { Context as projectsContext } from '../context/projectsContext';

import {
  Form,
  Header,
  TextArea,
  Select,
  Button,
  Input
} from 'semantic-ui-react';

import '../styles/CreateProjectPage.css';

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'setTitle':
      return { ...state, title: payload };
    case 'setFundTarget':
      return { ...state, fundTarget: payload };
    case 'setBIN':
      return { ...state, BIN: payload };
    case 'setReturnRate':
      return { ...state, returnRate: payload };
    case 'setReturnPeriod':
      return { ...state, returnPeriod: payload };
    case 'setCategory':
      return { ...state, category: payload };
    case 'setDescription':
      return { ...state, desciption: payload };
    default:
      return state;
  }
};

const initialState = {
  title: 'A novel Approach to Refuse collection',
  description:
    'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis odit magnam voluptatum incidunt tenetur minus eligendi temporibus rerum placeat eum. Laboriosam neque dolores placeat illo necessitatibus facilis reiciendis sapiente dicta.',
  category: 'Engineering & Manufacturing',
  BIN: 'BN1556165151',
  returnRate: '5',
  returnPeriod: 'Monthly',
  fundTarget: '5000'
};

function CreateProjectPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    state: { categories, returnsPeriods, errors },
    createProject
  } = useContext(projectsContext);

  const submitForm = () => {
    createProject(state);
  };

  const categoryOptions = categories.map((item, i) => ({
    key: i,
    value: item,
    text: item
  }));

  const returnsOptions = returnsPeriods.map((item, i) => ({
    key: i,
    value: item,
    text: item
  }));

  const showErrorProp = formField => {
    const error = errors[formField];
    if (!error || !error.length) return {};

    const message = error.join(', ');
    return {
      error: {
        content: message,
        pointing: 'below'
      }
    };
  };

  return (
    <div id="CreateProjectPage">
      <Header as="h2" style={{ marginBottom: 40 }}>
        Create a new Project
      </Header>
      <Form onSubmit={submitForm}>
        <Form.Input
          label="Project Title"
          value={state.title}
          name="title"
          onChange={e =>
            dispatch({ type: 'setTitle', payload: e.target.value })
          }
          fluid
          placeholder="Please provide project title"
          id="form-input-first-name"
          {...showErrorProp('title')}
        />

        <Form.Input
          label="Fund Target"
          value={state.fundTarget}
          name="fundTarget"
          onChange={e =>
            dispatch({ type: 'setFundTarget', payload: e.target.value })
          }
          fluid
          type="number"
          placeholder="please provide the amount needed to fund the project"
          {...showErrorProp('fundTarget')}
        />

        <Form.Input
          label="Business Identification Number"
          value={state.BIN}
          name="BIN"
          onChange={e => dispatch({ type: 'setBIN', payload: e.target.value })}
          fluid
          placeholder="please provide the unique number that was given when you registered your business"
          {...showErrorProp('BNI')}
        />

        <Form.Input
          label="Percentage of Returns Investors should expect"
          value={state.returnRate}
          name="returnRate"
          onChange={e =>
            dispatch({ type: 'setReturnRate', payload: e.target.value })
          }
          fluid
          type="number"
          placeholder="NB: as a percentage of their investment "
          {...showErrorProp('returnRate')}
        />

        <Form.Field
          label="Investors Receive returns ?"
          control={Select}
          placeholder="what time intervals do investors receive their returns"
          value={state.returnPeriod}
          name="returnPeriod"
          onChange={(e, data) =>
            dispatch({ type: 'setReturnPeriod', payload: data.value })
          }
          options={returnsOptions}
          {...showErrorProp('returnPeriod')}
        />

        <Form.Field
          label="Project Category"
          control={Select}
          placeholder="choose what category the project belongs to"
          value={state.category}
          name="category"
          onChange={(e, data) =>
            dispatch({ type: 'setCategory', payload: data.value })
          }
          options={categoryOptions}
          {...showErrorProp('category')}
        />

        <Form.Field
          label="Upload an Image for the Project"
          control={Input}
          name="photo"
          type="file"
          accept="image/*"
          {...showErrorProp('photo')}
        />

        <Form.Field
          label="Project Description"
          control={TextArea}
          name="description"
          placeholder="Please provide a short description of the project"
          value={state.description}
          onChange={e =>
            dispatch({ type: 'setDescription', payload: e.target.value })
          }
          style={{ minHeight: 100 }}
          {...showErrorProp('description')}
        />

        <Form.Field style={{ textAlign: 'center' }}>
          <Button positive>submit</Button>
        </Form.Field>
      </Form>
    </div>
  );
}

export default CreateProjectPage;
