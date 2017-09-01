#! /bin/sh

BEGIN;

INSERT INTO config.profile(profile_id,profile_name,profile_desc,time_stamp,user_name) VALUES
(1,'default','Default profile','-','');

INSERT INTO config.entry_type(entry_type_id, entry_type_name, entry_type_detail) VALUES
(1,'HttpServletService','description'),
(2,'EntryForWebLogicJSP','description'),
(3,'ApacheJsperService','description'),
(4,'jerseyCall','description'),
(5,'glassFishJersey','description'),
(6,'Generic','description'),
(7,'JMSCall','description'),
(8,'EntryForJBOSS','description'),
(9,'ErrorPageEntry','description');

INSERT INTO config.service_entry_points(entry_id,entry_desc,entry_fqm,entry_name,entry_type_id, custom_entry) VALUES
(1,'Fully qualified name for the service method for HttpServlet Class','javax.servlet.http.HttpServlet.service(Ljavax/servlet/http/HttpServletRequest;Ljavax/servlet/http/HttpServletResponse;)V', 'HttpServlet.service',1,false),
(2,'fully qualified name for the doFilter method for weblogic','weblogic.servlet.internal.FilterChainImpl.doFilter(Ljavax/servlet/ServletRequest;Ljavax/servlet/ServletResponse;)V','FilterChainImpl.doFilter', 2,false),
(3,' ','org.apache.jasper.runtime.HttpJspBase.service(Ljavax/servlet/http/HttpServletRequest;Ljavax/servlet/http/HttpServletResponse;)V','ApacheJsperService', 3, false),
(4,' ','weblogic.servlet.jsp.JspBase.service(Ljavax/servlet/ServletRequest;Ljavax/servlet/ServletResponse;)V','WebAppFilterChain.doFilter', 2,false),
(5,' ','com.ibm.ws.webcontainer.servlet.ServletWrapper.service(Ljavax/servlet/ServletRequest;Ljavax/servlet/ServletResponse;)V','ServletWrapper.service', 2,false),
(6,' ','com.ibm.ws.webcontainer.servlet.ServletWrapper.service(Ljavax/servlet/ServletRequest;Ljavax/servlet/ServletResponse;Lcom/ibm/ws/webcontainer/webapp/WebAppServletInvocationEvent;)V','ServletWrapper.service-WebAppServletInvocationEvent', 2,false),
(7,' ','org.apache.catalina.core.ApplicationFilterChain.doFilter(Ljavax/servlet/ServletRequest;Ljavax/servlet/ServletResponse;)V','ApplicationFilterChain.doFilter', 8,false),
(8,' ','org.glassfish.jersey.servlet.ServletContainer.service(Ljavax/servlet/ServletRequest;Ljavax/servlet/ServletResponse;)V','ServletContainer.service', 5,false),
(9,' ','com.ibm.ws.webcontainer.filter.WebAppFilterChain.doFilter(Ljavax/servlet/ServletRequest;Ljavax/servlet/ServletResponse;)V','WebAppFilterChain.doFilter', 2,false),
(10,' ','org.apache.activemq.ActiveMQMessageConsumer.dispatch(Lorg/apache/activemq/command/MessageDispatch;)V','ActiveMQMessageConsumer.dispatch',7,false),
(11,' ','com.ibm.mq.jms.MQMessageConsumer\$FacadeMessageListener.onMessage(Ljavax/jms/Message;)V','MQMessageConsumer\$FacadeMessageListener.onMessage',7,false),
(12,' ','weblogic.servlet.internal.RequestDispatcherImpl.forward(Ljavax/servlet/ServletRequest;Ljavax/servlet/ServletResponse;)V','RequestDispatcherImpl.forward',9,false);

INSERT INTO config.profile_service_entry_asso(prof_entry_id, profile_enable, entry_id, profile_id) VALUES
(1, true, 1, 1),
(2, true, 2, 1),
(3, true, 3, 1),
(4, true, 4, 1),
(5, true, 5, 1),
(6, true, 6, 1),
(7, true, 7, 1),
(8, true, 8, 1),
(9, true, 9, 1),
(10,false, 10, 1),
(11,false, 11, 1),
(12,true, 12, 1);

INSERT INTO config.keywords_meta_data(kmd_id,key_type,key_type_id) VALUES
(1,'char','0'),
(2,'integer','1'),
(3,'double','2'),
(4,'long long','3'),
(5,'string','4'),
(6,'file','5');

INSERT INTO config.keywords(key_id,key_name,key_min,key_max,kmd_id,key_def_value,type) VALUES
(1,'bciInstrSessionPct','0','100','2','0','normal'),
(2,'logLevelOneFpMethod','0','1','1','0','normal'),
(3,'enableBciDebug','0','6','1','1','normal'),
(4,'enableBciError','1','100','5','1','normal'),
(5,'doNotDiscardFlowPaths','0','1','2','0','normal'),
(6,'ASSampleInterval','0','5000','4','500','normal'),
(7,'ASThresholdMatchCount','1','100','4','5','normal'),
(8,'ASReportInterval','0','900000','4','0','normal'),
(9,'instrProfile','','','5','','normal'),
(10,'ASDepthFilter','0','100','2','20','normal'),
(11,'ASTraceLevel','0','20','2','1','pre-custom'),
(12,'enableNDSession','0','1024','5','0','normal'),
(13,'enableCpuTime','0','1024','1','0','normal'),
(14,'enableForcedFPChain','0','3','2','1','normal'),
(15,'InstrTraceLevel','0','11','2','0','normal'),
(16,'instrExceptions','0','512','5','0','normal'),
(17,'correlationIDHeader','0','1024','5','-','normal'),
(18,'ASStackComparingDepth','0','1000','4','10','normal'),
(19,'putDelayInMethod','0','10240','5','0','normal'),
(20,'enableBackendMonitor','0','1','2','1','normal'),
(21,'NDEntryPointsFile','','','5','true','normal'),
(22,'ndMethodMonTraceLevel','0','10','2','0','normal'),
(23,'generateExceptionInMethod','0','10240','5','0','normal'),
(24,'captureHTTPReqFullFp','1','10485760','5','2','normal'),
(25,'NDHTTPReqHdrCfgListFullFp','1','1024','6','NA','normal'),
(26,'captureHTTPRespFullFp','1','1048576','5','1','normal'),
(27,'enableBTMonitor','0','1','2','1','normal'),
(28,'BTRuleConfig','NA','NA','5','global','normal'),
(29,'ndMethodMonFile','','','5','false','normal'),
(30,'BTErrorRules','','','5','false','normal'),
(31,'captureHttpSessionAttr','','','5','false','normal'),
(32,'enableJVMThreadMonitor','0','2048','5','0','normal'),
(33,'captureCustomData','','','5','false','normal'),
(34,'ASPositiveThreadFilters','2','1048576','5','NA','normal'),
(35,'ASNegativeThreadFilter','2','1048576','5','NDControlConnection','normal'),
(36,'maxStackSizeDiff','0','1000','4','20','normal'),
(37,'ASMethodHotspots','0','1','1','-1','normal'),
(38,'enableExceptionInSeqBlob','0','1','2','0','pre-custom'),
(39,'captureErrorLogs','0','2','2','0','normal'),
(40,'maxExceptionMessageLength','0','10000','2','50','pre-custom'),
(41,'maxResourceDetailMapSize','0','1000000','2','500000','pre-custom'),
(42, 'HTTPStatsCondCfg','1','1024','5','false','normal'),
(43,'enableExceptionsWithSourceAndVars','0','248','2','0','normal'),
(44,'enableSourceCodeFilters','1','1024','5','false','normal'),
(45,'ndExceptionMonFile','','','5','false','normal'),
(46,'maxQueryDetailsmapSize','0','10000000','1','1000000','pre-custom'),
(47,'formatIPResourceURL','0','512','5','0','normal');


INSERT INTO config.backend_type(backend_type_id,backend_type_detail,backend_type_name,backend_type_name_entrypointsfile,backend_type_name_rulefile) VALUES
(1,'http backend','HTTP','HttpCallout','HTTP'),
(2,'WS backend','WEB SERVICE','HttpCallout','WS'),
(3,'JDBC backend','JDBC','oracleDB','JDBC'),
(4,'Coherence backend','COHERENCE','HttpCallout','None'),
(5,'RMI backend','RMI','HttpCallout','RMI'),
(6,'MEM CACHE backend','MEM CACHE','HttpCallout','None'),
(7,'CLOUDANT backend','CLOUDANT','HttpCallout','None'),
(8,'HADOOP backend','HADOOP','HttpCallout','HBASE'),
(9,'CUSTOM  backend','CUSTOM','CustomCallout:','None'),
(10,'REDIS backend','REDIS','redis','REDIS'),
(11,'MONGO backend','MONGO','mongodb','MONGO'),
(12,'Cassandra backend','CASSANDRA','cassandra','None'),
(13,'Custom log backend','CUSTOM LOG','CustomLog','None'),
(14,'Custom Error log backend','CUSTOM ERROR LOG','CustomErrorlog','None');


INSERT INTO config.backend_points(end_point_id,end_point_desc,end_point_fqm,end_point_name,backend_type_id,custom_entry) VALUES
(1,'HTTP end point','org.apache.commons.httpclient.HttpMethodDirector.executeMethod(Lorg/apache/commons/httpclient/HttpMethod;)V','Apace HTTP Client',1,false),
(2,'HTTP end point','com.endeca.navigation.HttpENEConnection.query(Lcom/endeca/navigation/ENEQuery;)Lcom/endeca/navigation/ENEQueryResults;','Endeca',1,false),
(3,'HTTP end point','org.apache.http.impl.client.AbstractHttpClient.execute(Lorg/apache/http/HttpHost;Lorg/apache/http/HttpRequest;Lorg/apache/http/protocol/HttpContext;)Lorg/apache/http/HttpResponse;','Apache AbstractHttpClient',1,false),
(4,'HTTP end point','org.apache.http.impl.client.DefaultRequestDirector.execute(Lorg/apache/http/HttpHost;Lorg/apache/http/HttpRequest;Lorg/apache/http/protocol/HttpContext;)Lorg/apache/http/HttpResponse;','Apache Default HTTP Client',1,false),
(5,'HTTP end point','org.apache.wink.client.internal.handlers.HttpURLConnectionHandler.processRequest(Lorg/apache/wink/client/ClientRequest;Lorg/apache/wink/client/handlers/HandlerContext;)Ljava/net/HttpURLConnection;','Apache Wink Client',1,false),
(6,'HTTP end point','com.worklight.adapters.http.HTTPConnectionManager.execute(Lorg/apache/http/HttpRequest;Lorg/apache/http/protocol/HttpContext;)Lorg/apache/http/HttpResponse;','MFP Worklight HTTP Client',1,false),
(7,'HTTP end point','org.springframework.web.client.RestTemplate.doExecute(Ljava/net/URI;Lorg/springframework/http/HttpMethod;Lorg/springframework/web/client/RequestCallback;Lorg/springframework/web/client/ResponseExtractor;)Ljava/lang/Object;','Spring REST Template Client',1,false),
(8,'HTTP end point','org.springframework.web.client.RestTemplate$HttpEntityRequestCallback.doWithRequest(Lorg/springframework/http/client/ClientHttpRequest;)V','Spring add Header in REST Callback Template Client',1,false),
(9,'HTTP end point','org.springframework.http.client.support.HttpAccessor.createRequest(Ljava/net/URI;Lorg/springframework/http/HttpMethod;)Lorg/springframework/http/client/ClientHttpRequest;','Spring add Header in REST Client Template Client',1,false),
(10,'HTTP end point','org.apache.http.impl.client.InternalHttpClient.doExecute(Lorg/apache/http/HttpHost;Lorg/apache/http/HttpRequest;Lorg/apache/http/protocol/HttpContext;)Lorg/apache/http/client/methods/CloseableHttpResponse;','Apache Internal HTTP Client',1,false),
(11,'WS end point','org.glassfish.jersey.client.JerseyInvocation.invoke()Ljavax/ws/rs/core/Response;','Jersey Webservice Client',2,false),
(12,'WS end point','com.sun.xml.messaging.saaj.client.p2p.HttpSOAPConnection.post(Ljavax/xml/soap/SOAPMessage;Ljava/net/URL;)Ljavax/xml/soap/SOAPMessage;','HTTP SOAP connection',2,false),
(13,'WS end point','com.sun.xml.ws.transport.http.client.HttpClientTransport.<init>(Lcom/sun/xml/ws/api/message/Packet;Ljava/util/Map;)V','HTTP Client Transport',2,false),
(14,'WS end point','com.sun.xml.ws.transport.http.client.HttpTransportPipe.processRequest(Lcom/sun/xml/ws/api/message/Packet;)Lcom/sun/xml/ws/api/pipe/NextAction;','HTTP Transport Pipe',2,false),
(15,'WS end point','org.apache.cxf.jaxws.JaxWsClientProxy.invoke(Ljava/lang/Object;Ljava/lang/reflect/Method;[Ljava/lang/Object;)Ljava/lang/Object;','Apache cxf Webservice',2,false),
(16,'RMI end point','java.rmi.Naming.lookup(Ljava/lang/String;)Ljava/rmi/Remote;','RMI Lookup Calls',5,false),
(17,'RMI end point','java.rmi.Naming$ParsedNamingURL.<init>(Ljava/lang/String;ILjava/lang/String;)V','RMI Request',5,false),
(19,'JDBC end point','oracle.jdbc.driver.OraclePreparedStatementWrapper','oracleDB',3,false),
(20,'HADOOP end point','org.springframework.data.hadoop.hbase.HbaseTemplate.execute(Ljava/lang/String;Lorg/springframework/data/hadoop/hbase/TableCallback;)Ljava/lang/Object;','Spring HBASE',8,false),
(21,'COHERENCE end point','com.tangosol.net.cache.CachingMap.get(Ljava/lang/Object;)Ljava/lang/Object;','Coherence get',4,false),
(22,'COHERENCE end point','com.tangosol.net.cache.CachingMap.getAll(Ljava/util/Collection;)Ljava/util/Map;','Coherence getAll',4,false),
(23,'COHERENCE end point','com.tangosol.net.cache.CachingMap.put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;','Coherence put',4,false),
(24,'COHERENCE end point','com.tangosol.net.cache.CachingMap.put(Ljava/lang/Object;Ljava/lang/Object;ZJ)Ljava/lang/Object;','Coherence put',4,false),
(25,'COHERENCE end point','com.tangosol.net.cache.CachingMap.putAll(Ljava/util/Map;)V','Coherence putAll',4,false),
(26,'COHERENCE end point','com.tangosol.net.cache.CachingMap.remove(Ljava/lang/Object;)Ljava/lang/Object;','Coherence remove',4,false),
(27,'MEM CACHE end point','net.rubyeye.xmemcached.XMemcachedClient.add0(Ljava/lang/String;ILjava/lang/Object;Lnet/rubyeye/xmemcached/transcoders/Transcoder;J)Z','Mem Cache add',6,false),
(28,'MEM CACHE end point','net.rubyeye.xmemcached.XMemcachedClient.getMulti0(Ljava/util/Collection;JLnet/rubyeye/xmemcached/command/CommandType;Lnet/rubyeye/xmemcached/transcoders/Transcoder;)Ljava/util/Map;','MEM CACHE getMulti',6,false),
(29,'MEM CACHE end point','net.rubyeye.xmemcached.XMemcachedClient.get0(Ljava/lang/String;JLnet/rubyeye/xmemcached/command/CommandType;Lnet/rubyeye/xmemcached/transcoders/Transcoder;)Ljava/lang/Object;','Mem Cache get',6,false),
(30,'MEM CACHE end point','net.rubyeye.xmemcached.XMemcachedClient.delete0(Ljava/lang/String;IJZJ);','Mem Cache delete',6,false),
(31,'MEM CACHE end point','net.rubyeye.xmemcached.XMemcachedClient.replace(Ljava/lang/String;ILjava/lang/Object;Lnet/rubyeye/xmemcached/transcoders/Transcoder;J)Z','Mem Cache replace',6,false),
(32,'CLOUDANT end point','org.lightcouch.CouchDbClientBase.executeRequest(Lorg/apache/http/client/methods/HttpRequestBase;)Lorg/apache/http/HttpResponse;','Cloudant executeRequest',7,false),
(33,'HTTP end point','javax.naming.ldap.InitialLdapContext.<init>(Ljava/util/Hashtable;[Ljavax/naming/ldap/Control;)V','Initial LDAP Context',1,false),
(34,'HTTP end point','weblogic.servlet.internal.ServletResponseImpl.writeHeaders()V','Weblogic Servlet Response headers',1,false),
(35,'HTTP end point','com.hazelcast.client.spi.ClientProxy.invoke(Lcom/hazelcast/client/impl/protocol/ClientMessage;)Ljava/lang/Object;','Hazelcast client proxy',1,false),
(36,'JDBC end point','com.ibm.ws.rsadapter.jdbc.WSJdbcPreparedStatement','Prepared Statement : ibmDB',3,false),
(37,'JDBC end point','com.ibm.ws.rsadapter.jdbc.WSJdbcStatement','Statement : ibmDB',3,false),
(38,'JDBC end point','com.mysql.jdbc.PreparedStatement','Prepared Statement : mysqlDB',3,false),
(39,'JDBC end point','org.apache.openjpa.kernel.DelegatingQuery.execute()Ljava/lang/Object;','execute()Ljava/lang/Object : openJPADB',3,false),
(40,'JDBC end point','org.apache.openjpa.kernel.DelegatingQuery.execute(Ljava/util/Map;)Ljava/lang/Object;','execute(Ljava/util/Map;)Ljava/lang/Object : openJPADB',3,false),
(41,'JDBC end point','org.apache.openjpa.kernel.DelegatingQuery.execute([Ljava/lang/Object;)Ljava/lang/Object;','execute([Ljava/lang/Object;)Ljava/lang/Object : openJPADB',3,false),
(42,'REDIS end point','redis.clients.jedis.Jedis','Jedis : redisDB',10,false),
(43,'REDIS end point','redis.clients.jedis.BinaryJedis','Binary Jedis : redisDB',10,false),
(44,'MONGO end point','com.mongodb.DBCollection','DB Collection : mongoDB',11,false),
(45,'MONGO end point','com.mongodb.DB',' DB : mongoDB',11,false),
(46,'CASSANDRA end point','com.datastax.driver.core.SessionManager',' SessionManager : cassandraDB',12,false),
(47,'CASSANDRA end point','com.datastax.driver.core.RequestHandler',' RequestHandler : cassandraDB',12,false),
(48,'CUSTOM LOG end point','atg.nucleus.logging.LogEvent.<init>(Ljava/lang/String;Ljava/lang/Throwable;)V','LogEvent.<init>(String,Throwable)',13,false),
(49,'CUSTOM LOG end point','atg.nucleus.logging.LogEvent.<init>(Ljava/lang/String;Ljava/lang/String;)V','LogEvent.<init>(String,String)',13,false),
(50,'CUSTOM LOG end point','atg.nucleus.logging.LogEvent.<init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)V','LogEvent.<init>(String,String,Throwable)',13,false),
(51,'CUSTOM LOG end point','atg.nucleus.logging.LogEvent.<init>(Ljava/lang/String;)V','LogEvent.<init>(String)',13,false),
(52,'CUSTOM ERROR LOG end point','atg.nucleus.logging.LogEvent.<init>(Ljava/lang/String;Ljava/lang/Throwable;)V','LogEvent.<init>(String,Throwable)',14,false),
(53,'CUSTOM ERROR LOG end point','atg.nucleus.logging.LogEvent.<init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)V','LogEvent.<init>(String,String,Throwable)',14,false),
(54,'CUSTOM ERROR LOG end point','ch.qos.logback.classic.spi.LoggingEvent.<init>(Ljava/lang/String;Lch/qos/logback/classic/Logger;Lch/qos/logback/classic/Level;Ljava/lang/String;Ljava/lang/Throwable;[Ljava/lang/Object;)V','LoggingEvent.<init>(String,Logger,Level,String,Throwable,Object)',14,false);



INSERT INTO config.naming_rule_profile_backendtype_asso(assoc_id,host ,port,prefix ,service_name,table_name,topic_name,url,databaseproduct_name,databaseproduct_version,driver_name,driver_Version,query,user_name,backend_type_id,profile_id) VALUES
(1,true,false,false,false,false,false,false,false,false,false,false,false,false,1,1),
(2,true,false,false,false,false,false,false,false,false,false,false,false,false,2,1),
(3,true,false,false,false,false,false,false,false,false,false,false,false,false,3,1),
(4,true,false,false,false,false,false,false,false,false,false,false,false,false,4,1),
(5,true,false,false,false,false,false,false,false,false,false,false,false,false,5,1),
(6,true,false,false,false,false,false,false,false,false,false,false,false,false,6,1),
(7,true,false,false,false,false,false,false,false,false,false,false,false,false,7,1),
(8,true,false,false,false,false,false,false,false,false,false,false,false,false,8,1),
(9,true,false,false,false,false,false,false,false,false,false,false,false,false,9,1),
(10,true,false,false,false,false,false,false,false,false,false,false,false,false,10,1),
(11,true,false,false,false,false,false,false,false,false,false,false,false,false,11,1),
(12,false,false,false,false,false,false,false,false,false,false,false,false,false,12,1),
(13,false,false,false,false,false,false,false,false,false,false,false,false,false,13,1),
(14,false,false,false,false,false,false,false,false,false,false,false,false,false,14,1);

INSERT INTO config.profile_backend_point_asso(assoc_id,enabled,end_point_id,profile_id) VALUES
(1,true,1,1),
(2,true,2,1),
(3,true,3,1),
(4,false,4,1),
(5,true,5,1),
(6,true,6,1),
(7,true,7,1),
(8,false,8,1),
(9,false,9,1),
(10,true,10,1),
(11,true,11,1),
(12,true,12,1),
(13,true,13,1),
(14,true,14,1),
(15,true,15,1),
(16,false,16,1),
(17,false,17,1),
(19,true,19,1),
(20,false,20,1),
(21,true,21,1),
(22,true,22,1),
(23,true,23,1),
(24,true,24,1),
(25,true,25,1),
(26,true,26,1),
(27,true,27,1),
(28,true,28,1),
(29,true,29,1),
(30,true,30,1),
(31,true,31,1),
(32,true,32,1),
(33,false,33,1),
(34,true,34,1),
(35,false,35,1),
(36,true,36,1),
(37,true,37,1),
(38,true,38,1),
(39,false,39,1),
(40,false,40,1),
(41,false,41,1),
(42,true,42,1),
(43,true,43,1),
(44,true,44,1),
(45,true,45,1),
(46,false,46,1),
(47,false,47,1),
(48,false,48,1),
(49,false,49,1),
(50,false,50,1),
(51,false,51,1),
(52,true,52,1),
(53,true,53,1),
(54,false,54,1);

INSERT INTO config.headers_type(ht_id,header_type_name) VALUES
(1,'request'),
(2,'response'),
(3,'cookie');

INSERT INTO config.headers_meta_data(hmd_id,ht_id,header_name) VALUES
(1,1,'Accept-Charset'),
(2,1,'Accept-Datetime'),
(3,1,'Accept-Encoding'),
(4,1,'Accept-Language'),
(5,1,'Accept'),
(6,1,'Authorization'),
(7,1,'Cache-Control'),
(8,1,'Connection'),
(9,1,'Content-Length'),
(10,1,'Content-MD5'),
(11,1,'Content-Type'),
(12,1,'Cookie'),
(13,1,'DNT'),
(14,1,'Date'),
(15,1,'Expect'),
(16,1,'Front-End-Https'),
(17,1,'Host'),
(18,1,'If-Match'),
(19,1,'If-Modified-Since'),
(20,1,'If-None-Match'),
(21,1,'If-Range'),
(22,1,'If-Unmodified-Since'),
(23,1,'Max-Forwards'),
(24,1,'Origin'),
(25,1,'Pragma'),
(26,1,'Proxy-Authorization'),
(27,1,'If-Range'),
(28,1,'Proxy-Connection'),
(29,1,'Range'),
(30,1,'Referer'),
(31,1,'TE'),
(32,1,'Upgrade'),
(33,1,'User-Agent'),
(34,1,'Via'),
(35,1,'Warning'),
(36,1,'X-ATT-DeviceId'),
(37,1,'X-Forwarded-For'),
(38,1,'X-Forwarded-Proto'),
(39,1,'X-Requested-With'),
(40,1,'X-Wap-Profile'),
(41,2,'Accept-Ranges'),
(42,2,'Access-Control-Allow-Origin'),
(43,2,'Age'),
(44,2,'Allow'),
(45,2,'Cache-Control'),
(46,2,'Connection'),
(47,2,'Content-Disposition'),
(48,2,'Content-Encoding'),
(49,2,'Content-Language'),
(50,2,'Content-Length'),
(51,2,'Content-Location'),
(52,2,'Content-MD5'),
(53,2,'Content-Range'),
(54,2,'Content-Security-Policy'),
(55,2,'Content-Type'),
(56,2,'Date'),
(57,2,'ETag'),
(58,2,'Expires'),
(59,2,'Last-Modified'),
(60,2,'Link'),
(61,2,'Location'),
(62,2,'P3P'),
(63,2,'Pragma'),
(64,2,'Proxy-Authenticate'),
(65,2,'Refresh'),
(66,2,'Retry-After'),
(67,2,'Server'),
(68,2,'Set-Cookie'),
(69,2,'Status'),
(70,2,'Strict-Transport-Security'),
(71,2,'Trailer'),
(72,2,'Transfer-Encoding'),
(73,2,'Vary'),
(74,2,'Via'),
(75,2,'WWW-Authenticate'),
(76,2,'Warning'),
(77,2,'X-Content-Security-Policy'),
(78,2,'X-Content-Type-Options'),
(79,2,'X-Frame-Options'),
(80,2,'X-Powered-By'),
(81,2,'X-UA-Compatible'),
(82,2,'X-WebKit-CSP'),
(83,2,'X-XSS-Protection'),
(84,2,'Accept-Charset'),
(85,2,'Accept-Datetime'),
(86,2,'Accept-Encoding'),
(87,2,'Accept'),
(88,2,'Authorization'),
(89,2,'Cookie'),
(90,2,'DNT'),
(91,2,'Expect'),
(92,2,'Front-End-Https'),
(93,2,'Host'),
(94,2,'If-Match'),
(95,2,'If-Modified-Since'),
(96,2,'If-None-Match'),
(97,2,'If-Range'),
(98,2,'If-Unmodified-Since'),
(99,2,'Max-Forwards'),
(100,2,'Origin'),
(101,2,'Proxy-Authorization'),
(102,2,'Proxy-Connection'),
(103,2,'CavNDFPInstance'),
(104,2,'TE'),
(105,2,'Upgrade'),
(106,2,'User-Agent'),
(107,2,'X-ATT-DeviceId'),
(108,2,'X-Forwarded-For'),
(109,2,'X-Forwarded-Proto'),
(110,2,'X-Requested-With'),
(111,2,'X-Wap-Profile'),
(112,1,'CavNDFPInstance'),
(113,2,'Referer'),
(114,2,'Range');


INSERT INTO config.value_type(val_id,val_type) VALUES
(1,'String'),
(2,'Numeric'),
(3,'Others');


INSERT INTO config.conditional_operator(opt_id,val_id,operators) VALUES
(1,1,'='),
(2,1,'!='),
(3,1,'contains'),
(4,1,'!contains'),
(5,2,'='),
(6,2,'!='),
(7,2,'<'),
(8,2,'<='),
(9,2,'>'),
(10,2,'>='),
(11,3,'PRESENT'),
(12,3,'!PRESENT'),
(13,1,'PRESENT'),
(14,1,'!PRESENT'),
(15,2,'PRESENT'),
(16,2,'!PRESENT');


INSERT INTO config.bussiness_trans_global(bt_global_id, complete, dynamic_req_type, dynamic_req_value, http_method, request_header, request_param, segment_type, segment_uri,
segment_value, slow_transaction, uri_type, very_slow_transaction, profile_id)VALUES
(1, false, false,'httpMethod', true, false, false, 'first', true, 2, 3000, 'segmentOfURI', 5000, 1);


COMMIT;
+
