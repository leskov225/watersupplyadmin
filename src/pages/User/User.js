import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { loadUsers, userListSelector } from '../../actions/users';
import EnhancedTable from '../../components/table/index';

function User({
    userList,
    loadUsers
}) {
    useEffect(() => {
        loadUsers();
    }, []);

    const columns = [
            { title: 'Name(job title)', field: 'name' },
            {
                title: 'Role',
                field: 'role',
                lookup: { 0: 'Member', 1: 'Administrator' }, 
                editable: 'never' 
            },
            { title: 'Created', field: 'created', editable: 'never' },
        ];

    return (
        <EnhancedTable 
            columns={columns}
            data={userList}
            isUserTable={true}
            isMemberTable={false}
        />
    );
}

const mapStateToProps = state => ({
    userList: userListSelector(state)
});

const mapDispatchToProps = {
    loadUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(User);