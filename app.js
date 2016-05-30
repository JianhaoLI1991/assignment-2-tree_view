//global variables  
var categoryDescription = [];
var quantityPerUnit = [];
var unitPrice = [];

function showCategory(index,type){
  var message = "Description:\n " + categoryDescription[index];
  if(type == 1){
    $('#message').show();
    $('#message').text(message);
  }else{
    $( "#dialog" ).attr("title","Category");
    $("#dialogContent").text(message);
    $( "#dialog" ).dialog( "open" );
    
  }
}
function showProduct(index,type){
  var message = "The quantity is: " + quantityPerUnit[index] + " \nthe price is: " + unitPrice[index];
  if(type == 1){
    $('#message').show();
    $('#message').text(message);
  }else{
    $( "#dialog" ).attr("title","Product");
    $("#dialogContent").text(message);
    $( "#dialog" ).dialog( "open" );
  }
}
function loadDoc(url, target) {
  var xhttp;
  if (window.XMLHttpRequest) {
    xhttp = new XMLHttpRequest();
    } else {
    // code for IE6, IE5
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  } 
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      if(target == "category"){
        generateCategoryList(xhttp);
      }else{
        generateProductList(xhttp);
      }
    }
  };
  xhttp.open("GET", url , true);
  xhttp.send();
}

function generateCategoryList(xml) {
  var categoryNameArray = xml.responseXML.getElementsByTagName('CategoryName');
  var categoryDescriptionArray = xml.responseXML.getElementsByTagName('Description');
  for (var i = 0; i < categoryNameArray.length; i++) {
      $('#descriptionList').append('<div id="category' + (i+1) + '""><dt onclick="showCategory(' + (i) + ',1)">' + categoryNameArray[i].childNodes[0].nodeValue + '</dt></div>');
       categoryDescription[i] = categoryDescriptionArray[i].childNodes[0].nodeValue;  //return the description of categories.
      $('#treeRoot').append('<li id="' + i + 'tree">' + categoryNameArray[i].childNodes[0].nodeValue + '<ul id="parent' + (i+1) + '"></ul></li>');
  }  
}

function generateProductList(xml) {
  var productNameArray = xml.responseXML.getElementsByTagName('ProductName');
  var quantityPerUnitArray = xml.responseXML.getElementsByTagName('QuantityPerUnit');
  var unitPriceArray = xml.responseXML.getElementsByTagName('UnitPrice');
  var categoryIDArray = xml.responseXML.getElementsByTagName('CategoryID');
  for (var i = 0; i < productNameArray.length; i++) {
      var $selector = $('#category' +  categoryIDArray[i].childNodes[0].nodeValue);
      $($selector).append('<dd onclick="showProduct(' + (i) + ',1)">' + productNameArray[i].childNodes[0].nodeValue + '</dd>');
      quantityPerUnit[i] = quantityPerUnitArray[i].childNodes[0].nodeValue;  //return the quantity per unit of products.
      unitPrice[i] = unitPriceArray[i].childNodes[0].nodeValue;     //return the unit price of products.
      $selector = $('#parent' +  categoryIDArray[i].childNodes[0].nodeValue);
      $($selector).append('<li id="' + i + 'child">' + productNameArray[i].childNodes[0].nodeValue + '</li>');
  }
  $.jstree.defaults.core.themes.variant = "large";
  $('#jstree').jstree();        //generate the tree view
  $('#jstree').on("changed.jstree", function (e, data) {	//show alert when the tree item is clicked
	var id = data.selected[0];
	var index = parseInt(id);
	var type = 2;
	if(id.indexOf("tree") == 1){
		showCategory(index,type);
	}
	else{
		showProduct(index,type);
    }
	});
}
$(function (){
   loadDoc('categories.xml','category');
   loadDoc('products.xml','product');
   $( "#dialog" ).dialog({
      autoOpen: false,
      show: {
        effect: "blind",
        duration: 200
      },
      hide: {
        effect: "explode",
        duration: 200
      }
    });
 });





