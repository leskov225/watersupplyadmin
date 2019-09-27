import React from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import MaterialTable from 'material-table';
import { createOrg, deleteOrg, loadOrgs } from '../../actions/orgs';
import { createUser, deleteUser, loadUsers } from '../../actions/users';
import moment from 'moment';

function EnhancedTable({
    isUserTable,
    isMemberTable,
    columns,
    data,
    createOrg,
    deleteOrg,
    loadOrgs,
    createUser,
    deleteUser,
    loadUsers,
    history
}) {
    return (
        <MaterialTable
            title={isMemberTable ? "Members" : isUserTable ? "Users" : "Organizations"}
            columns={columns}
            data={data}
            editable={ !isMemberTable ? {
                onRowAdd: async newData => {
                    if(newData.name !== undefined){
                        if(!isUserTable) {
                            await createOrg(newData);
                            await loadOrgs();
                        }
                        else {
                            const date = moment().format('DD.MM.YYYY');
                            await createUser({role: 0, created: date, ...newData});
                            await loadUsers();
                        }
                    }
                    else {
                        alert("Name field is required!");
                    }
                },
               
                onRowDelete: async oldData => {
                    if(!isUserTable) {
                        await deleteOrg(oldData.id);
                        await loadOrgs();
                    }
                    else {
                        await deleteUser(oldData.id);
                        await loadUsers();
                    }
                }
            } : {}}
            actions={[
                {
                    icon: 'edit',
                    tooltip: 'Edit',
                    onClick: (event, rowData) => {
                        isUserTable ? history.push(`/editUser/${rowData.id}`) : history.push(`/editOrganization/${rowData.id}`)
                    }
                }
            ]}
            options={{
                headerStyle: {
                    backgroundColor: '#673ab7',
                    color: '#FFF',
                    padding: "10px"
                },
                rowStyle: {
                    backgroundColor: '#EEE',
                },
                searchFieldStyle: {
                    fontSize: "1.3rem",
                    width: "100%",
                },
            }}
        />
    )
}


const mapDispatchToProps = {
    createOrg,
    deleteOrg,
    loadOrgs,
    createUser,
    deleteUser,
    loadUsers,
};

export default connect(null, mapDispatchToProps)(withRouter(EnhancedTable));