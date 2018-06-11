import { Component, OnInit } from '@angular/core';
import { ConfigKeywordsService } from './../../services/config-keywords.service';

@Component({
  selector: 'config-help',
  templateUrl: './config-help.component.html',
  styleUrls: ['./config-help.component.css']
})
export class HelpComponent implements OnInit {
  /**
   *  Author : Himanshu Kumar
   *  Usage of the varisbles used in this file are as follow:-
   * -mainheader : It will hold the content for Header of Dilaog
   * -header : It will hold the Header content of the group of setting(s).
   * -headermessage : It will hold the message of the header if any present.
   * -messagefirst,messagesecond , messagethird , messagefourth and messagefifth : It will hold the level of setting(s) present on UI.
   * -submessagefirst,submessagesecond,submessagethird,submessagefourth and  submessagefifth : It will hold the brief message of levels on UI.
   * Note : The differen Arrays (i.e messagefirst ,messagesecond ..) are taken to hold levels of different
   * settings present under one Header content. 
   * Similarily is the case with Arrays (i.e submessagefirst ,submessagesecond ... )
   * it will contains the brief message of levels comes in under one Header content 
   */
  content: string[];
  header: string[];
  headermessage: string = '';
  messagefirst: string[];
  messagesecond: string[];
  messagethird: string[];
  messagefourth: string[];
  messagefifth: string[];

  submessagefirst: string[];
  submessagesecond: string[];
  submessagethird: string[];
  submessagefourth: string[];
  submessagefifth: string[];

  helpdialog: boolean;
  mainheader: string;
  customDataHelpDialog: boolean;

  constructor(private configKeywordsService: ConfigKeywordsService) { }

  ngOnInit() {
    this.configKeywordsService.helpContent$.subscribe(data => {
      this.checkcomponent(data);
    });
  }
  /**
   * Purpose :To check the value of component and depending on that
   * the further method will invoke. 
   * @param data 
   */
  checkcomponent(data) {
    if (data.component == "General") {
      this.checkForGeneralModule(data);
    }
    if (data.component == "Instrumentation") {
      this.checkForInstrumentationModule(data);
    }
    if (data.component == "Advance") {
      this.checkForAdvanceModule(data);
    }
    if (data.component == "Home") {
      this.checkForHomeModule(data);
    }
  }
  /**
   * Purpose : To check the value of module i.e comes under Home component
   * and depending on that we will form data for the received module
   * that will render on DOM
   * @param data 
   */
  checkForHomeModule(data) {
    if (data.module == "Application") {
      this.mainheader = data.component;
      this.header = ["Application Settings"];
      this.headermessage ="";
      this.messagefirst = ["Application List"];
      this.submessagefirst = ["An application is a program designed to perform a specific function. Application contains topology, which is a combination of tier, server, and instances. Using the Configure button, user can add, edit, and delete an application."]
      this.helpdialog = true;
    }
    if (data.module == "Profile") {
      this.mainheader = data.component;
      this.header = ["Profile Settings"];
      this.headermessage ="";
      this.messagefirst = ["Profile List"];
      this.submessagefirst = ["Profiles are a set of configuration files that help ND Collector to identify the agent specific configuration (such as Java, .Net, and Node.js). User can apply Profiles at any level (such as tier, server, or instance)."]
      this.helpdialog = true;
    }
    if (data.module == "Topology") {
      this.mainheader = data.component;
      this.header = ["Topology Settings"];
      this.headermessage ="";
      this.messagefirst = ["Topology List"];
      this.submessagefirst = ["Topology is a combination of various elements (such as tier, server, and instance) of an application. User can view five most recent updated topologies only in Home page. To view the complete list of topologies, user needs to click the Topology icon (from the left menu) or click the Show All button."]
      this.helpdialog = true;
    }
  }
  /**
   * Purpose : To check the value of module i.e comes under General component
   * and depending on that we will form data for the received module
   * that will further eligible to render on DOM
   * @param data 
   */
  checkForGeneralModule(data) {
    if (data.module == "Flowpath") {
      if (data.agentType == "Java") {
        this.mainheader = data.component + " " + "Settings"
        this.header = ["Flowpath Settings"];
        this.headermessage ="";
        this.messagefirst = ["Flowpath Instrumentation (%)", "HTTP Header Name for CorrelationID", "Capture callstacks of all offending business transaction(s)", "CPU Profiling", "Capture Time Breakdown"];
        this.submessagefirst = ["The specified percentage of flowpath(s) are captured from all the session(s) monitored by application agent. Slow, very slow, and error flowpaths are always caputred.",
          "HTTP header name used by application to pass correlationID across topology. ",
          "Capture method calling stack of slow/very slow/error business transaction(s) for all flowpath(s).",
          "Capture CPU time consumed by (i) Business transaction(s) OR (ii) Business transaction(s) and method(s).",
          "Capture wait and sync time by (i) Business transaction(s) OR (ii) Business transaction(s) and method(s)."];
        this.helpdialog = true;
      }
      else if (data.agentType == "DotNet" || data.agentType == "Dot Net") {
        this.mainheader = data.component + " " + "Settings"
        this.header = ["Flowpath Settings"];
        this.headermessage ="";
        this.messagefirst = ["Flowpath Instrumentation (%)", "HTTP Header Name for CorrelationID", "CPU Profiling"];
        this.submessagefirst = ["The specified percentage of flowpath(s) are captured from all the session(s) monitored by application agent. Slow, very slow, and error flowpaths are always caputred.","HTTP header name used by application to pass correlationID across topology. ", "Capture CPU time consumed by (i) Business transaction(s) OR (ii) Business transaction(s) and method(s)."];
        this.helpdialog = true;
      }
      else if (data.agentType == "NodeJS") {
        this.mainheader = data.component + " " + "Settings"
        this.header = ["Flowpath Settings"];
        this.headermessage ="";
        this.messagefirst = ["Flowpath Instrumentation (%)", "HTTP Header Name for CorrelationID"];
        this.submessagefirst = ["The specified percentage of flowpath(s) are captured from all the session(s) monitored by application agent. Slow, very slow, and error flowpaths are always caputred.",
          "HTTP header name used by application to pass correlationID across topology. "];
        this.helpdialog = true;
      }
    }
    else if (data.module == "Hotspot") {
      if (data.agentType == "Java") {
        this.mainheader = data.component + " " + "Settings";
        this.header = ["Hotspot Detection", "Filter"];
        this.headermessage ="";
        this.messagefirst = ["Thread Sampling Interval", "Consecutive matching samples to mark as Hotspot", "Compare top <n> stack frames of same thread", "Maximum Stack depth difference in consecutive matching samples"];

        this.messagesecond = ["Minimum Hotspot Thread Depth", "Thread names to be included in Hotspot"
          , "Thread names to be excluded in Hotspot"]

        this.submessagefirst = ["The provided value defines the frequency interval for collecting thread samples.",
          "Number of consecutive thread sample having same stack trace",
          "Compare top <n> stack frames of same thread in consecutive matching samples", "Auto sensor max stack depth difference in two samples. if difference is greater than this then do not compare and mark it as not matched"];

        this.submessagesecond = ["The provided value defines the minimum depth of thread stack trace to be captured for hotspot",
          "Consider only provided thread names for hotspot detection from all threads of application",
          "Do not consider provided thread names for hotspot detection"];

        this.helpdialog = true;
      }
      else if (data.agentType == "DotNet" || data.agentType == "Dot Net") {
        this.mainheader = data.component + " " + "Settings";
        this.header = ["Hotspot Detection"];
        this.headermessage ="";
        this.messagefirst = ["Thread Sampling Interval", "Consecutive matching samples to mark as Hotspot", "Compare top <n> stack frames of same thread"];
        this.submessagefirst = ["The provided value defines the frequency interval for collecting thread samples.",
          "Number of consecutive thread sample having same stack trace",
          "Compare top <n> stack frames of same thread in consecutive matching samples"];
        this.helpdialog = true;
      }
      else if (data.agentType == "NodeJS") {
        this.mainheader = data.component + " " + "Settings";
        this.header = ["Hotspot Detection"];
        this.headermessage ="";
        this.messagefirst = ["Thread Sampling Interval"];
        this.submessagefirst = ["The provided value defines the frequency interval for collecting thread samples."];
        this.helpdialog = true;
      }
    }
    else if (data.module == "Exception Capturing") {
      this.mainheader = data.component + " " + "Settings";
      this.header = ["Exception", "Advanced", "Filter"];
      this.headermessage = "Exceptions are events that occur during the execution of programs that disrupt the normal flow of instructions (e.g. divide by zero, array access out of bound, etc.). In Java, an exception is an object that wraps an error event that occurred within a method and contains: Information about the error including its type.";
      this.messagefirst = ["Capture Exceptions"];
      this.messagesecond = ["Advanced"]
      this.messagethird = ["Exception Filter"]
      this.submessagefirst = ["When enabled, exceptions are captured. In addition, to capture exceptions logged using API (such as util.logging, log4j, ATG logger), select the subsequent check box. Furthermore, specify <n> frames of exception stack trace to be captured. User can capture exceptions from un-instrumented flowpath(s) too."];
      this.submessagesecond = ["Here, user can specify the criteria to capture stack trace. There are multiple options:*Disable: Stack trace of exceptions are not captured*Stack Trace only: Only stack trace of exceptions are captured*Stack Trace with Source code only: Stack trace of exceptions with source code are captured  User can select any one from them."];
      this.submessagethird = ["This is used to apply filtering in captured exceptions. Here, system displays a list of exception filters with details, such as pattern, mode, and operation. To apply filters, select Enable Exception Filters check box. *User can import a pattern file from NDE box or from a local machine (.txt and .ecf), *Add a filter: Select the operation, then specify a pattern, and then select the mode (either enable or disable). <Description of Pattern, mode, operation>  *Edit an existing filter *Delete a filter"];
      this.helpdialog = true;
    }
    else if (data.module == "Header") {
      this.mainheader = data.component + " " + "Settings"
      this.header = ["Header"];
      this.headermessage = "HTTP headers allow the client and the server to pass additional information with the request or response.";
      this.messagefirst = ["Capture HTTP request headers", "Capture HTTP response headers"];
      this.submessagefirst = ["When enabled, HTTP request headers are captured. User can capture 'all' or 'specified' headers. In case of 'specified', select request header(s) from the drop-down list. User can limit the captured header values upto specified characters too.",
        "When enabled, HTTP response headers are captured. User can capture 'all' or 'specified' headers. In case of 'specified', select response header(s) from the drop-down list. User can limit the captured header values upto specified characters too."];
      this.helpdialog = true;
    }
    else if (data.module == "Custom Data") {
      this.mainheader = data.component + " " + "Settings";
      this.header = ["Custom Data", "Method", "Session Attribute", "HTTP Request Header", "HTTP Response Header"];
      this.headermessage ="";
      this.messagefirst = ["Custom Data"];
      this.messagesecond = ["Method", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
      this.messagethird = ["Session Attribute", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
      this.messagefourth = ["HTTP Request Header", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
      this.messagefifth = ["HTTP Response Header", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
      var str = "This table displays following columns:";

      this.submessagefirst = ["In this section, user can capture custom data from Method, Session Attribute, HTTP Request Header and HTTP Response Header."];

      this.submessagesecond = ["Here, User can capture Custom Data from Method.This section displays Method based Custom Header Rules, with details such as Fully Qualified Method Name, Return Type, and Argument Type. User can perform following operations:"
        , "<h3><b>Add Method Rule to capture Custom Headers</b></h3>", "<b>(I)</b> Provide Fully Qualified Method Name", "<b>(II)</b> Enable/Disable Custom Header from Method Return value(s): When enabled, select the method return value rule(s) from the list or add a new one."
        , "<b>This table displays following columns:</b>", "(i) Header Name", "(ii) Data Type", "(iii) Operation", "(iv) Header Value and", "(v) Show in Method Calling Tree"
        , "For adding a new rule, provide header name within which the captured data will be dumped, select the data type, select operation which are defined for different type of return values (string or object type, numeric type, byte or character type, and boolean type), and specify the header value. User can also enable capturing of custom header or display custom header in method calling tree."
        , "<b>(III)</b> Enable/Disable Custom Header from Method Argument(s): When enabled, select the method argument rule(s) from the list or add a new one.",
        "This table displays following columns:", "(i) Header Name", "(ii)Argument Type", "(iii) Data Type", "(iv) Operation", "(v) Header Value and", "(vi) Show in Method Calling Tree"
        , "For adding a new rule, provide header name within which the captured data will be dumped, argument index targeted for provided condition, select the data type, select operation which are defined for different type of return values (string or object type, numeric type, byte or character type, and boolean type), and specify the header value. User can also enable capturing of custom header or display custom header in method calling tree."
        , "*Apart from this, user can edit or delete a method rule. "];

      this.submessagethird = ["Here, user can capture custom data from session attribute.", "There are three options: ",
        "(I) None: No data is captured ", "  (II) All: Data from all session attributes are captured", "(III) Extract value Upon selecting this, a list of session attribute based custom header rule(s) is displayed with following details:", "(i) Attribute Name"
        , "(ii) Capture Mode", "(iii) Header Names", "User can select the rule from the list or can add a new one. For adding a new session attribute rule, provide attribute name and select either:"
        , "(i) Complete Value", "(ii) Extract Value", "Further, upon selecting 'Extract Value', a list of extraction rule(s) is displayed with following details: "
        , "(i) Header Name", "(ii) Data Type", "(iii) Left Bound and", "(iv) Right Bound", "User can select an extraction rule from the list or can add a new one. For adding a new rule, provide header name, data type, left bound, and right bound"]
      this.submessagefourth = ["Here, user can capture custom data from request header. There are three options: ", "(I) None: No data is captured", "(II) All: Data from all session attributes are captured"
        , "(III) Extract value: Upon selecting this, a list of HTTP request header based custom header rule(s) is displayed with following details:", "(i) Request Header name"
        , "(ii) Capture mode", "(iii) Header names", "User can select the rule from the list or can add a new one. For adding a new HTTP request header based custom header rule(s), provide request header name and select either:"
        , "(a) Complete Value", "(b) Extract Value", "Further, upon selecting 'Extract Value', a list of extraction rule(s) is displayed with following details: ",
        "Custom Header name", "Data type", "Left bound", "Right bound", "User can select an extraction rule from the list or can add a new one. For adding a new rule, provide custom header name, data type, left bound, and right bound."];


      this.submessagefifth = ["Here, user can capture custom data from response header. There are three options: ", "(I) None: No data is captured", "(II) All: Data from all session attributes are captured"
        , "(III) Extract value: Upon selecting this, a list of HTTP request header based custom header rule(s) is displayed with following details:", "(i) Response Header name"
        , "(ii) Capture mode", "(iii) Header names", "User can select the rule from the list or can add a new one. For adding a new HTTP response header based custom header rule(s), provide request header name and select either:"
        , "(a) Complete Value", "(b) Extract Value", "Further, upon selecting 'Extract Value', a list of extraction rule(s) is displayed with following details: ",
        "Custom Header name", "Data type", "Left bound", "Right bound", "User can select an extraction rule from the list or can add a new one. For adding a new rule, provide custom header name, data type, left bound, and right bound."];
      this.helpdialog = true;

    }
    else if (data.module == "Instrumentation Profile") {
      this.mainheader = data.component + " " + "Settings"
      this.header = ["Instrumentation Profile"];
      this.headermessage ="";
      this.messagefirst = ["Instrumentation Profile"];
      this.submessagefirst = ["User can select instrumentation profile from the drop-down list to monitor application methods. User can also import an instrumentation file from NDE box or from a local machine using the Browse button."]
      this.helpdialog = true;
    }
  }
  /**
   * Purpose : To check the value of module i.e comes under Instrumentation component
   * and depending on that we will form data for the received module
   * that will further eligible to render on DOM
   * @param data 
   */
  checkForInstrumentationModule(data) {
    if (data.module == "Service Entry Point") {
      if (data.agentType == "Java") {
        this.mainheader = data.component;
        this.header = ["Service Entry Point"];
        this.headermessage ="";
        this.messagefirst = ["Service Entry Point", "", "", "", "", "", "", ""];
        this.submessagefirst = ["A service entry point is set on an entry. An entry can be a program or service program (where a service entry point is set on all procedures in the program)."
          , "This section displays a list of service entry points with following details: ", "(i) Service entry type", "(ii)  Service entry name"
          , "(iii) Enable/Disable Instrumentation", "(iv) Description", "(v) Category", "User can add/edit/delete a service point. For adding a new one, provide service entry type (which can be a service/program/page etc.), service entry name, fully qualified method name, enable/disable the instrumentation for the service entry point, and  its description.  "];
        this.helpdialog = true;
      }
    }
  }
  /**
   * Purpose : To check the value of module i.e comes under Advance component
   * and depending on that we will form data for the received module
   * that will further eligible to render on DOM
   * @param data 
   */
  checkForAdvanceModule(data) {
    if (data.module == "Debug Level") {
      if (data.agentType == "Java") {
        this.mainheader = data.component + " " + "Settings"
        this.header = ["Debug Level Settings"];
        this.headermessage = "A debug level is a set of log levels for debug log categories, such as Database, Workflow, and Validation. A trace flag includes a debug level, a start time, an end time, and a log type."
        this.messagefirst = ["Debug Log Level", "Error Log Level", "Instrumentation Log level", "Method Monitor Log Level", "Capture Error Logs"];
        this.submessagefirst = ["To specify the level of information that gets included in debug logs, specify the debug log level (from 0 to 6). 0 being the lowest and 6 being the highest log level. ",
          "Error is used to log all unhandled exceptions. Specify the error log level from 1 to 100.",
          "Capture BCI trace log for instrumenting constraints", "Enable BCI Trace level for method monitoring feature", "Enable capturing of message based Exception record. * Disable * From Throwable object *From Throwable Object and Error Logs"];
        this.helpdialog = true;
      }
      else if (data.agentType == "NodeJS") {
        this.mainheader = data.component + " " + "Settings"
        this.header = ["Debug Level Settings"];
        this.headermessage = "A debug level is a set of log levels for debug log categories, such as Database, Workflow, and Validation. A trace flag includes a debug level, a start time, an end time, and a log type."
        this.messagefirst = ["Debug Log Level", "Method Monitor Log Level"];
        this.submessagefirst = ["To specify the level of information that gets included in debug logs, specify the debug log level (from 0 to 6). 0 being the lowest and 6 being the highest log level. ",
         "Enable BCI Trace level for method monitoring feature"];
        this.helpdialog = true;
      }
    }
    if (data.module == "Monitors") {
      if (data.agentType == "Java" || data.agentType == "DotNet" || data.agentType == "Dot Net") {
        this.mainheader = data.component + " " + "Settings"
        this.header = ["Monitors Settings"];
        this.headermessage = "This section is used to specify whether to monitor business transactions and integration points.";
        this.messagefirst = ["Monitor Business Transactions", "Backend Monitor"];
        this.submessagefirst = ["To monitor business transactions, select this check box.", "To monitor integration points, select this check box."];
        this.helpdialog = true;
      }
      else if (data.agentType == "NodeJS") {
        this.mainheader = data.component + " " + "Settings"
        this.header = ["Monitors Settings"];
        this.headermessage = "This section is used to specify whether to monitor business transactions and integration points.";
        this.messagefirst = ["Monitor Business Transactions", "Backend Monitor", "Average Time Taken by Event Loop", "GC and Heap Usage Information", "Asynchronous Events Information", "Server Request/Response Information on Particular Node Server"];
        this.submessagefirst = ["To monitor business transactions, select this check box.", "To monitor integration points, select this check box.",
          "To monitor average time taken by event loop,select this checkbox.", "To monitor GC and Heap usage information,select this checkbox.", "To monitor asynchronous events information,select this checkbox.",
          "To monitor server request/response information on particular Node Server,select this checkbox."];
        this.helpdialog = true;
      }
    }
    else if (data.module == "Put Delay In Method") {
      this.mainheader = data.component + " " + "Settings"
      this.header = ["Put Delay In Method Settings"];
      this.headermessage = "This functionality is used to delay execution of method for specified period. ";
      this.messagefirst = ["Fully Qualified Method Name", "Delay In Method", "CPU Hogg", "Is Auto Instrument", "Dump stack trace"];
      this.submessagefirst = ["Provide a fully qualified method name. The method name should be valid. Rule 1: Method name can include package, class, and method name seperated by dot (.) Rule 2: Method name cannot include whitespaces. ", "To monitor integration points, select this check box."
        , "Specify the delay in methods by providing a range in milliseconds.", "It is a flag to increase CPU Utilization by calling while loop for the time provided in the delay Time",
        "It is a flag to enable / disable instrumentation of the method provided for delay.", "To dump stack trace, select this check box."];
      this.helpdialog = true;
    }
    else if (data.module == "Generate Exception In Method") {
      this.mainheader = data.component + " " + "Settings"
      this.header = ["Generate Exception In Method Settings"];
      this.headermessage = "";
      this.messagefirst = ["Fully Qualified Method Name", "Exception Type", "Exception Name", "Percentage"];
      this.submessagefirst = ["Provide a fully qualified method name. The method name should be valid. Rule 1: Method name can include package, class, and method name seperated by dot (.) Rule 2: Method name cannot include whitespaces. ", "Select a Exception Type from dropdown"
        , "Provide the name of Exception", "Exception occurence ratio in methods (%)"];
      this.helpdialog = true;
    }
    else if (data.module == "Custom Configuration") {
      this.mainheader = data.component + " " + "Settings"
      this.header = ["Custom Configuration Settings"];
      this.headermessage = "This section displays a custom configuration list. User can add , edit and delete  custom configuration.";
      this.messagefirst = ["Add a Custom Configuration", "Edit a Custom Configuration", "Delete Custom Configuration(s)"];
      this.submessagefirst = ["Select the custom configuration from the list, specify its value, and provide its description",
        "Select a row from the table of custom configuration, specify its value, and provide its description", "Delete row(s) from the table of custom configuration"];
      this.helpdialog = true;
    }
  }
}
