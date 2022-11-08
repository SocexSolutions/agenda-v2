import AddCircleIcon from "@mui/icons-material/AddCircle";

import { Chip } from "@mui/material";

import IconTextField from "../IconTextField/IconTextField";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import useDebounce from "../../../hooks/use-debounce";

import styles from "./ChipForm.module.css";

/**
 * Form for editing chip arrays
 *
 * @param {string} itemKey - key unique among chips that will be displayed
 * @param {string} itemName - singular type of items (eg. participant)
 * @param {Function} selector - store selector for items to display
 * @param {Function} validate - validation fn to run on itemKeys
 * @param {string} validateMsg - error message to show when validation fails
 * @param {Function} create - async function to create a new item in the form
 * given a `payload` as a param
 * @param {Function} destroy - async function to delete an item in the form
 * given an `id` as a param
 */
function ChipForm({
  itemName,
  itemKey,
  selector,
  validate,
  validateMsg,
  create,
  destroy,
}) {
  const items = useSelector(selector);

  const [input, setInput] = useState("");
  const [formError, setFormError] = useState("");

  const debouncedInput = useDebounce(input);

  useEffect(() => {
    const checkInput = () => {
      setFormError("");

      if (!input) {
        return;
      }

      if (!validate(debouncedInput)) {
        setFormError(validateMsg);
        return;
      }

      const duplicates = items.filter((item) => {
        return item[itemKey] === debouncedInput;
      });

      if (duplicates.length) {
        setFormError(`${itemName}s with duplicate ${itemKey}s`);
        return;
      }
    };

    checkInput();
  }, [debouncedInput]);

  const createChip = async () => {
    if (!validate(input)) {
      return;
    }

    const duplicates = items.filter((item) => {
      return item[itemKey] === input;
    });

    if (duplicates.length) {
      return;
    }

    create({ [itemKey]: input });
    setInput("");
  };

  function destroyChip(index) {
    const [toDelete] = items.splice(index, 1);

    destroy(toDelete);
  }

  function handleEnter(event) {
    if (event.key === "Enter") {
      createChip();
    }
  }

  const chips = [];

  if (items?.length) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      chips.push(
        <Chip
          className={styles.chip}
          label={item[itemKey]}
          key={item[itemKey]}
          variant="outlined"
          onDelete={() => destroyChip(i)}
        />
      );
    }
  }

  return (
    <>
      <div className={styles.chip_container}>{chips}</div>
      <div className={styles.input_container}>
        <IconTextField
          label={`Add ${itemName}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleEnter}
          size="small"
          Icon={AddCircleIcon}
          onIconClick={createChip}
          error={!!formError}
          helperText={formError}
        />
      </div>
    </>
  );
}

export default ChipForm;
