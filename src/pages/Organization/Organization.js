import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import EnhancedTable from '../../components/table/index';
import { loadOrgs, orgListSelector } from '../../actions/orgs';

function Organization({
    orgList,
    loadOrgs
}) {
    useEffect(() => {
        loadOrgs();
    }, []);

    const columns = [
            { title: 'Name(job title)', field: 'name' },
            { title: 'P L Z', field: 'plz' },
            { title: 'Address', field: 'address' },
            { title: 'Members', field: 'members', editable: 'never' },
        ];

    return (
        <EnhancedTable 
            columns={columns}
            data={orgList}
            isUserTable={false}
            isMemberTable={false}
        />
    );
}

const mapStateToProps = state => ({
    orgList: orgListSelector(state)
});

const mapDispatchToProps = {
    loadOrgs
};

export default connect(mapStateToProps, mapDispatchToProps)(Organization);
