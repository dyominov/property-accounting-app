import { useDispatch, useSelector } from 'react-redux';
import useFetchGet from '@/hooks/useFetch';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { getChangedCategoryState, updateCategory } from '../../../../store/slices/document-changeMainAssetCategory-slice';

export default function SelectCategory() {
  const categoryOptions = useFetchGet('/api/GET/categories');
  const dispatch = useDispatch();

  const categoryId = useSelector(getChangedCategoryState);

  const handleChangeCategory = (event) => {
    const { value } = event.target;
    const payload = { name: 'category', value };

    dispatch(updateCategory(payload));
  };

  if (categoryOptions.isLoading) {
    return <Typography>Loading...</Typography>;
  }

  const { data: categories } = categoryOptions;

  return (
    <Box sx={{ py: 3 }}>
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Категорія
      </Typography>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="select-category-label">Категорія*</InputLabel>
        <Select
          labelId="select-category-label"
          id="select-category"
          name="category"
          value={categoryId}
          onChange={handleChangeCategory}
          label="Категорія*"
        >
          {categories.map(category => (
            <MenuItem key={category.id} value={category.id}>{category.title}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}