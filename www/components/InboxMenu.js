import styles from "../styles/Inbox.module.css"
import Button from "./Button"

const InboxMenu = () => {
  return (
    <div className={styles.inboxMenuContainer}>
      <h1>Group Name</h1>
      <Button icon="doubleArrow" stretch="wide" text="Upcoming" varient="menu"/>
      <Button icon="checkBox" stretch="wide" text="Voting" varient="menu"/>
      <Button icon="cancel" stretch="wide" text="Completed" varient="menu"/>
      <div className={styles.menuDropDownsContainer}>
      <Button icon="arrow" stretch="wide" text="Priority" varient="menu"/>
      <Button icon="arrow" stretch="wide" text="Tags" varient="menu"/>
      </div>
    </div>
  )
}

export default InboxMenu
