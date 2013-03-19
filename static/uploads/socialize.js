 var win =Ti.UI.currentWindow;
win.orientationModes = [Titanium.UI.PORTRAIT];
Ti.UI.orientation = Ti.UI.PORTRAIT;

var url = Ti.App.Properties.getString("url");

var headerView =Ti.UI.createView({
   
   backgroundImage:'u6_original.png',
   width:'auto',
   height:50,
   top:0,
   title:'Header',
   
});
var header_label = Ti.UI.createLabel({
    color: '#fff',
    text: "Socialize",
    textAlign: 'center',
    font: {
                        
            fontSize: 22,
            fontWeight: 'bold'
            
    },
});


headerView.add(header_label);

var socialize_mapicon =Titanium.UI.createImageView({
    image:'images/icon1.png',
    height: 47,
    top:3,
    left:5,
    width:41
});

socialize_mapicon.addEventListener("click", function() {
    Ti.UI.currentWindow.close();	
}); 


   var beacon_status = Ti.App.Properties.getString("beacon_status");
	if(beacon_status == 1){
		var beacon_image='newImages/beacon-on.png';
	}
	else{
		var beacon_image='newImages/beacon-off.png';
	}
	var socialize_locicon = Ti.UI.createImageView({
	    backgroundImage:beacon_image,
	    font: {
				fontSize: 22,
		},
		height : 40,
		width : 41,
		top : 7,
		left : 267
	});
headerView.add(socialize_mapicon);
headerView.add(socialize_locicon);
win.add(headerView);

var tableView;
var data = [];

var currentRow = null;
var currentRowIndex = null;
win.addEventListener('open', displayDynamicSocializeData);
function displayDynamicSocializeData(){
	
	var  sid               = Ti.App.Properties.getString('session_id');
	var BeconId            = Ti.App.Properties.getString('Becon_Id');
	var get_socialize_url  = url+"user/index/getupdatemobile/format/json?beacon_id="+BeconId+"&session_id="+sid+"&nextid=";
	var client             = Ti.Network.createHTTPClient();
	client.open("GET", get_socialize_url);
 	Ti.API.info(get_socialize_url);
 	client.send();  
    client.onload=function()
    {
               
               Ti.API.info(this.responseText);
	           var resObj =JSON.parse(this.responseText);
			   var profphoto ='';
			   var body      =''; 
			   var objectPhoto ='';
			   
			   var dayNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
    "Saturday"];
			 
			   if(resObj != null && resObj != undefined)
               {
	                  
	                  var resultObj =resObj.response;
	                  var nextId    =resObj.nextid;
	                  //alert(JSON.stringify(resultObj[0]));
	                  for(j=0;j<resultObj.length; j++){
	                  	
	                        var profphoto ='';   
			                var social_date = resultObj[j].date;
							var maindate    = social_date.split(' ');
							var datefor     = maindate[0];
							var timefor     = maindate[1];
							var dateArr     = datefor.split('-');
						    var timeArr     = timefor.split(':');
						    var today       = new Date();
						    
							var socialdateOBJ =new Date(dateArr[0],dateArr[1]-1,dateArr[2],timeArr[0],timeArr[1],timeArr[2]);
							 
							 var offset    = (today.getTimezoneOffset()*60);
							 var msgtime   = parseInt(socialdateOBJ.getTime()/1000);
							 //var currtime  = parseInt(today.getTime()/1000);
                             var lastWeek = new Date(today.getTime()-1000*60*60*24*7);
                             var midNightTime = new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0);
							 //alert(today.getMonth());
							 if(offset < 0){
							 
							 	var time_diff = msgtime - offset;  
							 	
							 }
							 else{
							 	
							 	var time_diff = msgtime + offset;
							 }
							
							 var finalDate  =new Date(time_diff*1000);
							 var dayWithTime =''; 
							 var dayCount  = (finalDate.getDay())%7;
							 //Date.UTC(2011,7,15)
							 if(finalDate.getTime() > midNightTime.getTime()){
							 	
							 	dayWithTime ="Today"+" "+finalDate.getHours()+":"+finalDate.getMinutes();
							 	
							 }else{
							 	
							 	
							 	  if((finalDate.getTime() > lastWeek.getTime())){
							 	
								 	dayWithTime =dayNames[dayCount];
								 	dayWithTime =dayWithTime+" "+finalDate.getHours()+":"+finalDate.getMinutes();
								 	//alert(finalDate.toLocaleString());
								 }
							
							    else{
								 	
								 
								 	var timeLocale =finalDate.toLocaleString();
								 	timeLocale =timeLocale.substr(0,timeLocale.lastIndexOf(" "));
								 	dayWithTime =timeLocale;
								 	//alert(timeLocale);
								 }
							 }
							 
							 
							var row = Ti.UI.createTableViewRow();
							row.selectedBackgroundColor = '#fff';
							
							row.className = 'datarow';
							row.clickName = 'row';
						    if(resultObj[j].subject_photo !=null && resultObj[j].subject_photo !="")
	                       {
	                             profphoto =Ti.Utils.base64decode(resultObj[j].subject_photo);
	                       }
	                       else
	                       {
	                             profphoto ='images/user.png';    
	                       }  
	                        if(resultObj[j].body !=null && resultObj[j].body !=""){
	                            
	                             body = resultObj[j].body;    
	                        }
	                        else{
	                            
	                            body ="test";
	                        } 
	                            
		           
		                   
							var photo = Ti.UI.createView({
								backgroundImage:profphoto,
								top:5,
								left:10,
								width:50,
								height:50,
								clickName:'photo'
							});
							row.add(photo);
						
							
						    
							var user = Ti.UI.createLabel({
								color:'#1194bf',
								font:{fontSize:17,fontWeight:'bold', fontFamily:'Arial'},
								left:70,
								top:2,
								height:30,
								width:200,
								clickName:'user',
								text:resultObj[j].subject_beacon_id
							});
						
							//row.filter = user.text;
							row.add(user);
						
							var fontSize = 16;
							if (Titanium.Platform.name == 'android') {
								fontSize = 14;
							}
							
							var date = Ti.UI.createLabel({
							color:'#999',
							font:{fontSize:13,fontWeight:'normal', fontFamily:'Arial'},
							left:70,
							top:30,
							height:20,
							width:'auto',
							clickName:'date',
							text:dayWithTime
						});
						row.add(date);
						  var comment = Ti.UI.createLabel({
								color:'#222',
								font:{fontSize:13,fontWeight:'normal', fontFamily:'Arial'},
								clickName:'comment',
								text:body,
								width:200
							});
							row.add(comment);
							 var comment1 = Ti.UI.createLabel({
								color:'#222',
								font:{fontSize:13,fontWeight:'normal', fontFamily:'Arial'},
								clickName:'comment',
								text:'test1',
								width:'auto',
								right:5
							});
							var horizontal_view = Ti.UI.createView({
								backgroundColor:'#fff',
								top:50,
								width:300,
								height:'auto',
								layout:'horizontal'
							});
							
							//horizontal_view.add(comment);
							//horizontal_view.add(comment1);
							
							row.add(comment1);  
					
						
						if(j%2==0){
							
							   var objectPhoto = Ti.UI.createView({
								backgroundImage:'images/test_social.jpg',
								bottom:32,
								width:'100%',
								height:200,
								clickName:'photo'
							});
							row.add(objectPhoto);	
							row.height = 300;
						}
						else{
							
							row.height = 100;
						}
						
						var separator1 = Ti.UI.createView({
                            width:'100%',
					        height:30,
					        backgroundColor:'white',
					        borderWidth: 1,
                            borderColor: '#A1DFF8',
					        bottom:1,
					 
					    });
					    
					   var bordermiddle = Ti.UI.createView({
					    backgroundColor: '#A1DFF8',
					    width: 1,
					    top: 0,
					    bottom: 0,
					    right: '50%',
					    height:30
					  });
					 separator1.add(bordermiddle);
					 row.add(separator1);  
				     data.push(row);
	        }
	        
	       tableView = Titanium.UI.createTableView({
				data:data,
				top:70,
				separatorStyle:Ti.UI.iPhone.TableViewSeparatorStyle.NONE
			 });
		
		
			tableView.addEventListener('click', function(e)
			{
				Ti.API.info('table view row clicked - source ' + e.source);
				// use rowNum property on object to get row number
				var rowNum = e.index;
				
			});

              win.add(tableView);            
	                
       }
    }
    client.onerror=function(e)
    {
     	actInd.hide();
        Ti.API.debug(e.error);
        var dialog = Ti.UI.createAlertDialog({
	    message: 'Some Error Occoured With Webservices!!!',
	    ok: 'Okay',
	    title: 'Error'
	    }).show();
    }
}