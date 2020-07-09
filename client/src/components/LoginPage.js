import React, { useState, useContext, useEffect } from 'react';
import { Modal, Form, Button, Input, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { Context as authContext } from '../context/authContext';

function LoginPage() {
  const [email, setEmail] = useState('benparker@gmail.com');
  const [password, setPassword] = useState('12345678');
  const { state: authState, login } = useContext(authContext);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      setEmail('');
      setPassword('');
    }
  }, []);

  function submitForm(e) {
    e.preventDefault();
    login({ email, password });
  }

  return (
    <Modal size="tiny" trigger={<Button>Login</Button>}>
      <Modal.Header>Login In to your account</Modal.Header>
      <Modal.Content>
        <Form onSubmit={submitForm} loading={authState.loading}>
          <Form.Field
            label="Email"
            control={Input}
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Form.Field
            label="Password"
            control={Input}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Form.Group>
            <Form.Field width={11}></Form.Field>
            <Form.Field>
              <strong>
                <Link to="/forgot-password">Forgot Password ?</Link>
              </strong>
            </Form.Field>
          </Form.Group>

          <Form.Field>
            {authState.errorMessage ? (
              <Label color="red" size="large">
                {authState.errorMessage}
              </Label>
            ) : null}
          </Form.Field>

          <Button type="submit" positive>
            Submit
          </Button>
        </Form>
        <Modal.Description></Modal.Description>
      </Modal.Content>
    </Modal>
  );
}

export default LoginPage;
