import * as React from 'react';
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';

export default function ButtonAppBar({toggleShow, showLeaderboard, signInWithGoogle, auth, user, name}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" onClick={() => toggleShow()}>
            {showLeaderboard ? 'Hide' : 'Show'} Leaders
          </Button>

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
