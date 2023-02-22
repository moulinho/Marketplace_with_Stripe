import React from "react";

const FormContext = React.createContext();

let context;

//Initialize the form values and errors array
export const useFormValidation = ({ formName, defaultValues = {} }) => {
  const [formValues, setFormValues] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [isDirty, setDirty] = React.useState(false);

//Handle the change event for the input field.
  const handleOnChange = (event, value) => {
    setDirty(true);
    const val = value?.toLowerCase() ?? event.target.value;
    setFormValues((prevState) => ({
      ...prevState,
      [formName]: { ...prevState[formName], [event.target.name]: val },
    }));
  };

  const isValid = React.useMemo(
    () => Object.values(errors[formName] ?? {}).some((error) => error),
    [formValues, handleOnChange]
  );
  React.useEffect(() => register(), []);

  //Register the user in the database, if not already registered.
  const register = (values) => {
    const val = values ?? defaultValues;
    Object.entries(val).forEach(([key, value]) => {
      setFormValues((prevState) => ({
        ...defaultValues,
        [formName]: { ...prevState[formName], [key]: value },
      }));
    });
  };
  //Set the error state for the field with the given key, if it is not valid.
  const validate = async (values) =>
    Object.entries(values).forEach(([key, value]) =>
      setErrors((prevState) => ({
        ...prevState,
        [formName]: { ...prevState[formName], [key]: !value?.length },
      }))
    );

  context = React.useMemo(() => {
    return {
      errors,
      register,
      validate,
      handleOnChange,
      formValues,
      isValid: Boolean(!isValid && isDirty),
    };
  }, [formValues]);
  return context;
};

const FormProvider = ({ children }) => (
  <FormContext.Provider value={context}>{children}</FormContext.Provider>
);

export default FormProvider;
