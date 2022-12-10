import { Modal } from "@mui/material";
import { Checkbox } from "@mui/material";
import { Box } from "@mui/material";
import { Chip } from "@mui/material";

import styles from "./ActionItemModal.module.scss";

export default function ActionItemModal({
  actionItem,
  open,
  onClose,
  toggleActionItemCompletion,
}) {
  if (!actionItem) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.modal_container}>
        <Box
          sx={{
            padding: "1em",
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <Checkbox
            color="blue"
            checked={actionItem.completed}
            onChange={(e) => {
              toggleActionItemCompletion(e, actionItem);
            }}
          />
          <Box sx={{ padding: "0.5em", paddingLeft: "1em" }}>
            <h3>{actionItem.name}</h3>
            <Box sx={{ width: "100%" }}>
              <p>{actionItem.description}</p>
            </Box>
            <Box sx={{ width: "100%" }}>
              {actionItem.assigned_to.map((assignee) => {
                return (
                  <Chip
                    sx={{ marginRight: ".5em" }}
                    key={assignee}
                    size="small"
                    label={assignee}
                  />
                );
              })}
            </Box>
          </Box>
        </Box>
      </div>
    </Modal>
  );
}
