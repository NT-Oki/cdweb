import { useState, useCallback, useEffect } from 'react';
import {
  Box, Card, Table, Button, TableBody, Typography,
  TableContainer, TablePagination, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { DashboardContent } from '../../../layouts/dashboard';
import { Iconify } from '../../../components/iconify';
import { Scrollbar } from '../../../components/scrollbar';
import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../user-table-row';
import axios from 'axios';
import API_URLS from '../../../../../config/api';

// ----------------------------------------------------------------------

export function UserView() {
  const table = useTable();
  const [users, setUsers] = useState<UserProps[]>([]);
  const [filterName, setFilterName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const fetchUsers = () => {
    const token = localStorage.getItem('token');
    axios
        .get(API_URLS.ADMIN_USER.list, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUsers(res.data);
        })
        .catch((err) => {
          console.error('Failed to fetch users:', err);
        });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      address: '',
      gender: '',
      role: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Bắt buộc'),
      email: Yup.string().email('Email không hợp lệ').required('Bắt buộc'),
      password: Yup.string()
          .required('Bắt buộc')
          .min(8, 'Mật khẩu phải ít nhất 8 ký tự'),
      confirmPassword: Yup.string()
          .required('Bắt buộc')
          .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp'),
      phoneNumber: Yup.string().required('Bắt buộc'),
      address: Yup.string().required('Bắt buộc'),
      gender: Yup.string().required('Bắt buộc'),
      role: Yup.string().required('Bắt buộc'),
    }),
    onSubmit: (values) => {
      const token = localStorage.getItem('token');
      setLoading(true);
      axios
          .post(API_URLS.ADMIN_USER.add, values, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            fetchUsers();
            handleCloseDialog();
          })
          .catch((err) => {
            console.error('Create user failed:', err);
          })
          .finally(() => {
            setLoading(false);
          });
    },
  });

  const dataFiltered: UserProps[] = applyFilter({
    inputData: users,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleDeleteSelected = () => {
    const token = localStorage.getItem('token');
    if (table.selected.length === 0) return;

    setLoading(true);
    axios
        .delete(API_URLS.ADMIN_USER.deleteMultiple, {
          headers: { Authorization: `Bearer ${token}` },
          data: table.selected ,  // Gửi danh sách id cần xóa trong body
        })
        .then(() => {
          fetchUsers();
          table.onSelectAllRows(false, []); // bỏ chọn tất cả sau khi xóa
        })
        .catch((err) => {
          console.error('Delete users failed:', err);
        })
        .finally(() => {
          setLoading(false);
        });
  };

  return (
      <DashboardContent>
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Users
          </Typography>
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="mingcute:add-line" />} onClick={handleOpenDialog}>
            New user
          </Button>
        </Box>

        <Card>
          <UserTableToolbar
              numSelected={table.selected.length}
              filterName={filterName}
              onFilterName={(e) => {
                setFilterName(e.target.value);
                table.onResetPage();
              }}
              onDeleteSelected={() => setConfirmDeleteOpen(true)}
          />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                    order={table.order}
                    orderBy={table.orderBy}
                    rowCount={users.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                        table.onSelectAllRows(checked, users.map((u) => u.id))
                    }
                    headLabel={[
                      { id: 'name', label: 'Họ và tên' },
                      { id: 'email', label: 'Email' },
                      { id: 'phoneNumber', label: 'Số điện thoại' },
                      { id: 'address', label: 'Địa chỉ' },
                      { id: 'role', label: 'Vai trò' },
                      { id: 'gender', label: 'Giới tính' },
                      { id: 'status', label: 'Trạng thái' },
                      { id: '', label: '', align: 'right' },
                    ]}
                />
                <TableBody>
                  {dataFiltered
                      .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
                      .map((row) => (
                          <UserTableRow
                              key={row.id}
                              row={row}
                              selected={table.selected.includes(row.id)}
                              onSelectRow={() => table.onSelectRow(row.id)}
                          />
                      ))}

                  <TableEmptyRows height={68} emptyRows={emptyRows(table.page, table.rowsPerPage, users.length)} />
                  {notFound && <TableNoData searchQuery={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
              component="div"
              page={table.page}
              count={users.length}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>

        {/* Dialog thêm user */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Thêm người dùng</DialogTitle>
          <form onSubmit={formik.handleSubmit}>
            <DialogContent>
              <TextField fullWidth margin="normal" label="Họ tên" {...formik.getFieldProps('name')} error={formik.touched.name && !!formik.errors.name} helperText={formik.touched.name && formik.errors.name} />
              <TextField fullWidth margin="normal" label="Email" {...formik.getFieldProps('email')} error={formik.touched.email && !!formik.errors.email} helperText={formik.touched.email && formik.errors.email} />
              <TextField
                  fullWidth
                  margin="normal"
                  label="Mật khẩu"
                  type="password"
                  {...formik.getFieldProps('password')}
                  error={formik.touched.password && !!formik.errors.password}
                  helperText={formik.touched.password && formik.errors.password}
              />
              <TextField
                  fullWidth
                  margin="normal"
                  label="Xác nhận mật khẩu"
                  type="password"
                  {...formik.getFieldProps('confirmPassword')}
                  error={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              />
              {/*<TextField fullWidth margin="normal" label="Email" {...formik.getFieldProps('email')} error={formik.touched.email && !!formik.errors.email} helperText={formik.touched.email && formik.errors.email} />*/}
              <TextField fullWidth margin="normal" label="Số điện thoại" {...formik.getFieldProps('phoneNumber')} error={formik.touched.phoneNumber && !!formik.errors.phoneNumber} helperText={formik.touched.phoneNumber && formik.errors.phoneNumber} />
              <TextField fullWidth margin="normal" label="Địa chỉ" {...formik.getFieldProps('address')} error={formik.touched.address && !!formik.errors.address} helperText={formik.touched.address && formik.errors.address} />
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, paddingLeft: 1 }}>
                <Typography sx={{ mr: 2, paddingBottom: 1 }}>Giới tính:</Typography>
                <label style={{ marginLeft: '60px' }}>
                  <input
                      type="radio"
                      name="gender"
                      value="false"
                      // checked={formik.values.gender === 'false'}
                      onChange={formik.handleChange}
                  />
                  Nữ
                </label>
                <label style={{ marginLeft: '130px', marginTop: 1 }}>
                  <input
                      type="radio"
                      name="gender"
                      value="true"
                      // checked={formik.values.gender === 'true'}
                      onChange={formik.handleChange}
                  />
                  Nam
                </label>
              </Box>
              {formik.touched.gender && formik.errors.gender && (
                  <Typography variant="caption" color="error">
                    {formik.errors.gender}
                  </Typography>
              )}
              <TextField
                  select
                  fullWidth
                  margin="normal"
                  label="Vai trò"
                  {...formik.getFieldProps('role')}
                  SelectProps={{ native: true }}
                  error={formik.touched.role && !!formik.errors.role}
                  helperText={formik.touched.role && formik.errors.role}
              >
                <option value=""></option>
                <option value="ROLE_USER">User</option>
                <option value="ROLE_ADMIN">Admin</option>
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Hủy</Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            <Typography>Bạn có chắc chắn muốn xóa {table.selected.length} người dùng đã chọn không?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDeleteOpen(false)}>Hủy</Button>
            <Button
                onClick={() => {
                  setConfirmDeleteOpen(false);
                  handleDeleteSelected();
                }}
                variant="contained"
                color="error"
                disabled={loading}
            >
              {loading ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogActions>
        </Dialog>
      </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback((id: string) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  }, [order, orderBy]);

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    setSelected(checked ? newSelecteds : []);
  }, []);

  const onSelectRow = useCallback((inputValue: string) => {
    setSelected((prev) =>
        prev.includes(inputValue)
            ? prev.filter((v) => v !== inputValue)
            : [...prev, inputValue]
    );
  }, []);

  const onResetPage = useCallback(() => setPage(0), []);
  const onChangePage = useCallback((_e: unknown, newPage: number) => setPage(newPage), []);
  const onChangeRowsPerPage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  }, []);

  return {
    page, order, onSort, orderBy, selected,
    rowsPerPage, onSelectRow, onResetPage,
    onChangePage, onSelectAllRows, onChangeRowsPerPage,
  };
}
