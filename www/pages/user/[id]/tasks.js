import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Checkbox from "@mui/material/Checkbox";
import Fade from "@mui/material/Fade";
import Chip from "@mui/material/Chip";

import ActionItemModal from "../../../components/pages/Tasks/ActionItemModal/ActionItemModal";

import actionItemStore from "../../../store/features/action-item";
import { notify } from "../../../store/features/snackbar";
import { useStore } from "../../../store";

import useDebounce from "../../../hooks/use-debounce";

import shared from "../../../styles/Shared.module.css";
import styles from "../../../styles/pages/user/[id]/tasks.module.scss";

import client from "../../../api/client";

import { useState, useEffect } from "react";

import { useSelector } from "react-redux";

export default function ActionItems() {
  const store = useStore();

  const user = useSelector((state) => state.user);

  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);
  const [statusAnchor, setStatusAnchor] = useState(null);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [actionItems, setActionItems] = useState([]);
  const [actionItemId, setActionItemId] = useState(null);
  const [filters, setFilters] = useState({ completed: false });

  const debouncedFilters = useDebounce(filters, 250);

  const load = async () => {
    const limit = rowsPerPage;
    const skip = limit * page;

    try {
      const res = await client.get(`/user/${user._id}/actionitems`, {
        params: { ...filters, skip, limit },
      });

      setActionItems(res.data.action_items);
      setCount(res.data.count);
      setLoading(false);
    } catch (err) {
      notify({
        message: "Failed to fetch action items: " + err.message,
        type: "danger",
      });

      setLoading(false);
    }
  };

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    setActionItemId(null);
  };

  const toggleActionItemCompletion = async (e, actionItem) => {
    await store.dispatch(
      actionItemStore.actions.update({
        ...actionItem,
        completed: e.target.checked,
      })
    );

    load();

    setActionItemId(null);
  };

  const updateWindowDimensions = () => {
    const newHeight = window.innerHeight - 410;

    setRowsPerPage(Math.floor(newHeight / 64));
  };

  useEffect(() => {
    updateWindowDimensions();
  }, []);

  useEffect(() => {
    load();
  }, [debouncedFilters, page, rowsPerPage]);

  useEffect(() => {
    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  return (
    <Fade in={!loading}>
      <div className={shared.page}>
        <div className={shared.container}>
          <h2 className={shared.page_title}>My Action Items</h2>
          <Box sx={{ width: "100%", marginBottom: "1em" }}>
            <Button
              variant="contained"
              color="blue"
              onClick={(e) => setStatusAnchor(e.currentTarget)}
            >
              Status
            </Button>
            <Menu
              anchorEl={statusAnchor}
              open={Boolean(statusAnchor)}
              onClose={() => setStatusAnchor(null)}
            >
              <MenuItem
                onClick={() => {
                  setFilters({ ...filters, completed: false });
                  setStatusAnchor(null);
                }}
              >
                To Do
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setFilters({ ...filters, completed: true });
                  setStatusAnchor(null);
                }}
              >
                Completed
              </MenuItem>
            </Menu>
          </Box>
          <Box sx={{ width: "100%", marginBottom: "1em" }}>
            {Object.entries(filters).map(([key, value]) => {
              return (
                <Chip
                  key={key}
                  label={`${key}: ${value}`}
                  onDelete={() => {
                    const newFilters = Object.entries(filters).reduce(
                      (acc, [k, v]) => {
                        if (k !== key) acc[k] = v;
                        return acc;
                      },
                      {}
                    );

                    setFilters(newFilters);
                  }}
                />
              );
            })}
          </Box>
          <div className={styles.table_container}>
            <TableContainer key={rowsPerPage}>
              <Table>
                <TableHead>
                  <TableRow className={styles.table_header}>
                    <TableCell>Completed</TableCell>
                    <TableCell>Action Item</TableCell>
                    <TableCell>Assigned To</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {actionItems.map((actionItem) => (
                    <TableRow
                      key={actionItem._id}
                      onClick={() => {
                        setActionItemId(actionItem._id);
                      }}
                      className={styles.table_row}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="blue"
                          checked={actionItem.completed || false}
                          onChange={(e) => {
                            toggleActionItemCompletion(e, actionItem);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell>{actionItem.name}</TableCell>
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[rowsPerPage]}
              component="div"
              count={count}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
            />
          </div>
        </div>
        <ActionItemModal
          open={!!actionItemId}
          onClose={() => setActionItemId(null)}
          actionItem={actionItems.find((a) => {
            return a._id === actionItemId;
          })}
          toggleActionItemCompletion={toggleActionItemCompletion}
        />
      </div>
    </Fade>
  );
}
