import { Modal, Button, Avatar } from "@mui/material";
import { CameraAlt, Edit } from "@mui/icons-material";
import styles from "./AccountModal.module.scss";
import Link from "next/link";

export default function AccountModal({ open, setOpen }) {
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className={styles.modal_container}>
        <section className={styles.main_options}>
          <div className={styles.avatar_container}>
            <Avatar
              sx={{ bgcolor: "#009688", width: 100, height: 100 }}
              className={styles.avatar_current}
            >
              ZB
            </Avatar>
            <Avatar
              className={styles.avatar_change}
              sx={{ width: 100, height: 100 }}
            >
              <CameraAlt fontSize="large" color="primary" />
            </Avatar>
          </div>
          <div className={styles.info}>
            <h1>Zach</h1>
            <span>zbarnz@yahoo.com</span>
          </div>
        </section>
      </div>
    </Modal>
  );
}
