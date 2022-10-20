// AIRTABLE API -uses airtable npm

// Regional Base Ids
export const gbBase = {
    naBaseId: 'appVOKLbql3ITyvNZ',
    bzBaseId: '',
    euBaseId: '',
    wBaseId: '',
    cBaseId: '',
}

// Global Table Names - table names shared by all bases - called by using base(table_name)
export const gbTable = {
    // global: {
    //     studentsTbl: 'Students',
    //     lwPurchasesTbl: 'LW Purchases'
    // },
    locations: {
        na: {
            name: '',
            id: ''
        },
        brazil: {},
        eu: {},
        world: {},
        central: {}
    },
    schoolOwners: {
        na: {
            name: 'GB NA School Owners',
            id: ''
        },
        brazil: {},
        eu: {},
        world: {},
        central: {}
    },
    students: {
        tableName: 'Students',
        naId: 'tbl3GeXNPhJ1qfBgR',
        brazilId: '',
        euId: '',
        worldId: '',
        centralId: ''
    }
}


//use if posting client id to table
// const airtableGB_NA_SchOwner_portalClientIdField = 'fld4yDXdQIs4ehiOZ'

