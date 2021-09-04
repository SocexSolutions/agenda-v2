import styles from "../styles/Attendies.module.css";
import Chip from "./Chip";
import Input from "./Input";
function Attendies() {
  return (
    <div className={styles.attbox}>
      <div className={styles.attW}>
        <h2>Attendies</h2>
        Owner
        <Chip text="Tom Hudson" icon={true}/>
        <br />
        Participant(s)
        <div className={styles.atts}>
          <Chip text="Rando" icon={true} editing={true}/>
          <Chip text="David Oligney" icon={true} editing={true}/>
          <Chip text="Zach Barnes" icon={true} editing={true}/>
        </div>
        <br />
        Add Participant
        <Input placeholder="Email"/>
      </div>
    </div>
  );
}

export default Attendies;
