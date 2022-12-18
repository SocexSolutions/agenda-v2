import Button from "@mui/material/Button";

import { useRouter } from "next/router";

import StatusButton from "../StatusButton/StatusButton";

import { useSelector } from "react-redux";

import { selectUser } from "../../../store/features/user";

import { getMeetingLinks } from "../../../utils/meeting-links";

import styles from "./MeetingHeader.module.scss";
export default function MeetingHeader({ meeting, children, className }) {
  const router = useRouter();
  const user = useSelector(selectUser);

  const links = getMeetingLinks(meeting);

  if (!meeting) return null;

  const isOwner = user && user._id === meeting.owner_id;

  const currentPage = router.pathname.split("/").pop();

  return (
    <div className={[styles.header, className].join(" ")}>
      {children}
      <div className={styles.header_buttons}>
        {isOwner && currentPage !== "edit" && (
          <Button onClick={() => router.push(links.edit)}>Edit</Button>
        )}
        {currentPage !== "vote" && (
          <Button onClick={() => router.push(links.vote)} color="green">
            Vote
          </Button>
        )}
        {currentPage !== "meet" && (
          <Button onClick={() => router.push(links.meet)} color="blue">
            Meet
          </Button>
        )}
        <StatusButton meeting={meeting} editable={isOwner} />
      </div>
    </div>
  );
}
