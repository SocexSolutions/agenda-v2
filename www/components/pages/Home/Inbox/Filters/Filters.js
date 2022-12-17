import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";

import styles from "./Filters.module.scss";

import { getStatusNames } from "../../../../../utils/meeting-status";
import { capitalize } from "../../../../../utils/capitalize";

import { useState } from "react";

const statuses = getStatusNames();
export default function Filters({ filters, setFilters, owners }) {
  const [statusAnchor, setStatusAnchor] = useState(null);

  return (
    <div className={styles.filters_container}>
      <div className={styles.filters_inputs}>
        <TextField
          className={styles.name_input}
          label="Name"
          variant="outlined"
          size="small"
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <Autocomplete
          multiple
          className={styles.owner_input}
          options={owners}
          value={filters.owners}
          getOptionLabel={(option) => option.username}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Owner"
              variant="outlined"
            />
          )}
          onChange={(e, value) => {
            setFilters(() => ({
              ...filters,
              owners: value,
            }));
          }}
          renderTags={() => {}}
          clearIcon={null}
        />
        <Button
          className={styles.status_button}
          variant="contained"
          color="blue"
          size="medium"
          onClick={(e) => setStatusAnchor(e.currentTarget)}
        >
          Status
        </Button>
        <Menu
          anchorEl={statusAnchor}
          open={Boolean(statusAnchor)}
          onClose={() => setStatusAnchor(null)}
        >
          {statuses.map((status) => {
            return (
              <MenuItem
                key={status}
                onClick={() => {
                  setFilters({ ...filters, status });
                  setStatusAnchor(null);
                }}
              >
                {capitalize(status)}
              </MenuItem>
            );
          })}
        </Menu>
      </div>
      <div className={styles.filter_chips}>
        {filters.name && (
          <Chip
            label={`name: ${filters.name}`}
            onDelete={() => setFilters({ ...filters, name: "" })}
          />
        )}
        {filters.owners.length > 0 &&
          filters.owners.map((owner) => {
            return (
              <Chip
                key={owner._id}
                label={`owner: ${owner.username}`}
                onDelete={() => {
                  const newOwners = filters.owners.filter((o) => {
                    return o._id !== owner._id;
                  });

                  setFilters({
                    ...filters,
                    owners: newOwners,
                  });
                }}
              />
            );
          })}
        {filters.status && (
          <Chip
            label={`status: ${filters.status}`}
            onDelete={() => setFilters({ ...filters, status: "" })}
          />
        )}
      </div>
    </div>
  );
}
