import { Modal, Button, Avatar } from "@mui/material";
import { CameraAlt, Edit } from "@mui/icons-material";
import styles from "./AccountModal.module.scss";
import Link from "next/link";

import { useState } from "react";

import client from "../../../../api/client";

import { userLogin } from "../../../../store/features/user";
import { notify } from "../../../../store/features/snackbar";

export default function AccountModal({ open, setOpen, user }) {
  



  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className={styles.modal_container}>
        <section className={styles.main_options}>
          <div className={styles.avatar_container}>
            <Avatar
              sx={{ bgcolor: "#009688", width: 100, height: 100 }}
              className={styles.avatar_current}
            >
              {}
              {/* <input              //Will need this for image upload in future 
                type="file"
                className={styles.file_upload}
                accept="image/*"
                onChange={handleUpload}
              /> */}
            </Avatar>
            <Avatar
              className={styles.avatar_change}
              sx={{ width: 100, height: 100 }}
            >
              <CameraAlt fontSize="large" color="primary" />
            </Avatar>
          </div>
          <div className={styles.info}>
            <h1>{user.username}</h1>
            <span>{user.email}</span>
          </div>
          <div className={styles.account_options}>
            <h3>Account Options:</h3>
            <Link href="#">
              <a>Change password</a>
            </Link>
            <Link href="#">
              <a>Delete account</a>
            </Link>
          </div>
        </section>
      </div>
    </Modal>
  );
}
