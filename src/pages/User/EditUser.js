import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { loadUser, updateUser, userSelector } from '../../actions/users';
import { loadOrgs, orgListSelector } from '../../actions/orgs';

import { isLoading } from '../../actions/loading';
import * as yup from 'yup'
import { Formik } from 'formik';
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { CustomButton } from '../../components/buttons/index';

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1,
        width: "100%",
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        paddingBottom: "40px"
    },
    textField: {
        margin: theme.spacing(1,1,1,0),
        width: "100%",
        fontSize: '2.4rem'
    },
    textHalfField: {
        margin: theme.spacing(1,1,1,0),
        width: "50%",
        fontSize: '2.4rem'
    },
    selectField: {
        margin: theme.spacing(1,1,1,0),
        width: "40%",
        fontSize: '2.4rem',
    },
    emailField: {
        margin: theme.spacing(1,1,1,0),
        width: "40%",
        fontSize: '2.4rem',
    },
    label: {
        color: "black",
        fontWeight: 800,
        fontSize: "1.5rem",
        padding: theme.spacing(1, 1, 1, 1),
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
          width: 600
        }
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
    button: {
        padding: theme.spacing(1, 1, 1, 1),
        paddingRight: 0,
        float: "right"
    },
    table: {
        padding: theme.spacing(1, 1, 1, 1),
    }
}));

export const userValidationSchema = yup.object().shape({
	name: yup.string().required('Name is required!'),
    address: yup.string().required(),
    plz: yup.string().required(),
});

const emptyUser = {
    address: '',
    plz: '',
    active: false,
    administrator: false,
    org_id: '',
    is_org_admin: false
};

function EditUser({
    loadUser,
    getUser,
    updateUser,
    orgList,
    loadOrgs,
    match,
    loading
}) {
    const classes = useStyles();
    const id = match.params.id;
    const user = getUser(id) || emptyUser;

    const [values, setValues] = React.useState({
        email: '',
        organization: user.org_id,
        isOrgAdmin: user.is_org_admin
    });

    useEffect(() => {
        loadUser(id);
        loadOrgs();
    }, []);

    useEffect(() => {
        setValues({
            organization: user.org_id,
            isOrgAdmin: user.is_org_admin
        });
    }, [user, orgList]);

    const handleChange = name => event => {
        setValues({ ...values, [name]: (name == 'isOrgAdmin') ? event.target.checked : event.target.value });
    };

    const sendInvitation = () => {
        console.log("email", values.email);
    }

    const removeOrg = async () => {
        await updateUser({
            ...user,
            org_id: '-1',
            is_org_admin: false
        });
        setValues({
            organization: '-1',
            isOrgAdmin: false
        });
    }

    const changeOrg = async () => {
        console.log(values.organization)
        if(values.organization == undefined || values.organization == -1)
        {
            alert("Select an organization");
        }
        else {
            await updateUser({
                ...user,
                org_id: values.organization,
                is_org_admin: values.isOrgAdmin
            });
        }
    }

    return (
        <div className={classes.grow}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <Formik
                        initialValues={user}
                        validationSchema={userValidationSchema}
                        onSubmit={async (values, actions) => {
                            actions.setSubmitting(true);
                            values.role = values.administrator ? 1 : 0;
                            await updateUser({
                                ...user,
                                ...values
                            });
                            await loadUser(id);
                            actions.setSubmitting(false);
                        }}
                        render={props => (
                            <form className={classes.container} noValidate autoComplete="off" onSubmit={props.handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={9}>
                                        <div className={classes.label}>
                                            <span>User - {user.name}</span>
                                        </div>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <div className={classes.button}>
                                            <CustomButton
                                                text="Update User"
                                                type="submit"
                                                disabled={props.isSubmitting || !props.isValid}
                                            />
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <Paper className={classes.paper}>
                                            <TextField
                                                id="name"
                                                name="name"
                                                label="Name"
                                                className={classes.textField}
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.name && props.errors.name)}
                                                helperText={props.touched.name ? props.errors.name : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.name}
                                            />
                                            <TextField
                                                id="address"
                                                name="address"
                                                label="Address"
                                                className={classes.textField}
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.address && props.errors.address)}
                                                helperText={props.touched.address ? props.errors.address : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.address}
                                            />
                                            <TextField
                                                id="plz"
                                                name="plz"
                                                label="PLZ"
                                                className={classes.textField}
                                                margin="normal"
                                                variant="outlined"
                                                error={Boolean(props.touched.plz && props.errors.plz)}
                                                helperText={props.touched.plz ? props.errors.plz : ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.plz}
                                            />                
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Paper className={classes.paper}>
                                            <FormControlLabel
                                                value="active"
                                                name="active"
                                                label="Active"
                                                className={classes.selectField}
                                                control={
                                                    <Checkbox 
                                                        color="primary" 
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        checked={props.values.active}
                                                    />
                                                }
                                            />
                                            <FormControlLabel
                                                value="administrator"
                                                name="administrator"
                                                label="Administrator"
                                                className={classes.selectField}
                                                control={
                                                    <Checkbox 
                                                        color="primary" 
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        checked={props.values.administrator}
                                                    />
                                                }
                                            />
                                            <TextField
                                                id="email"
                                                label="Email"
                                                className={classes.emailField}
                                                margin="normal"
                                                variant="outlined"
                                                value={values.email}
                                                onChange={handleChange('email')}
                                            />
                                            <div className={classes.button}>
                                                <CustomButton
                                                    text="Send Invitation"
                                                    onClick={sendInvitation}
                                                />
                                            </div>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    />
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <div className={classes.label}>
                                    <span>Organization</span>
                                </div>
                                <TextField
                                    select
                                    id="Organization"
                                    label="organization"
                                    className={classes.textHalfField}                          
                                    margin="normal"
                                    variant="outlined"
                                    value={values.organization}
                                    onChange={handleChange('organization')}
                                >
                                    {orgList.map(org => (
                                        <MenuItem key={org.id} value={org.id}>
                                            {org.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <div className={classes.button}>
                                    <CustomButton
                                        text="Remove"
                                        color="secondary"
                                        onClick={removeOrg}
                                    />
                                </div>
                                <div className={classes.button}>
                                    <CustomButton
                                        text="Change"
                                        onClick={changeOrg}
                                    />
                                </div>
                                <FormControlLabel
                                    value="isOrgAdmin"
                                    name="active"
                                    label="Organization Administrator"
                                    className={classes.selectField}
                                    control={
                                        <Checkbox 
                                            color="primary" 
                                            checked={values.isOrgAdmin}
                                            value={values.isOrgAdmin}
                                            onChange={handleChange('isOrgAdmin')}
                                        />
                                    }
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            )}
        </div>
    )   
};

const mapStateToProps = state => ({
    getUser(id) {
        return userSelector(id)(state)
    },
    loading: isLoading(loadUser)(state),
    orgList: orgListSelector(state)
});

const mapDispatchToProps = {
    updateUser,
    loadUser,
    loadOrgs
};

export default connect(mapStateToProps, mapDispatchToProps)(EditUser);
