import React, { useEffect } from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { loadOrg, updateOrg, orgSelector } from '../../actions/orgs';
import { loadUsers, userListSelector } from '../../actions/users';
import { isLoading } from '../../actions/loading';
import * as yup from 'yup'
import { Formik } from 'formik';
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { CustomButton } from '../../components/buttons/index';
import EnhancedTable from '../../components/table/index';

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
    textplzField: {
        margin: theme.spacing(1,1,1,0),
        width: "50%",
        fontSize: '2.4rem',
    },
    textactiveField: {
        margin: theme.spacing(1,1,1,0),
        fontSize: '2.4rem'
    },
    label: {
        color: "black",
        fontWeight: 800,
        fontSize: "1.5rem",
        padding: theme.spacing(1, 1, 1, 1),
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
          width: "100%"
        }
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
    button: {
        paddingBottom: theme.spacing(1, 1, 1, 1),
        float: 'right'
    },
    table: {
        padding: theme.spacing(1, 1, 1, 1),
    }
}));

const subscriptions = [
    {
      value: 'free',
      label: 'Free',
    },
    {
      value: 'standard',
      label: 'Standard',
    },
    {
      value: 'advanced',
      label: 'Advanced',
    },
];
const columns = [
    { title: 'Name(job title)', field: 'name' },
    {
        title: 'Role',
        field: 'role',
        lookup: { 0: 'Member', 1: 'Administrator' },
    },
    { title: 'Created', field: 'created' },
];

export const orgValidationSchema = yup.object().shape({
	name: yup.string().required('Name is required!'),
    address: yup.string().required(),
    plz: yup.string().required(),
    subscription: yup.string().required(),
    iban: yup.string().required(),
    bic: yup.string().required()
});

const emptyOrg = {
    address: '',
    plz: '',
    active: false,
    subscription: '',
    iban: '',
    bic: ''
};

function EditOrganization({
    loadOrg,
    getOrg,
    updateOrg,
    userList,
    loadUsers,
    match,
    loading
}) {
    const classes = useStyles();
    const id = match.params.id;
    const org = getOrg(id) || emptyOrg;
    useEffect(() => {
        loadOrg(id);
        loadUsers();
    }, []);
    const member = userList.filter(user => user.org_id === id);
    return (
        <div className={classes.grow}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Formik
                    initialValues={org}
                    validationSchema={orgValidationSchema}
                    onSubmit={async (values, actions) => {
                        actions.setSubmitting(true);
                        await updateOrg({
                            ...org,
                            ...values
                        });
                        await loadOrg(id);
                        actions.setSubmitting(false);
                    }}
                    render={props => (
                        <form className={classes.container} noValidate autoComplete="off" onSubmit={props.handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={9}>
                                    <div className={classes.label}>
                                        <span>Organization - {org.name}</span>
                                    </div>
                                </Grid>
                                <Grid item xs={3}>
                                    <div className={classes.button}>
                                        <CustomButton
                                            text="Update Organization"
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
                                            margin="normal"
                                            variant="outlined"
                                            className={classes.textField}
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
                                            className={classes.textplzField}
                                            margin="normal"
                                            variant="outlined"
                                            error={Boolean(props.touched.plz && props.errors.plz)}
                                            helperText={props.touched.plz ? props.errors.plz : ''}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.plz}
                                        />
                                        <FormControlLabel
                                            value="active"
                                            name="active"
                                            className={classes.textactiveField}
                                            label="Active"
                                            control={
                                                <Checkbox
                                                    color="primary"
                                                    onChange={props.handleChange}
                                                    onBlur={props.handleBlur}
                                                    checked={props.values.active}
                                                />
                                            }
                                        />
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper className={classes.paper}>
                                        <TextField
                                            select
                                            id="subscription"
                                            name="subscription"
                                            label="Subscription"
                                            className={classes.textField}
                                            margin="normal"
                                            variant="outlined"
                                            error={Boolean(props.touched.subscription && props.errors.subscription)}
                                            helperText={props.touched.subscription ? props.errors.subscription : ''}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.subscription || ''}
                                        >
                                            {subscriptions.map(subscription => (
                                                <MenuItem key={subscription.value} value={subscription.value}>
                                                    {subscription.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        <TextField
                                            id="iban"
                                            name="iban"
                                            label="IBAN"
                                            className={classes.textField}
                                            margin="normal"
                                            variant="outlined"
                                            error={Boolean(props.touched.iban && props.errors.iban)}
                                            helperText={props.touched.iban ? props.errors.iban : ''}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.iban}
                                        />
                                        <TextField
                                            id="bic"
                                            name="bic"
                                            label="BIC"
                                            className={classes.textField}
                                            margin="normal"
                                            variant="outlined"
                                            error={Boolean(props.touched.bic && props.errors.bic)}
                                            helperText={props.touched.bic ? props.errors.bic : ''}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.bic}
                                        />
                                    </Paper>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                />
            )}
            <EnhancedTable 
                className={classes.table}
                columns={columns}
                data={member}
                isUserTable={true}
                isMemberTable={true}
            />
        </div>
    )   
    
};

const mapStateToProps = state => ({
    getOrg(id) {
        return orgSelector(id)(state)
    },
    loading: isLoading(loadOrg)(state),
    userList: userListSelector(state)
});

const mapDispatchToProps = {
    updateOrg,
    loadOrg,
    loadUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditOrganization));
