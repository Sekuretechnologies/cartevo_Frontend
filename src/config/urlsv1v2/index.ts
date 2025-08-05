import * as APPURLS from '.';

export type URLType = { [key: string]: string };

// ALL APP ROUTES
export const rootUrl = '/';
export const dashboardRootUrlV1V2 = '/dashboard/v1v2';

const URLConfig = {
    root: rootUrl,
    notFound: `/not-found`,
    dashboard:dashboardRootUrlV1V2,
    
    //   Comptes utilisateurs
    dashboardHome: {
        ...dashboardHome(),
    }
};

export default URLConfig;

function dashboardHome(prefix:string='') {
    const PATH = `${dashboardRootUrlV1V2}/home`;        
    return {
        root:PATH
    }
}

