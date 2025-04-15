import CustomAlert from '@sharedComponents/CustomAlert';
import React, { createContext, useState } from 'react';

const ConfirmationModalContext = createContext({
  showConfirmation: () => {},
});

export const ConfirmationModalProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState({
    title: null,
    message: null,
    onConfirm: () => {},
    onCancel: () => {},
  });

  const showConfirmation = (title, message) => {
    return new Promise((resolve) => {
      setConfig({
        title,
        message,
        onConfirm: () => {
          setVisible(false);
          resolve(true);
        },
        onCancel: () => {
          setVisible(false);
          resolve(false);
        },
      });
      setVisible(true);
    });
  };

  return (
    <ConfirmationModalContext.Provider value={{ showConfirmation }}>
      {children}
      <CustomAlert
        visible={visible}
        title={config.title}
        message={config.message}
        onConfirm={config.onConfirm}
        onCancel={config.onCancel}
      />
    </ConfirmationModalContext.Provider>
  );
};

export const useConfirmationModal = () => {
  return React.useContext(ConfirmationModalContext);
};