import React, { useReducer, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Modal,
  Form,
  Checkbox,
  Button,
  Select,
  Label,
  Input,
} from 'semantic-ui-react';

import { Context as authContext } from '../context/authContext';

const accountOptions = [
  { key: 'a', value: 'solicitor', text: 'Solicitor' },
  { key: '', value: 'investor', text: 'Investor' },
];

const idTypes = [
  { key: 'a', value: 'Voters', text: 'Voters' },
  { key: 'b', value: 'NHIS', text: 'NHIS' },
  { key: 'c', value: 'National ID', text: 'National ID' },
];

const initialState = {
  fullName: '',
  email: '',
  phoneNumber: '',
  idType: '',
  idNumber: '',
  userType: '',
  password: '',
  confirmPassword: '',
  photo: '',
  errorMessage: '',
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'setfullName':
      return { ...state, fullName: payload };
    case 'setemail':
      return { ...state, email: payload };
    case 'setphoneNumber':
      return { ...state, phoneNumber: payload };
    case 'setidType':
      return { ...state, idType: payload };
    case 'setidNumber':
      return { ...state, idNumber: payload };
    case 'setuserType':
      return { ...state, userType: payload };
    case 'setpassword':
      return { ...state, password: payload };
    case 'setconfirmPassword':
      return { ...state, confirmPassword: payload };
    case 'setphoto':
      return { ...state, photo: payload };
    default:
      return state;
  }
};

function RegiserPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, createUserAccount } = useContext(authContext);
  const reactHistory = useHistory();

  useEffect(() => {
    if (authState.token) {
      authState.user.userType === 'solicitor'
        ? reactHistory.push('/profile')
        : reactHistory.push('/projects');
      return;
    }
  }, [authState, reactHistory]);

  const showErrorProp = (formField) => {
    const error = authState.errors[formField];
    if (!error || !error.length) return {};

    const message = error.join(', ');
    return {
      error: {
        content: message,
        pointing: 'below',
      },
    };
  };

  const submitForm = (e) => {
    e.preventDefault();
    createUserAccount(state);
  };

  return (
    <Modal size="tiny" trigger={<Button positive>Register</Button>}>
      <Modal.Header>Create an Account</Modal.Header>
      <Modal.Content>
        <Form
          loading={authState.loading}
          id="register-form"
          encType="multipart/form-data"
        >
          <Form.Field
            label="Full Name"
            id="form-input-control-error-email"
            control={Input}
            name="fullName"
            placeholder="eg: Ben"
            value={state.fullName}
            onChange={(e) =>
              dispatch({ type: 'setfullName', payload: e.target.value })
            }
            {...showErrorProp('fullName')}
          />

          <Form.Field
            label="Email"
            control={Input}
            name="email"
            placeholder="eg: benparker@gmail.com"
            value={state.email}
            onChange={(e) =>
              dispatch({ type: 'setemail', payload: e.target.value })
            }
            {...showErrorProp('email')}
          />

          <Form.Field
            label="Select a Profile Picture"
            control={Input}
            name="photo"
            value={state.photo}
            onChange={(e, data) =>
              dispatch({ type: 'setphoto', payload: data.value })
            }
            type="file"
            accept="image/*"
            {...showErrorProp('photo')}
          />

          <Form.Field
            label="Select ID Type"
            control={Select}
            name="idType"
            placeholder="eg: National ID, NHIS etc"
            value={state.idType}
            onChange={(e, data) =>
              dispatch({ type: 'setidType', payload: data.value })
            }
            options={idTypes}
          />

          <Form.Field
            label="ID Number"
            control={Input}
            name="idNumber"
            placeholder="eg: GH54312030316"
            value={state.idNumber}
            onChange={(e) =>
              dispatch({ type: 'setidNumber', payload: e.target.value })
            }
            {...showErrorProp('idNumber')}
          />

          <Form.Field
            label="Phone number"
            control={Input}
            name="phoneNumber"
            placeholder="eg: 024613516"
            value={state.phoneNumber}
            onChange={(e) =>
              dispatch({ type: 'setphoneNumber', payload: e.target.value })
            }
          />

          <Form.Field
            label="I'm a"
            control={Select}
            name="userType"
            placeholder="choose one, Solicitor or Investor"
            value={state.userType}
            onChange={(e, data) =>
              dispatch({ type: 'setuserType', payload: data.value })
            }
            options={accountOptions}
          />

          <Form.Field
            label="Password"
            control={Input}
            name="password"
            placeholder="eg: *********"
            type="password"
            value={state.password}
            onChange={(e) =>
              dispatch({ type: 'setpassword', payload: e.target.value })
            }
            {...showErrorProp('password')}
          />

          <Form.Field
            label="Confirm Password"
            control={Input}
            name="confirmPassword"
            placeholder="It should match with the first one"
            type="password"
            value={state.confirmPassword}
            onChange={(e) =>
              dispatch({
                type: 'setconfirmPassword',
                payload: e.target.value,
              })
            }
            {...showErrorProp('confirmPassword')}
          />

          <Form.Group>
            <Form.Field width={11}>
              <Checkbox label="I agree to the Terms and Conditions" />
            </Form.Field>
          </Form.Group>
          <Form.Field>
            {authState.errorMessage ? (
              <Label color="red" size="large">
                {authState.errorMessage}
              </Label>
            ) : null}
          </Form.Field>
          <Button type="submit" positive onClick={submitForm}>
            Submit
          </Button>
        </Form>
        <Modal.Description></Modal.Description>
      </Modal.Content>
    </Modal>
  );
}

export default RegiserPage;
