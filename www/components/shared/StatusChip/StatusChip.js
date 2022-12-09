import Chip from "@mui/material/Chip";
import { getStatusInfo } from "../../../utils/status";
import { capitalize } from "../../../utils/capitalize";

export default function StatusChip({ status, ...props }) {
  const { color } = getStatusInfo({ status });
  return <Chip label={capitalize(status)} color={color} {...props} />;
}
