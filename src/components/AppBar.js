import * as React from 'react';
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';

export default function ButtonAppBar({signInWithGoogle, auth, user, name}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {name}
          </Typography>
          {!user && (
            <Button color="inherit" onClick={() => signInWithGoogle()}>Login</Button>
          )}
          {user && (
            <Button color="inherit" onClick={() => auth.signOut()}>Logout</Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
