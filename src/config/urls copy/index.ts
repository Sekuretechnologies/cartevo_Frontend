import * as APPURLS from '.';

export type URLType = { [key: string]: string };

// ALL APP ROUTES
export const rootUrl = '/';
export const dashboardRootUrlV1 = '/dashboard/v1';

const URLConfig = {
    root: rootUrl,
    notFound: `/not-found`,
    dashboard:dashboardRootUrlV1,
    
    //   Comptes utilisateurs
    dashboardHome: {
        ...dashboardHome(),
    },

    //   Comptes utilisateurs
    usersAccounts: {
        ...usersAccounts(),
    },
    //   Transactions wallet
    walletTransactions: {
        ...walletTransactions(),
    },
    //   Transfert d'argent
    transferts: {
        ...transferts(),
    },
    //   Cartes
    cards: {
        ...cards(),
    },
    //   Verifications KYC
    kyc: {
        ...kyc(),
    },
    //   Gains
    profit: {
        ...profit(),
    },
    //   Administration
    administration: {
        ...administration(),
    },
    //   Notifications
    notifications: {
        ...notifications(),
    },
    //   Paramètres généraux
    generalSettings: {
        ...generalSettings(),
    },
    //   Login
    login: '/login',

    // Admin Module
    // ADMIN: {
    // ...APPURLS.admin(URL_PREFIX.ADMIN),
    // },
};

export default URLConfig;



function dashboardHome(prefix:string='') {
    const PATH = `${dashboardRootUrlV1}/home`;        
    return {
        root:PATH
    }
}

function usersAccounts(prefix:string='') {
    const PATH = `${dashboardRootUrlV1}/users_accounts`;        
    return {
        root:PATH,
        manage:`${PATH}/manage`
    }
}

function walletTransactions(prefix:string='') {
    const PATH = `${dashboardRootUrlV1}/wallet_transactions`;        
    return {
        root:PATH,                    
    }
}

function transferts(prefix:string='') {
    const PATH = `${dashboardRootUrlV1}/transferts`;        
    return {
        root:PATH,                    
    }
}

function cards(prefix:string='') {
    const PATH = `${dashboardRootUrlV1}/cards`;        
    return {
        root:PATH,
        manage:`${PATH}/manage`
    }
}

function kyc(prefix:string='') {
    const PATH = `${dashboardRootUrlV1}/kyc`;        
    return {
        root:PATH,                    
    }
}

function profit(prefix:string='') {
    const PATH = `${dashboardRootUrlV1}/profit`;        
    return {
        root:PATH,                    
    }
}

function administration(prefix:string='') {
    const PATH = `${dashboardRootUrlV1}/administration`;        
    return {
        root:PATH,                    
    }
}

function notifications(prefix:string='') {
    const PATH = `${dashboardRootUrlV1}/notifications`;        
    return {
        root:PATH,                    
    }
}

function generalSettings(prefix:string='') {
    const PATH = `${dashboardRootUrlV1}/general_settings`;        
    return {
        root:PATH,                    
    }
}

