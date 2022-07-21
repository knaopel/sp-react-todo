import * as React from 'react';
import {
  ChangeEvent,
  MouseEvent,
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import styles from './TodoForm.module.scss';
import ITodoFormProps from './ITodoFormProps';
import { PrimaryButton, TextField } from 'office-ui-fabric-react';

const TodoForm: FunctionComponent<ITodoFormProps> = (props) => {
  const placeholderText: string = 'Enter your todo';
  const { onAddTodoItem } = props;
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const {
      target: { value: newValue },
    } = e;
    setInputValue(newValue);
  };

  const handleAddButtonClick = (
    event?: MouseEvent<HTMLButtonElement>
  ): void => {
    onAddTodoItem(inputValue);
    setInputValue('');
  };

  return (
    <div className={styles.todoForm}>
      <TextField
        className={styles.textField}
        value={inputValue}
        placeholder={placeholderText}
        autoComplete='off'
        onChange={handleInputChange}
      />{' '}
      <div className={styles.addButtonCell}>
        <PrimaryButton
          className={styles.addButton}
          ariaLabel='Add a todo task'
          onClick={handleAddButtonClick}
        >
          Add
        </PrimaryButton>
      </div>
    </div>
  );
};

export default TodoForm;
