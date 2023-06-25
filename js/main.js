/*
File: main.js
GUI Assignment: HW4 Multiplication Table Pt 2 for 4610
Shawn MacFarland, UMass Lowell Computer Science, shawn_macfarland@student.uml.edu
Copyright (c) 2023 by Shawn MacFarland. All rights reserved. All uses, copies, excerpts
are reaserved exclusively for the author. May not be reused in anyway or cited in anyway 
without author's explicit permission.
created by SM 2023-06-22 10:25AM
Instructor: Professor Wenjin Zhou
Overview: Contains code for input validation and table generation. No2 using jQueryValidation Library.
Supporting 4 sliders and a new tab bar for table creation management.
*/

// Warning Color Toggles
var colorHide = "#8ecae6";
var colorWarn = "#FFB703";
var colorNotice = "#FB8500";

//Tabs Setup
//$("tabs").tabs();
$(function () {
    $("#tabs").tabs();
});


function createTab()
{
    //Get Tabs 
    let tabs = $( "#tabs" ).tabs();
    
    //Build Tab Navigation element
    const mincol = document.getElementById("mincol");
    const maxcol = document.getElementById("maxcol");
    const minrow = document.getElementById("minrow");
    const maxrow = document.getElementById("maxrow");

    tabLabel = "(" + mincol.value + "-" + maxcol.value + ")x(" + minrow.value + "-" + maxrow.value + ")";

    var li = $("<li><a href='#" + tabLabel + "'>" + tabLabel + "</a></li>");
    tabs.find( ".ui-tabs-nav li:last-child").after( li );

    //Clone current Table
    const outputTitle =document.getElementById("outputTitle")
    const output = document.getElementById("output");

    newTitle = outputTitle.cloneNode(true);
    tabTable = output.cloneNode(true);

    // Add cloned contents to new Tab Content Area
    const tabContent = document.createElement('div');
    tabContent.setAttribute("id", tabLabel);
    tabContent.appendChild(newTitle);
    tabContent.appendChild(tabTable);
    tabs.append(tabContent.outerHTML);
    tabs.tabs("refresh");
}

$('#tabnav li').on('dblclick',function(){
    deleteTab();
});

function deleteTab() {
    //Get Tabs 
    let tabs = $( "#tabs" ).tabs();

    //Get Current Tab Id
    let tabLabel = "#" + $.escapeSelector($('#tabnav').find('li.ui-state-active').attr('aria-controls'));
    let href = "a[href='" + tabLabel + "']";

  //  $('[href="#tab2"]').closest('li').hide();

    // Kill tabContent 
    $( tabLabel ).remove();
    $( tabLabel ).remove();
    tabs.tabs( "refresh" );

    // Kill Nav
    $( href ).closest("li").remove()
}

// Slider Setup
$(function () {
    makeSlider("#mincol","#mincol_slider");
    makeSlider("#maxcol","#maxcol_slider");
    makeSlider("#minrow","#minrow_slider");
    makeSlider("#maxrow","#maxrow_slider");
});


function makeSlider(eleName, sliderName) {
    //Create Slider
    $(sliderName).slider({
        min: -50,
        max: 50,
        step: 1,
        value: 0,
        slide: function( event, ui ) {
            //Bind Changes to text box
            $(eleName).val(ui.value);
            $("#matrix_values").validate().element(eleName);
            if ($(eleName).valid())
                Generate();
        }
    });
    var initialValue = $(sliderName).slider("option", "value");
    //Set input to initial value from above
    $(eleName).val(initialValue);
    // Update slider from text box
    $(eleName).change(function() {
        var prev = $(sliderName).slider("option", "value");
        var curr = $(this).val();
        //Test input for an int in grame
        if (!isInt(curr) || curr < -50 || curr > 50) {
            $(sliderName).val(prev);
            resetTable();
        } else {
            $(sliderName).slider("option", "value", curr);
            Generate();
        }
    });
}

// jQuery Validation Code
$.validator.setDefaults({
    errorClass: "message",
})

function isInt(value) {
    // Tests the string by constructing a number
    // This is an awkward construction but need for depends rules
    const num = Number(value);
    if (isNaN(num)) {
        return false;
    }
    if (!Number.isInteger(num)) {
        return false;
    } 
    return true;
}

$.validator.addMethod('inrange', function(value,element) {
    // Tests the string by constructing a number is an Int and checking range 
    const num = Number(value);
    if (!isInt(value)) {
        return false;
    }
    if ( (num < -50) || (num > 50) ) {
        return false
    }
    return true;
}, "Please enter an integer from -50 to 50");

$.validator.addMethod('greaterThan', function(value,element, min_element) {
    // Check if Max > Min
    let $min = $(min_element);
    if (Number($min.val()) > Number(value)) {
        return false;
    }
    return true    
}, "Min exceeds Max. Please increase Max");

$.validator.addMethod('lessThan', function(value,element, max_element) {
    // Check if Max < Min
    let $max = $(max_element);
    if (Number($max.val()) < Number(value))  {
        return false;
    }
    return true    
}, "Min exceeds Max. Please decrease Min ");


$("#matrix_values").validate({
    submitHandler: function(form) {
        createTab();
        Generate();
    },
    rules: {
        mincol: {
            inrange: true,
            required: true,
            lessThan: {
               param: "#maxcol", 
               depends: function (element) {
                   let check = $("#maxcol").val();
                   return ( ( check.length > 0 ) && ( isInt(check)) ) ;
               }
            }
        },
        maxcol: {
            inrange: true,
            required: true,
            greaterThan: {
               param: "#mincol", 
               depends: function (element) {
                   let check = $("#mincol").val();
                   return ( ( check.length > 0 ) && ( isInt(check)) ) ;
               }
            }
        },
        minrow: {
            inrange: true,
            required: true,
            lessThan:  {
               param: "#maxrow", 
               depends: function (element) {
                   let check = $("#maxrow").val();
                   return ( ( check.length > 0 ) && ( isInt(check)) ) ;
               }
            }
        },
        maxrow: {
            inrange: true,
            required: true,
            greaterThan:   {
               param: "#minrow",
               depends: function (element) {
                   let check = $("#minrow").val();
                   return ( ( check.length > 0 ) && ( isInt(check)) ) ;

               }
            }
        }
    },
    highlight: function(element, errorClass) {
        $(element).removeClass(errorClass);
    }
});


// Table Generation
function resetTable() {
    //Grab and Reset outputTitle and output
    const outputTitle =document.getElementById("outputTitle")
    outputTitle.innerHTML="";
    const output = document.getElementById("output");
    output.innerHTML="";
}

function Generate() {
    //Grab and Reset outputTitle and output
    const outputTitle =document.getElementById("outputTitle")
    outputTitle.innerHTML="";
    const output = document.getElementById("output");
    output.innerHTML="";

    // Get the Form Fields
    const mincol = document.getElementById("mincol");
    const maxcol = document.getElementById("maxcol");
    const minrow = document.getElementById("minrow");
    const maxrow = document.getElementById("maxrow");

    //Create non-scrollable title
    const header = document.createElement('h1');
    header.appendChild(document.createTextNode("Multiplication Table"));
    outputTitle.appendChild(header);

    //Create Table with validated bounds
    const table = document.createElement('table');
    output.appendChild(table);
    min_col = Number(mincol.value);
    max_col = Number(maxcol.value);
    min_row = Number(minrow.value);
    max_row = Number(maxrow.value);
    for (let row = min_row-1; row < max_row+1; row++) {
        const current_row = document.createElement('tr');
        for (let col = min_col-1; col < max_col+1; col++) {
            const cell = document.createElement('td');
			if (row == (min_row-1) )  {
				if (col == (min_col-1)) {
                } else {
                    cell.appendChild(document.createTextNode(col));
                }
            } else {
                if (col == min_col-1) {
                    cell.appendChild(document.createTextNode(row));
                } else {
                    cell.appendChild(document.createTextNode(row*col));
                }
            }
			current_row.appendChild(cell);
        }
    table.appendChild(current_row);
    }
}