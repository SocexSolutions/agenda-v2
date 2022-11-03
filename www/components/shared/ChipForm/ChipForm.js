import { useStore } from "../../../store";
import { notify } from "../../../store/features/snackbar";

import AddCircleIcon from "@mui/icons-material/AddCircle";

import { Chip } from "@mui/material";

import IconTextField from "../IconTextField/IconTextField";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import styles from "./ChipForm.module.css";

/**
 * Form for editing chip arrays
 *
 * @param {String} itemKey - key unique among chips that will be displayed
 * @param {String} itemName - singular type of items (eg. participant)
 * @param {Function} getAll - async function to fetch all items that should be
 * displayed in the form
 * @param {Function} create - async function to create a new item in the form
 * given a `payload` as a param
 * @param {Function} destroy - async function to delete an item in the form
 * given an `id` as a param
 */
function ChipForm({ itemName, itemKey, selector, getAll, create, destroy }) {
  const items = useSelector(selector);
  const store = useStore();

  const [input, setInput] = useState("");
  const [initLoad, setInitLoad] = useState(true);

  useEffect(() => {
    if (initLoad) {
      getAll();
      setInitLoad(false);
    }
  }, [initLoad]);

  const createChip = async (key) => {
    const duplicates = items.filter((item) => {
      return item[itemKey] === key;
    });

    if (duplicates.length) {
      store.dispatch(
        notify({
          message: `${itemName}s with duplicate ${itemKey}s`,
          type: "danger",
        })
      );

      return;
    }

    create({ [itemKey]: key });
  };

  function destroyChip(index) {
    const [toDelete] = items.splice(index, 1);

    destroy(toDelete);
  }

  function handleEnter(event) {
    if (event.key === "Enter") {
      handleSubmit();
    }
  }

  function handleSubmit() {
    if (input) {
      createChip(input);
      setInput("");
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
          onIconClick={handleSubmit}
        />
      </div>
    </>
  );
}

export default ChipForm;
