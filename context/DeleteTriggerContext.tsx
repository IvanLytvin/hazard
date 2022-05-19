import React from 'react';

type DeleteTriggerContextType<T> = [T, (docId: T) => void];

const DeleteTriggerContext = React.createContext<DeleteTriggerContextType<string> | null>(
  null
);

export const useDeleteTriggerContext = (): DeleteTriggerContextType<string> => {
  const context = React.useContext(DeleteTriggerContext);

  if (!context)
    throw new Error(
      'useDeleteTriggerContext should be used inside DeleteTriggerContextWrapper'
    );

  return context;
};

export const DeleteTriggerContextWrapper: React.FunctionComponent<
  Record<string, unknown>
> = (props) => {
  const [doc, setDoc] = React.useState<string>(null);

  const trigger = (docId: string) => setDoc(docId);

  const value: DeleteTriggerContextType<string> = React.useMemo(
    () => [doc, trigger],
    [doc]
  );

  return <DeleteTriggerContext.Provider value={value} {...props} />;
};
