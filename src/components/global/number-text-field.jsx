import { TextField } from "@mui/material";
// import InputNumber from '@kensoni/react-input-number';

const invalidChars = [
  "-",
  "+",
  "e",
];

export default function NumberTextField(props) {
  const { onKeyDown, min, max, ...restProps } = props;

  const handleKeyDown = (event) => {
    if (invalidChars.includes(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <TextField type="number" size="small" {...restProps} variant="standard" inputProps={{ min, max }} onKeyDown={handleKeyDown}/>
  );
}