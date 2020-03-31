import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Label } from 'semantic-ui-react';

import { Context as authContext } from '../context/authContext';

function SignOut() {
  const { logout } = useContext(authContext);
  let [redirect, setRedirect] = useState(false);

  useEffect(() => {
    logout();
    setRedirect(true);
  }, [logout, redirect]);

  return (
    <div>
      <Label>Please wait while we log you out</Label>
      {redirect ? <Redirect to="/" /> : null}
    </div>
  );
}

export default SignOut;
