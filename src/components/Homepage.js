import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MuiAlert from '@material-ui/lab/Alert';
import VaccinesAtMoment from './VaccinesAtMoment'
import VaccinesRhythm from './VaccinesRhythm'
import ConclusionTrend from './ConclusionTrend'
import Copyright from './Copyright'
import SidebarItems from './SidebarItems'

const VACCINE_TARGET = 70
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    margin: 12,
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

const Homepage = () => {
  const classes = useStyles();
  const [openMenu, setOpenMenu] = useState(false);
  const [isLoading, setLoading] = useState(true)
  const [notification, setNotification] = useState({badge: 1, alert: false})
  const [avgVaccineDays, setAvgVaccineDays] = useState(0)
  const [remainingVaccineCount, setRemainingVaccineCount] = useState(0)
  const vaccinationByDate = useSelector(state => state.vaccinationByDate)
  const vaccinationStatistics = useSelector(state => state.vaccinationStatistics)
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  
  const fetchVaccineData = useCallback((vbd, vs) => {
    let amountOfDays = 0
    vbd.forEach(item => amountOfDays = amountOfDays + parseInt(item.count))
    setAvgVaccineDays((amountOfDays / vbd.length).toFixed(0))
    setRemainingVaccineCount(parseInt((parseInt(vs[0]["estimated_population"])*VACCINE_TARGET/100-parseInt(vs[0]["estimated_non_vaccinated_percentage"])).toFixed(0)))
    setLoading(false);
  }, []) 

  const handleMenu = () => {
    setOpenMenu(!openMenu);
  };

  useEffect(() => {
    if (
      vaccinationByDate.length > 0 &&
      vaccinationStatistics.length > 0
    ) {
      fetchVaccineData(vaccinationByDate, vaccinationStatistics)
    }
  }, [fetchVaccineData, vaccinationByDate, vaccinationStatistics])

  return(
    <div>
      {
        isLoading ?
        <div> Carregando... </div> :
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="absolute" className={clsx(classes.appBar, openMenu && classes.appBarShift)}>
            <Toolbar className={classes.toolbar}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={handleMenu}
                className={clsx(classes.menuButton, openMenu && classes.menuButtonHidden)}
              >
                <MenuIcon />
              </IconButton>
              <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                #VacinaManaus
              </Typography>
              <IconButton onClick={() => setNotification({badge: 0, alert: true})} color="inherit">
                <Badge badgeContent={notification.badge} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: clsx(classes.drawerPaper, !openMenu && classes.drawerPaperClose),
            }}
            open={openMenu}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={handleMenu}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>
              <SidebarItems />
            </List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="xl" className={classes.container}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6}>
                  <Paper className={fixedHeightPaper}>
                    <VaccinesAtMoment vaccinesApplied={vaccinationStatistics[0]["vaccinated"]} />
                  </Paper>
                  <Paper className={fixedHeightPaper}>
                    <VaccinesRhythm
                      begginigVaccination={vaccinationByDate[0]["vaccine_date"]}
                      avgVaccineDays={avgVaccineDays}
                    />
                  </Paper>
                  <Paper className={fixedHeightPaper}>
                    <ConclusionTrend
                      vaccineTarget={VACCINE_TARGET}
                      daysLeft={(remainingVaccineCount/avgVaccineDays).toFixed(0)}
                    />
                  </Paper>
                </Grid>
              </Grid>
              <Box pt={4}>
                <Copyright />
              </Box>
            </Container>
            <Snackbar
              open={notification.alert}
              autoHideDuration={5000}
              onClose={() => setNotification({...notification, alert: false })}
            >
              <MuiAlert
                severity="success"
                onClose={() => setNotification({...notification, alert: false })}
              >
                Última atualização dos dados: 27/01/2021
              </MuiAlert>
            </Snackbar>
          </main>
        </div>
      }
    </div>
  )
}

export default Homepage