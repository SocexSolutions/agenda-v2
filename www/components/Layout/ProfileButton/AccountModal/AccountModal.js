import { Modal, Button, Avatar } from "@mui/material";
import styles from "./AccountModal.module.scss";

export default function AccountModal({ open, setOpen }) {
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className={styles.modal_container}>
        <section className={styles.main_options}>
          <div className={styles.avatar}>
            <Avatar sx={{ bgcolor: "#009688", width: 100, height: 100 }}>ZB</Avatar>
            <h1>Zach</h1>
          </div>
        </section>
      </div>
    </Modal>
  );
}
