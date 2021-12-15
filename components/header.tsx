import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";

// TODO: Min height in MUI is set to 64 so don't go lower than this, make it so I can though
export const headerHeight = 65;

export default function Header() {
  return (
    <AppBar position="relative">
      <Toolbar id="toolbar" sx={{ height: headerHeight }}>
        {/* TODO: Better icon */}
        <EmojiPeopleIcon sx={{ mr: 2 }} />
        {/* TODO: Better name */}
        <Typography variant="h6" color="inherit" noWrap>
          MyLife
        </Typography>
        <Box component="div" sx={{ flexGrow: 1 }} />
        <Box component="div" sx={{ display: "flex" }}>
          <IconButton size="large" color="inherit">
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton size="large" edge="end" color="inherit">
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
