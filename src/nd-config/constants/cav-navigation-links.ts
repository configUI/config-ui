/** This class contains all main navigation links. Please update individual item if the routing information changed. */

export const NAV_LINKS =
  [ 
     {
        label: 'Home',
        name: 'home',
        routeURL: '/home',
        routeIcon: 'fa-home',
        isActive: true
     },
     {
        label: 'Dashboard',
        name: 'dashboard',
        routeURL: '/home/dashboard',
        routeIcon: 'fa-desktop',
        isActive: false
     },
     {
        label: 'Run Command',
        name: 'runCommand',
        routeURL: '/home/runCommand',
        routeIcon: 'produi-icon-run-command',
        isActive: false
     },
     {
        label: 'Scenario',
        name: 'scenario',
        routeURL: '/home/openTotalScenario',
        routeIcon: 'produi-icon-scenario',
        isActive: false

    },
    {
        label: 'Scenarios Profiles',
        name: 'scenariosprofiles',
        routeURL: '/home/openScenarioProfile',
        routeIcon: 'fa-id-card-o',
        isActive: false
    },
    {
        label: 'ScenarioGUI',
        name: 'scenariogui',
        routeURL: '/home/scenario/schedule-setting',
        routeIcon: 'fa-scribd',
        isActive: false
    },
    {
        label: 'Test Run(s)',
        name: 'testrun',
        routeURL: '/home/openTestRunGrid',
        routeIcon: 'fa-text-height',
        isActive: false
    },
     {
        label: 'Sessions',
        name: 'session',
        routeURL: '/home/openSessionGrid',
        routeIcon: 'produi-icon-sessionpacing',
        isActive: false
    },
    {
        label: 'ND Config',
        name: 'ndConfig',
        routeURL: '/home/config',
        routeIcon: 'produi-icon-nde-setting',
        isActive: false
    },
    {
        label: 'Agent Info',
        name: 'ndAgent',
        routeURL: '/home/ndAgent',
        routeIcon: 'ndegui-nd-agent',
        isActive: false
    },
    {
        label: 'Alert',
        name: 'alert',
        routeURL: '/home/alert',
        routeIcon: 'fa-bell-o',
        isActive: false
    },
    {
        label: 'Transaction Details',
        name: 'transaction-detail',
        routeURL: '/home/transaction-detail',
        routeIcon: 'fa-list-alt',
        isActive: false
    },
    {
        label: 'MS SQL Query',
        name: 'sqlQuery',
        routeURL: '/home/sqlQuery',
        routeIcon: 'fa-database',
        isActive: false
    },
    {
        label: 'Access Log',
        name: 'accesslog',
        routeURL: '/home/accesslog',
        routeIcon: 'fa-snowflake-o',
        isActive: false
    },
    {
       label: 'DDR',
       name: 'ddr',
       routeURL: '/home/ddr',
       routeIcon: 'fa-clone',
       isActive: false
    },
   
    {
        label: 'Time Slot',
        name: 'timeSlot',
        routeURL: '/home/openTestRunTimeSlot',
        routeIcon: 'fa-text-height',
        isActive: false
    },
     {
            label: 'Add',
            name: 'Add',
            routeURL: '/home/addServices',
            routeIcon: 'fa-plus-square',
            isActive: false
        },
        {
            label: 'Record',
            name: 'Record',
            routeURL: '/home/recordServices',
            routeIcon: 'fa-address-book',
            isActive: false
        },
        {
            label: 'indexDataSource',
            name: 'indexDataSource',
            routeURL: '/home/indexDataSource',
            routeIcon: 'fa-table',
            isActive: false
        },
        {
            label: 'configuration',
            name: 'configuration',
            routeURL: '/home/globalHttpMain/globalHttpSettings',
            routeIcon: 'fa-wrench',
            isActive: false
        },
        {
            label: 'Request Trace',
            name: 'Request Trace',
            routeURL: '/home/requestTrace',
            routeIcon: 'fa-road',
            isActive: false
        },
        {
            label: 'SSl Management',
            name: 'SSl Management',
            routeURL: '/home/sslManagement',
            routeIcon: 'fa-cogs',
            isActive: false
        },
        {
            label: 'Data Processor',
            name: 'Data Processor',
            routeURL: '/home/dataProcessor',
            routeIcon: 'fa-microchip',
            isActive: false
        },
        {
            label: 'Data Manager',
            name: 'Data Manager',
            routeURL: '/home/dataManager',
            routeIcon: 'fa-sitemap',
            isActive: false
        },
        {
            label: 'Groups',
            name: 'Groups',
            routeURL: '/home/',
            routeIcon: 'fa-object-group',
            isActive: false
        },
        {
            label: 'Users',
            name: 'Users',
            routeURL: '/home/',
            routeIcon: 'fa-user',
            isActive: false
        },
        {
            label: 'Manage',
            name: 'Manage',
            routeURL: '/home/manageServices',
            routeIcon: 'fa-puzzle-piece',
            isActive: false
        },
        {
            label: 'Servers',
            name: 'Servers',
            routeURL: '',
            routeIcon: 'fa-server',
            isActive: false
        },
	{
            label: 'Add',
            name: 'Add',
            routeURL: '/home/addServices',
            routeIcon: 'fa-plus-square',
            isActive: false
        },
        {
            label: 'Record',
            name: 'Record',
            routeURL: '/home/recordServices',
            routeIcon: 'fa-address-book',
            isActive: false
        },
        {
            label: 'indexDataSource',
            name: 'indexDataSource',
            routeURL: '/home/indexDataSource',
            routeIcon: 'fa-table',
            isActive: false
        },
        {
            label: 'configuration',
            name: 'configuration',
            routeURL: '/home/globalHttpMain/globalHttpSettings',
            routeIcon: 'fa-wrench',
            isActive: false
        },
        {
            label: 'Request Trace',
            name: 'Request Trace',
            routeURL: '/home/requestTrace',
            routeIcon: 'fa-road',
            isActive: false
        },
        {
            label: 'SSl Management',
            name: 'SSl Management',
            routeURL: '/home/sslManagement',
            routeIcon: 'fa-cogs',
            isActive: false
        },
        {
            label: 'Data Processor',
            name: 'Data Processor',
            routeURL: '/home/dataProcessor',
            routeIcon: 'fa-microchip',
            isActive: false
        },
        {
            label: 'Data Manager',
            name: 'Data Manager',
            routeURL: '/home/dataManager',
            routeIcon: 'fa-sitemap',
            isActive: false
        },
        {
            label: 'Groups',
            name: 'Groups',
            routeURL: '/home/',
            routeIcon: 'fa-object-group',
            isActive: false
        },
        {
            label: 'Users',
            name: 'Users',
            routeURL: '/home/',
            routeIcon: 'fa-user',
            isActive: false
        },
        {
            label: 'Manage',
            name: 'Manage',
            routeURL: '/home/manageServices',
            routeIcon: 'fa-puzzle-piece',
            isActive: false
        },
        {
            label: 'Servers',
            name: 'Servers',
            routeURL: '',
            routeIcon: 'fa-server',
            isActive: false
        },
	{
            label: 'JMS Message',
            name: 'JMS Message',
            routeURL: '/home/jmsMessage',
            routeIcon: 'fa-envelope-open',
            isActive: false
        },
	  {
            label: 'Access Control',
            name: 'accessControl',
            routeURL: '/home/accessControl',
            routeIcon: 'fa-lock',
            isActive: false
        }
];


