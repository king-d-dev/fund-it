import React, { useReducer } from 'react';

export default (reducer, actions, initalState) => {
  const Context = React.createContext();

  const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initalState);

    const boundActions = {};
    for (let action in actions) {
      boundActions[action] = actions[action](dispatch, state);
    }

    return (
      <Context.Provider value={{ state, ...boundActions }}>
        {children}
      </Context.Provider>
    );
  };

  return { Provider, Context };
};
