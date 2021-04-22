import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import EditDetails from './EditDetails'

//MUI stuff
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import IconButton from '@material-ui/core/IconButton'
import ToolTip from '@material-ui/core/ToolTip'

//Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";

//Redux
import { connect } from "react-redux";
import { logoutUser, uploadImage } from '../redux/actions/userActions'

const styles = (theme) => ({
  ...theme.profile,
  ...theme.style,
});

class Profile extends Component {
  handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append('image', image, image.name);
    this.props.uploadImage(formData)
  };
  handleEditPicture = () => {
      const fileInput = document.getElementById('imageInput');
      fileInput.click();
  }
  handleLogout = () => {
      this.props.logoutUser();
  }

  render() {
    const {
      classes,
      user: {
        credentials: { handle, createdAt, imageUrl, bio, website, location },
        loading,
        authenticated,
      },
    } = this.props;

    let profileMarkup = !loading ? (
      authenticated ? (
        <Paper className={classes.paper}>
          <div className={classes.profile}>
            <div className="image-wrapper">
              <img src={imageUrl} alt="profile" className="profile-image" />
              <input
                type="file"
                id="imageInput"
                hidden="hidden"
                onChange={this.handleImageChange}
              />
                <ToolTip title="Edit profile picture" placement="top" >
                    <IconButton onClick={this.handleEditPicture} className='button'>
                        <EditIcon color="primary"/>
                    </IconButton>
                </ToolTip>
            </div>
            <hr />
            <div className="profile-details">
              <MuiLink
                component={Link}
                to={`users/${handle}`}
                color="primary"
                variant="h5"
              >
                @{handle}
              </MuiLink>
              <hr />
              {bio && <Typography variant="body2">{bio}</Typography>}
              <hr />
              {location && (
                <Fragment>
                  <LocationOn color="primary" /> <span>{location}</span>
                  <hr />
                </Fragment>
              )}
              {website && (
                <Fragment>
                  <LinkIcon color="primary" />
                  <a href={website} target="_blank" rel="noopener noreferrer">
                    {" "}
                    {website}
                  </a>
                  <hr />
                </Fragment>
              )}
              <CalendarToday color="primary" />{" "}
              <span>Joined {dayjs(createdAt).format("MMM YYYY")} </span>
            </div>
            <ToolTip title="logout" placement='top'>
                <IconButton onClick={this.handleLogout} >
                    <KeyboardReturn color="primary" />
                </IconButton>
            </ToolTip>
            <EditDetails/>
          </div>
        </Paper>
      ) : (
        <Paper className={classes.paper}>
          <Typography cariant="body2" align="center">
            No profile found, please login here
          </Typography>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/login"
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/signup"
            >
              Signup
            </Button>
          </div>
        </Paper>
      )
    ) : (
      <p>Loading...</p>
    );

    return profileMarkup;
  }
}


const mapStateToProps = (state) => ({
    user: state.user,
});

const mapActionsToProps = { logoutUser, uploadImage };

Profile.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapActionsToProps )(withStyles(styles)(Profile));
