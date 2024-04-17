import {AppBar, Divider, IconButton} from '@mui/material';
import {Container, Toolbar as MuiToolbar} from '@mui/material';

function Toolbar() {
  return (
    <AppBar position="static" color="secondary" enableColorOnDark>
      <Container maxWidth="xl">
        <MuiToolbar disableGutters >
          
        </MuiToolbar>
      </Container>
    </AppBar>
  );
}
export default Toolbar;