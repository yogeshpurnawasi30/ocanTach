var gtmYTplayers = [];

(function( $ ) {
    'use strict';

    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var num_filter = /^\d+$/;

    jQuery('.overlay-loader-blk').hide();
    jQuery('.form-loader').hide();

    jQuery(".contact-cat a").click(function (event) {
        event.preventDefault();
        var enquiryFor = jQuery(this).data('reason');
        jQuery("#enquiry_for").val(enquiryFor);
        jQuery(".contact-cat li.active").removeClass("active", 1000, 'linear');
        jQuery(this).parent().addClass("active", 1000, 'linear');
        jQuery("input[name='email']").attr('placeholder','Work Email*');

        switch(enquiryFor) {
            case "General Inquiries":
                jQuery(".field-callback, .field-careers, .field-quote").hide();
                jQuery(".field-general").show();
                break;
            case "Request a Quote":
                jQuery(".field-callback, .field-careers, .field-general").hide();
                jQuery(".field-quote").show();
                break;
            case "Request a Callback":
                jQuery(".field-quote, .field-careers, .field-general").hide();
                jQuery(".field-callback").show();
                break;
            case "Careers":
                jQuery(".field-quote, .field-callback, .field-general").hide();
                jQuery("input[name='email']").attr('placeholder','Email*');
                jQuery(".field-careers").show();
                break;
        }
    });

    function isDate(txtDate)
    {
        var currVal = txtDate;
        if(currVal == '')
            return false;
        
        var rxDatePattern = /^(\d{1,2})(\/)(\d{1,2})(\/)(\d{2}) (\d{1,2})(:)(\d{1,2})$/; //Declare Regex
        var dtArray = currVal.match(rxDatePattern); // is format OK?
        console.log(dtArray);

        if (dtArray == null) 
            return false;
        
        //Checks for mm/dd/yy format.
        var dtDay= dtArray[1];
        var dtMonth = dtArray[3];
        var dtYear = dtArray[5];        
        var dtHour = dtArray[6];        
        var dtMinute = dtArray[8];        
        
        if (dtMonth < 1 || dtMonth > 12) 
            return false;
        else if (dtDay < 1 || dtDay > 31) 
            return false;
        else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31) 
            return false;
        else if (dtMonth == 2) 
        {
            var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
            if (dtDay> 29 || (dtDay ==29 && !isleap)) 
                    return false;
        } else if (dtHour < 0 || dtHour > 23) 
            return false;
        else if (dtMinute < 0 || dtMinute > 59)
            return false;
        return true;
    }

    /**************************************************/
    /*********  Contact Page form AJAX Submit  ********/
    /**************************************************/

    jQuery("#contact-form, #contact-form-project").submit(function(event) {
        event.preventDefault();
        var $thisForm = $(this);
        var data = {};
        var fieldName = '';
        var popError = false;
        var switchVal  = jQuery('input[name="onoff-formtype"').val();
		var formaction  = $thisForm.find('input[name="action"').val();

        $thisForm.find('span.error-message').remove();
        $thisForm.find('input').each(function(i, field) {
            data[field.name] = field.value;
            fieldName = field.name;
            fieldName = fieldName.replace(/_/gi, " ");
            fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });


            if (field.name == 'full_name') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'email') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'company') {
				if(formaction == "ort_contact_form_ajax"){
					if (field.value == '') {
						$thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please fill in the required field.</span>');
						if (popError == false)
							popError = true;
					}
				}
            } else if (field.name == 'phone') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please enter Phone.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!num_filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please enter number only.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if ( ($thisForm.find("#enquiry_for").val() == "Request a Quote") && field.name == 'services' && field.value=='' ) {
                $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please enter service you are looking for.</span>');
                if (popError == false)
                    popError = true;
            } else if ( ($thisForm.find("#enquiry_for").val() == "Request a Callback" || $thisForm.find("#enquiry_for").val() == "Booking a Meeting") && (field.name == 'callback_timeslots1' || field.name == 'callback_timeslots2' )) {
                if(field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please provide callback time slots.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if ( ($thisForm.find("#enquiry_for").val() == "Careers") && field.name == 'cv_file' ) {
                if($thisForm.find('#fileupload').val()==""){
                    $thisForm.find('input[name="' + field.name + '"]').val('').parent().addClass('error').after('<span class="error-message text-red">Please upload your resume.</span>');
                        if (popError == false)
                            popError = true;
                }else{
                    var ext = $thisForm.find('#fileupload').val().split('.').pop().toLowerCase();
                    if(jQuery.inArray(ext, ['pdf','doc','docx']) == -1) {
                        $thisForm.find('input[name="' + field.name + '"]').val('').parent().addClass('error').after('<span class="error-message text-red">Invalid file type. Only PDF, DOC & DOCX files are allowed.</span>');
                        if (popError == false)
                            popError = true;
                    }
                }
            } 
            
        });

        if( ($thisForm.find(".chkSkillsets").length > 0 ) && ( $thisForm.find(".chkSkillsets:checked").length < 1) && switchVal == "build-my-team") {
            $thisForm.find('.groupSkillset').addClass('error').append('<span class="error-message text-red">Select atleast one skill.</span>');
            if (popError == false)
                popError = true;
        }

        if( ($thisForm.find(".chkSkillsets").length > 0 ) && ( $thisForm.find(".chkSkillsets:checked").length < 1) && $thisForm.find("#enquiry_for").val() == "General Inquiries") {
            $thisForm.find('.groupSkillset').addClass('error').append('<span class="error-message text-red">Select atleast one skill.</span>');
            if (popError == false)
                popError = true;
        }
		
		if( ($thisForm.find(".chkSkillsets").length > 0 ) && ( $thisForm.find(".chkSkillsets:checked").length < 1) && $thisForm.find("#enquiry_for").val() == "A Project") {
            $thisForm.find('.groupSkillset').addClass('error').append('<span class="error-message text-red">Select atleast one service.</span>');
            if (popError == false)
                popError = true;
        }

        if( ($thisForm.find('input[name="drop_line"]').val()=="") && ($thisForm.find("#enquiry_for").val() == "General Inquiries" || $thisForm.find("#enquiry_for").val() == "A Project")) {
            $thisForm.find('input[name="drop_line"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
            if (popError == false)
                popError = true;
        }

        if( ($thisForm.find('input[name="certifications_docs"]').val()=="") && ($thisForm.find('input[name="job_description"]').val()=="")  && (switchVal == "build-my-team" || formaction == "ort_contact_form_ajax")) {
            $thisForm.find('.file-or-txt').addClass('error').append('<span class="error-message text-red">Please provide job description.</span>');
            if (popError == false)
                popError = true;
        }

        if (popError == true) {
            $thisForm.addClass('invalid');
            $thisForm.find(".error-message").show();
            return false;
        } else {

            $thisForm.removeClass('invalid');
            $thisForm.find(".error-message").hide();
            var form = $thisForm.serialize();

            jQuery.ajax({
                type: 'POST',
                url: adminurl,
                data: new FormData(this),
                dataType: 'json',
                contentType: false,
                cache: false,
                processData:false,
                beforeSend: function() {
                    $thisForm.find('.form-loader').show();
                },
                success: function(data) {

                    if (data.result == 'fail') {
                        $thisForm.find('.ajax-message').html(data.message).show();
                        $thisForm.find('.form-loader').hide();
                    } else {
                        $thisForm.find('.form-loader').hide();
                        $thisForm.find('.ajax-message').html(data.message).show();
                        $thisForm.trigger("reset");
                        setTimeout(function() {
                            $thisForm.find('.ajax-message').hide();
                        }, 3000);
                    }
                },
                error: function() {
                    alert("Error: There is some issue please try again.")
                }
            });
        }
    });

    /*jQuery("#contact-form").submit(function(event) {
        event.preventDefault();
        var $thisForm = $(this);
        var data = {};
        var fieldName = '';
        var popError = false;

        $thisForm.find('span.error-message').remove();
        jQuery('form#contact-form').find('input').each(function(i, field) {
            data[field.name] = field.value;
            fieldName = field.name;
            fieldName = fieldName.replace(/_/gi, " ");
            fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });


            if (field.name == 'full_name') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'email') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'phone') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please enter Phone.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!num_filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please enter number only.</span>');
                    if (popError == false)
                        popError = true;
                }
            } 
            
        });

        if (popError == true) {
            $thisForm.addClass('invalid');
            jQuery(".error-message").show();
            return false;
        } else {

            $thisForm.removeClass('invalid');
            jQuery(".error-message").hide();
            var form = $thisForm.serialize();

            jQuery.ajax({
                type: 'POST',
                url: adminurl,
                data: form,
                dataType: 'json',
                beforeSend: function() {
                    $thisForm.find('.form-loader').show();
                },
                success: function(data) {

                    if (data.result == 'fail') {
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.find('.form-loader').hide();
                    } else {
                        $thisForm.find('.form-loader').hide();
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.trigger("reset");
                    }
                },
                error: function() {
                    alert("Error: There is some issue please try again.")
                }
            });
        }
    });*/

    /**************************************************/
    /*********  Newsletter form AJAX Submit  ********/
    /**************************************************/

    jQuery("#newslater-form").submit(function(event) {
        event.preventDefault();
        var $thisForm = $(this);
        var data = {};
        var fieldName = '';
        var popError = false;

        $thisForm.find('span.error-message').remove();
        jQuery('form#newslater-form').find('input').each(function(i, field) {
            data[field.name] = field.value;
            fieldName = field.name;
            fieldName = fieldName.replace(/_/gi, " ");
            fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });


            if (field.name == 'email') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Enter Email Address.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                    if (popError == false)
                        popError = true;
                }
            }
            
        });

        if (popError == true) {
            $thisForm.addClass('invalid');
            jQuery(".error-message").show();
            return false;
        } else {

            $thisForm.removeClass('invalid');
            jQuery(".error-message").hide();
            var form = $thisForm.serialize();

            jQuery.ajax({
                type: 'POST',
                url: adminurl,
                data: form,
                dataType: 'json',
                beforeSend: function() {
                    $thisForm.find('.form-loader').show();
                },
                success: function(data) {

                    if (data.result == 'fail') {
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.find('.form-loader').hide();
                    } else {
                        $thisForm.find('.form-loader').hide();
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.trigger("reset");
                    }
                },
                error: function() {
                    alert("Error: There is some issue please try again.")
                }
            });
        }
    });
    
    /**************************************************/
    /*********  Newsletter Popup form AJAX Submit  ********/
    /**************************************************/

    jQuery("#newslater-popup-form").submit(function(event) {
        event.preventDefault();
        var $thisForm = $(this);
        var data = {};
        var fieldName = '';
        var popError = false;

        $thisForm.find('span.error-message').remove();
        jQuery('form#newslater-popup-form').find('input').each(function(i, field) {
            data[field.name] = field.value;
            fieldName = field.name;
            fieldName = fieldName.replace(/_/gi, " ");
            fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });


            if (field.name == 'email') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                    if (popError == false)
                        popError = true;
                }
            }
            
        });

        if (popError == true) {
            $thisForm.addClass('invalid');
            jQuery(".error-message").show();
            return false;
        } else {

            $thisForm.removeClass('invalid');
            jQuery(".error-message").hide();
            var form = $thisForm.serialize();

            jQuery.ajax({
                type: 'POST',
                url: adminurl,
                data: form,
                dataType: 'json',
                beforeSend: function() {
                    $thisForm.find('.form-loader').show();
                },
                success: function(data) {

                    if (data.result == 'fail') {
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.find('.form-loader').hide();
                    } else {
                        $thisForm.find('.form-loader').hide();
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.trigger("reset");
                    }
                },
                error: function() {
                    alert("Error: There is some issue please try again.")
                }
            });
        }
    });


    /**************************************************/
    /*********  Rate Card form AJAX Submit  ********/
    /**************************************************/


    function get_current_page_id() {
        var page_body = $('body.page');

        var id = 0;

        if(page_body) {
            var classList = page_body.attr('class').split(/\s+/);

            $.each(classList, function(index, item) {
                if (item.indexOf('page-id') >= 0) {
                    var item_arr = item.split('-');
                    id =  item_arr[item_arr.length -1];
                    return false;
                }
            });
        }
        return id;
    }
    jQuery("#rate_card-form").submit(function(event) {
        event.preventDefault();
        var $thisForm = $(this);
        var data = {};
        var fieldName = '';
        var popError = false;

        $thisForm.find('span.error-message').remove();
        jQuery('form#rate_card-form').find('input').each(function(i, field) {
            data[field.name] = field.value;
            fieldName = field.name;
            fieldName = fieldName.replace(/_/gi, " ");
            fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });


            if (field.name == 'full_name') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'email') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                    if (popError == false)
                        popError = true;
                }
            }
            
        });

        if (popError == true) {
            $thisForm.addClass('invalid');
            jQuery(".error-message").show();
            return false;
        } else {

            $thisForm.removeClass('invalid');
            jQuery(".error-message").hide();
            var form = $thisForm.serialize();

            jQuery.ajax({
                type: 'POST',
                url: adminurl,
                data: form+'&id='+get_current_page_id(),
                dataType: 'json',
                beforeSend: function() {
                    $thisForm.find('.form-loader').show();
                },
                success: function(data) {

                    if (data.result == 'fail') {
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.find('.form-loader').hide();
                    } else {
                        $thisForm.find('.form-loader').hide();
                        $thisForm.find('.ajax-message').html(data.message);
                        // window.open(data.download, 'Download');                       

                        if(typeof data.download !== 'undefined')
                        {
                            setTimeout( startDownload(data.download), 2000);
                        }
						
						if( jQuery("#rate-card-url").length ){
							jQuery("#rate-card-url").submit();
						}
						
                        $thisForm.trigger("reset");
                    }
                },
                error: function() {
                    alert("Error: There is some issue please try again.")
                }
            });
        }
    });

    /**************************************************/
    /*********  Enquiry Form AJAX Submit  ********/
    /**************************************************/
    jQuery("input[id='which_service_are_you_interested_in_one_other']").click(function() {
        if(jQuery("input[id='which_service_are_you_interested_in_one_other']:checked").length > 0) {
            jQuery(".textbox").show();
        } else {
            jQuery(".textbox").hide();
        }
    });
    jQuery("input[id='what_are_your_preferred_paid_marketing_channels_other']").click(function() {
        if(jQuery("input[id='what_are_your_preferred_paid_marketing_channels_other']:checked").length > 0) {
            jQuery(".textbox").show();
        } else {
            jQuery(".textbox").hide();
        }
    });
    jQuery("select[name='what_is_your_preferred_web_development_technology']").change(function() {
        if(jQuery("select[name='what_is_your_preferred_web_development_technology']").val() == "Others") {
            jQuery(".textbox").show();
        } else {
            jQuery(".textbox").hide();
        }
    });
    jQuery("select[name='what_is_your_preferred_esp']").change(function() {
        if(jQuery("select[name='what_is_your_preferred_esp']").val() == "Others") {
            jQuery(".textbox").show();
        } else {
            jQuery(".textbox").hide();
        }
    });
    jQuery("input[id='which_digital_marketing_services_you_need_other']").click(function() {
        if(jQuery("input[id='which_digital_marketing_services_you_need_other']:checked").length > 0) {
            jQuery(".textbox").show();
        } else {
            jQuery(".textbox").hide();
        }
    });

    jQuery(".which_digital_marketing").click(function() {
        if(jQuery(this).prop("checked")) {
            jQuery(this).parents('.optionBox').find(".sub-bx").show();
        } else {
            jQuery(this).parents('.optionBox').find(".sub-bx").hide();
            // uncheck the radio options if any selected.
            var elementId = jQuery(this).attr('id');
            if(elementId == "which_digital_marketing_services_you_need_1"  ) {                
                jQuery(".smm_monthly_media_budget").prop("checked", false);
            } else if(elementId == "which_digital_marketing_services_you_need_2") {                
                jQuery("input[name='mention_the_website_for_which_you_need_seo']").val("");
            } else if(elementId == "which_digital_marketing_services_you_need_4") {                
                jQuery(".sem_how_much_is_your_monthly_budget").prop("checked", false);
            } else if(elementId == "which_digital_marketing_services_you_need_5") {                
                jQuery("input[name='other_digital_marketing_services_you_need']").val("");
            }
        }
    });


    // contact us hire talent checkbox
    jQuery(".select_talent").click(function() {
        if(jQuery(this).prop("checked")) {
            jQuery(this).parents('.optionList').find(".sub-bx").show();
        } else {
            jQuery(this).parents('.optionList').find(".sub-bx").hide();
            //if unchecked also uncheck all the checkbox under that category
            jQuery(this).parents('.optionList').find(".sub-bx.hire-checks .optionBox input[type='checkbox']").prop('checked', false);
            jQuery(this).parents('.optionList').find(".sub-bx.hire-checks .optionbox input[type='checkbox']").prop('checked', false);
        }
    });
    
    //SQL pop up 
    jQuery(".select-role").click(function(){
        if(jQuery(this).prop("checked")) {
            var roletype = jQuery(this).val();
            if(roletype=="Developers"){
                jQuery("#developer-role").addClass("active");
                jQuery("#marketer-role").removeClass("active");
                jQuery("#designer-role").removeClass("active");
            }
            if(roletype=="Marketers"){
                
                jQuery("#marketer-role").addClass("active");
                jQuery("#developer-role").removeClass("active");
                jQuery("#designer-role").removeClass("active");
            }
            if(roletype=="Designers"){
                jQuery("#designer-role").addClass("active");
                jQuery("#developer-role").removeClass("active");
                jQuery("#marketer-role").removeClass("active");
            }  
        }
        
        }
    );
    

   
    jQuery("#rate_card_form, #employee-referral-form, #enquiry-form, #network-form, #callback-form, #popup-validation, .poc-form, #paid-form, #quotes-form, #covid-survey-form, #guide-to-building-offshore-teams, #offshore-regions-comparison-guide").submit(function(event) {
        event.preventDefault();
        var $thisForm = $(this);
        var data = {};
        var fieldName = '';
        var popError = false;

        var form_id = $(this).attr("id");
		var form_action = $(this).find("input[name='action']").val();

        $thisForm.find('span.error-message').remove();
        jQuery(this).find('input, textarea, select').each(function(i, field) {
            data[field.name] = field.value;
            fieldName = field.name;
            fieldName = fieldName.replace(/_/gi, " ");
            fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });


            if (field.name == 'full_name') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'firstname') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'lastname') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'email') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'phone') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'company') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
			} else if (field.name == 'looking-to-hire') {
                if (field.value == '') {
                    $thisForm.find('select[name="' + field.name + '"]').parent().addClass('error').after('<span class="error-message">Please select one option.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'how_experienced_talent') {
                if (field.value == '') {
                    $thisForm.find('select[name="' + field.name + '"]').parent().addClass('error').after('<span class="error-message">Please select one option.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'jd_message') {
                if (field.value == '') {
                    if($thisForm.find('input[name="certifications_docs"]').val()==''){
                        $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in atleast one required field.</span>');
                        if (popError == false)
                            popError = true;      
                    }
                }
            } else if (field.name == 'website') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'refer_name') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'refer_email') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'checkbox') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            }
            else if (field.name == 'emp_name') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            }
            else if (field.name == 'emp_official_email') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            }
            else if (field.name == 'candidate_name') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            }
            else if (field.name == 'position_refer') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            }
            else if (field.name == 'share_your_requirement') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            }
            else if (field.name == 'candidate_resume' ) {
                var ext = jQuery('#fileupload').val().split('.').pop().toLowerCase();
                if(jQuery.inArray(ext, ['pdf','doc','docx']) == -1) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Invalid file type. Only PDF, DOC & DOCX files are allowed.</span>');
                    if (popError == false)
                        popError = true;
                }
            }
            else if (field.name == 'certifications_docs' ) {
                if($thisForm.find('input[name="certifications_docs"]').val()!=''){
                    var ext = jQuery('#certifications_docs').val().split('.').pop().toLowerCase();
                    if(jQuery.inArray(ext, ['pdf', 'doc', 'docx','jpg','jpeg']) == -1) {
                        $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Invalid file type. Only PDF, DOC & DOCX files are allowed.</span>');
                        if (popError == false)
                            popError = true;

                    }
                }else{
                   if(form_action != "review_candidate_resumes_form_ajax") {
                        if($thisForm.find('input[name="jd_message"]').val()==''){
                            $thisForm.find('input[name="certifications_docs"]').addClass('error').after('<span class="error-message">Please fill in atleast one required field.</span>');
                            if (popError == false)
                                popError = true;
                        } 
                   }else{
                        $thisForm.find('input[name="certifications_docs"]').addClass('error').after('<span class="error-message">Please fill in this required field.</span>');
                        if (popError == false)
                            popError = true;
                   }
                   
                }
            }
			else if (field.name == 'message') {
				//if(form_action !="talent_get_in_touch"){
					if (field.value == '') {
						$thisForm.find('textarea[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
						if (popError == false)
							popError = true;
					}
				//}
            }
            else if(field.name === 'level-commitment'){
                if($thisForm.find("input:radio[name="+field.name+"]:checked").length == 0){
                    if(!$(this).parent().parent().parent().hasClass('error')){
                        $(this).parent().parent().parent().addClass('error').append('<span class="error-message col-sm-12">Please fill in the required field.</span>');
                        if (popError == false)
                            popError = true;
                    }
                }
            }   
            else if(field.name === 'opt-in'){
                if($thisForm.find("input:checkbox[name="+field.name+"]:checked").length == 0){
                    if(!$(this).parent().parent().parent().hasClass('error')){
                        $(this).parent().parent().addClass('error').append('<span class="error-message">Please fill in the required field.</span>');
                        if (popError == false)
                            popError = true;
                    }
                }
            }
            else if(field.name === 'share_your_requirements') {
				if($thisForm.find("input[name=action]").val() == "upl_home_digital_marketing_form_ajax"){
					if($thisForm.find("textarea[name="+field.name+"]").val() == "" || $thisForm.find("textarea[name="+field.name+"]").val().length < "250"){
						if(!$(this).parent().parent().parent().hasClass('error')){
							$(this).parent().parent().addClass('error').append('<span class="error-message">Please provide more detail.</span>');
							if (popError == false)
								popError = true;
						}
					}
                }else if($thisForm.find("input[name=action]").val() == "upl_digital_marketing_ratecard_form_ajax" || $thisForm.find("input[name=action]").val() == "upl_digital_marketing_get_in_touch_form_ajax"){
                    if($thisForm.find("textarea[name="+field.name+"]").val() == ""){
                        if(!$(this).parent().parent().hasClass('error')){
                            $(this).parent().parent().addClass('error').append('<span class="error-message">Please provide more detail.</span>');
                            if (popError == false)
                                popError = true;
                        }
                    }
                }else if($thisForm.find("input[name=action]").val() == "upl_digital_outsourcing_web_dev_form_ajax"){
                    if($thisForm.find("textarea[name="+field.name+"]").val() == ""){
                        if(!$(this).parent().hasClass('error')){
                            $(this).parent().addClass('error').append('<span class="error-message">Please provide more detail.</span>');
                            if (popError == false)
                                popError = true;
                        }
                    }
				}else{
					if($thisForm.find("textarea[name="+field.name+"]").val() == "" || $thisForm.find("textarea[name="+field.name+"]").val().length < "150"){
						if(!$(this).parent().parent().parent().hasClass('error')){
							$(this).parent().parent().addClass('error').append('<span class="error-message">Please provide more detail.</span>');
							if (popError == false)
								popError = true;
						}
					}
				}
            }
        });
		
		
		// check for "time slot 1"
		if ($thisForm.find("input[name='day_1']").val() == '' || $thisForm.find("input[name='month_1']").val() == '' || $thisForm.find("input[name='hour_1']").val() == '' || $thisForm.find("input[name='minute_1']").val() == '') {
			
			$thisForm.find('input[name="day_1"]').parent().parent().addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
			if (popError == false)
				popError = true;
			
		}
		
		// check for "time slot 2"
		if ($thisForm.find("input[name='day_2']").val() == '' || $thisForm.find("input[name='month_2']").val() == '' || $thisForm.find("input[name='hour_2']").val() == '' || $thisForm.find("input[name='minute_2']").val() == '') {
			
			$thisForm.find('input[name="day_2"]').parent().parent().addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
			if (popError == false)
				popError = true;
			
		}


        // check for "star ratings"
        if( ($thisForm.find("input[name='technical_expertise']").length > 0) ) {
            if(($thisForm.find("input[name='technical_expertise']:checked").length == 0)) {
                $thisForm.find("input[name='technical_expertise']").parent().parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one star.</span>');
                if (popError == false)
                    popError = true;  
            } 
        }

        if( ($thisForm.find("input[name='requirment_understanding']").length > 0) ) {
            if(($thisForm.find("input[name='requirment_understanding']:checked").length == 0)) {
                $thisForm.find("input[name='requirment_understanding']").parent().parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one star.</span>');
                if (popError == false)
                    popError = true;
            } 
        }


        if( ($thisForm.find("input[name='quality_of_work']").length > 0) ) {
            if(($thisForm.find("input[name='quality_of_work']:checked").length == 0)) {
                $thisForm.find("input[name='quality_of_work']").parent().parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one star.</span>');
                if (popError == false)
                    popError = true;
            } 
        }


        if( ($thisForm.find("input[name='ownership']").length > 0) ) {
            if(($thisForm.find("input[name='ownership']:checked").length == 0)) {
                $thisForm.find("input[name='ownership']").parent().parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one star.</span>');
                if (popError == false)
                    popError = true;
            } 
        }


        if( ($thisForm.find("input[name='overall_experience']").length > 0) ) {
            if(($thisForm.find("input[name='overall_experience']:checked").length == 0)) {
                $thisForm.find("input[name='overall_experience']").parent().parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one star.</span>');
                if (popError == false)
                    popError = true;
            } 
        }


        // check for "expertise_level"
        if( ($thisForm.find("input[name^='expertise_level']").length > 0) ) {
            if((jQuery("input[name^='expertise_level']:checked").length == 0)) {
                if(!jQuery("input[name^='expertise_level']").parent().parent().parent().parent().hasClass('error')){
                    jQuery("input[name^='expertise_level']").parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;
                }
            } 
        }

		
		// check for "digital_marketer_hire"
        if( ($thisForm.find("input[name^='digital_marketer_hire']").length > 0) ) {
            if((jQuery("input[name^='digital_marketer_hire']:checked").length == 0)) {
                if(!jQuery("input[name^='digital_marketer_hire']").parent().parent().parent().parent().hasClass('error')){
                    jQuery("input[name^='digital_marketer_hire']").parent().parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;
                }
            } 
        }
		
		
		// check for "web_developer_hire"
        if( ($thisForm.find("input[name^='web_developer_hire']").length > 0) ) {
            if((jQuery("input[name^='web_developer_hire']:checked").length == 0)) {
                if(!jQuery("input[name^='web_developer_hire']").parent().parent().parent().parent().hasClass('error')){
                    jQuery("input[name^='web_developer_hire']").parent().parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;
                }
            } 
        }
		
        // check for "frontend_looking_hire"
        if( ($thisForm.find("input[name^='frontend_looking_hire']").length > 0) ) {
            if((jQuery("input[name^='frontend_looking_hire']:checked").length == 0)) {
                if(!jQuery("input[name^='frontend_looking_hire']").parent().parent().parent().parent().hasClass('error')){
                    jQuery("input[name^='frontend_looking_hire']").parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;
                }
            } 
        }

        // check for "expertise_level"
        if( ($thisForm.find("input[name^='how_soon_do_you_want_to_start_the_project_']").length > 0) ) {
            if((jQuery("input[name^='how_soon_do_you_want_to_start_the_project_']:checked").length == 0)) {
                if(!jQuery("input[name^='how_soon_do_you_want_to_start_the_project_']").parent().parent().parent().parent().hasClass('error')){
                    jQuery("input[name^='how_soon_do_you_want_to_start_the_project_']").parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;
                }
            } 
        }

        // check for "expertise_level"
        if( ($thisForm.find("input[name^='commitment_expecting']").length > 0) ) {
            if((jQuery("input[name^='commitment_expecting']:checked").length == 0)) {
                if(!jQuery("input[name^='commitment_expecting']").parent().parent().parent().parent().hasClass('error')){
                    jQuery("input[name^='commitment_expecting']").parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;
                }
            } 
        }

        // check for "What services are you looking for?"
        if( ($thisForm.find("input[name^='which_service_are_you_interested_in_one']").length > 0) ) {
            if((jQuery("input[name^='which_service_are_you_interested_in_one']:checked").length == 0)) {
                if(!jQuery("input[name^='which_service_are_you_interested_in_one']").parent().parent().parent().parent().hasClass('error')){
                    jQuery("input[name^='which_service_are_you_interested_in_one']").parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if( (jQuery("input[id='which_service_are_you_interested_in_one_other']:checked").length > 0) && (jQuery("input[name='which_service_are_you_interested_in_one_other']").val() == "")) {
                if(!jQuery("input[name='which_service_are_you_interested_in_one_other']").parent().parent().hasClass('error')){
                    jQuery("input[name='which_service_are_you_interested_in_one_other']").parent().addClass('error').append('<span class="error-message">Please specify the other option.</span>');
                    if (popError == false)
                        popError = true;
                }
            } 
        }

        // check for "preferred_paid_marketing_channels?"
        if( ($thisForm.find("input[name^='what_are_your_preferred_paid_marketing_channels']").length > 0) ) {
            if((jQuery("input[name^='what_are_your_preferred_paid_marketing_channels']:checked").length == 0)) {
                if(!jQuery("input[name^='what_are_your_preferred_paid_marketing_channels']").parent().parent().parent().parent().hasClass('error')){
                    jQuery("input[name^='what_are_your_preferred_paid_marketing_channels']").parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if( (jQuery("input[id='what_are_your_preferred_paid_marketing_channels_other']:checked").length > 0) && (jQuery("input[name='what_are_your_preferred_paid_marketing_channels_other']").val() == "")) {
                if(!jQuery("input[name='what_are_your_preferred_paid_marketing_channels_other']").parent().parent().hasClass('error')){
                    jQuery("input[name='what_are_your_preferred_paid_marketing_channels_other']").parent().addClass('error').append('<span class="error-message">Please specify the other option.</span>');
                    if (popError == false)
                        popError = true;
                }
            } 
        }

        // check for "what_is_your_preferred_web_development_technology"
        if(($thisForm.find("select[name='what_is_your_preferred_web_development_technology']").val() == "Others") && $thisForm.find("input[name='what_is_your_preferred_web_development_technology_other']").val() == "" ) {
            if(!jQuery("input[name='what_is_your_preferred_web_development_technology_other']").parent().parent().hasClass('error')){
                jQuery("input[name='what_is_your_preferred_web_development_technology_other']").parent().addClass('error').append('<span class="error-message">Please specify the other option.</span>');
                if (popError == false)
                    popError = true;
            }
        }

        // check for "what_is_your_preferred_esp"
        if(($thisForm.find("select[name='what_is_your_preferred_esp']").val() == "Others") && jQuery("input[name='what_is_your_preferred_esp_other']").val() == "" ) {
            if(!jQuery("input[name='what_is_your_preferred_esp_other']").parent().parent().hasClass('error')){
                jQuery("input[name='what_is_your_preferred_esp_other']").parent().addClass('error').append('<span class="error-message">Please specify the other option.</span>');
                if (popError == false)
                    popError = true;
            }
        }

        // check for "which_digital_marketing_services_you_need?"
        if( ($thisForm.find("input[name^='which_digital_marketing_services_you_need']").length > 0) ) {
            if((jQuery("input[name^='which_digital_marketing_services_you_need']:checked").length == 0)) {
                if(!jQuery("input[name^='which_digital_marketing_services_you_need']").parent().parent().parent().parent().hasClass('error')){
                    jQuery("input[name^='which_digital_marketing_services_you_need']").parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;
                }
            } 
            if( (jQuery("input[id='which_digital_marketing_services_you_need_2']:checked").length > 0) && (jQuery("input[name='mention_the_website_for_which_you_need_seo']").val() == "")) {
                if(!jQuery("input[name='mention_the_website_for_which_you_need_seo']").parent().parent().hasClass('error')){
                    jQuery("input[name='mention_the_website_for_which_you_need_seo']").parent().addClass('error').append('<span class="error-message">Please specify the value.</span>');
                    if (popError == false)
                        popError = true;
                }
            } 
            if((jQuery("input[id='which_digital_marketing_services_you_need_1']:checked").length > 0) && (jQuery("input[name='what_is_your_monthly_media_budget_for_social_media_marketing']:checked").length == 0)) {
                if(!jQuery("input[name='what_is_your_monthly_media_budget_for_social_media_marketing']").parent().parent().hasClass('error')){
                    jQuery("input[name='what_is_your_monthly_media_budget_for_social_media_marketing']").parent().parent().parent().addClass('error').append('<span class="error-message">Please specify the value.</span>');
                    if (popError == false)
                        popError = true;
                }
            } 
            if( (jQuery("input[id='which_digital_marketing_services_you_need_4']:checked").length > 0) && (jQuery("input[name='sem_how_much_is_your_monthly_budget']:checked").length == 0)) {
                if(!jQuery("input[name='sem_how_much_is_your_monthly_budget']").parent().parent().hasClass('error')){
                    jQuery("input[name='sem_how_much_is_your_monthly_budget']").parent().parent().parent().addClass('error').append('<span class="error-message">Please specify the value.</span>');
                    if (popError == false)
                        popError = true;
                }
            }
            if( (jQuery("input[id='which_digital_marketing_services_you_need_5']:checked").length > 0) && (jQuery("input[name='other_digital_marketing_services_you_need']").val() == "")) {
                if(!jQuery("input[name='other_digital_marketing_services_you_need']").parent().parent().hasClass('error')){
                    jQuery("input[name='other_digital_marketing_services_you_need']").parent().addClass('error').append('<span class="error-message">Please specify the other option.</span>');
                    if (popError == false)
                        popError = true;
                }                
            } 
        }


        if($thisForm.find("input[name='action']").val() == "review_candidate_resumes_form_ajax"){

            if( ($thisForm.find("input[type='checkbox'][name='developer_type[]']").length > 0) ) {
                if(($thisForm.find("input[type='checkbox'][name='developer_type[]']:checked").length == 0) && $thisForm.find("input[name='developer_type_other']").val() == "") {
                    $thisForm.find("input[type='checkbox'][name='developer_type[]']").parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;   
                } 

                if(($thisForm.find("input[type='checkbox'][value='Web Developer']").is(':checked')) && ($thisForm.find("input[type='checkbox'][name='developer_type[Web Developer][]']:checked").length == 0)) {
                    $thisForm.find("input[type='checkbox'][name='developer_type[Web Developer][]']").parent().parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;   
                }

                if(($thisForm.find("input[type='checkbox'][value='Software Developer']").is(':checked')) && ($thisForm.find("input[type='checkbox'][name='developer_type[Software Developer][]']:checked").length == 0)) {
                    $thisForm.find("input[type='checkbox'][name='developer_type[Software Developer][]']").parent().parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;   
                }

                if(($thisForm.find("input[type='checkbox'][value='App Developer']").is(':checked')) && ($thisForm.find("input[type='checkbox'][name='developer_type[App Developer][]']:checked").length == 0)) {
                    $thisForm.find("input[type='checkbox'][name='developer_type[App Developer][]']").parent().parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;   
                }

                if(($thisForm.find("input[type='checkbox'][value='Digital Marketer']").is(':checked')) && ($thisForm.find("input[type='checkbox'][name='developer_type[Digital Marketer][]']:checked").length == 0)) {
                    $thisForm.find("input[type='checkbox'][name='developer_type[Digital Marketer][]']").parent().parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;   
                }

                if(($thisForm.find("input[type='checkbox'][value='Email Marketer']").is(':checked')) && ($thisForm.find("input[type='checkbox'][name='developer_type[Email Marketer][]']:checked").length == 0)) {
                    $thisForm.find("input[type='checkbox'][name='developer_type[Email Marketer][]']").parent().parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;   
                }

                if(($thisForm.find("input[type='checkbox'][value='Designer']").is(':checked')) && ($thisForm.find("input[type='checkbox'][name='developer_type[Designer][]']:checked").length == 0)) {
                    $thisForm.find("input[type='checkbox'][name='developer_type[Designer][]']").parent().parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;   
                }
                
            }
        }




        if (popError == true) {
            $thisForm.addClass('invalid');
            jQuery(".error-message").show();
            return false;
        } else {
            $thisForm.removeClass('invalid');
            jQuery(".error-message").hide();
            var form = $thisForm.serialize();

            if(form_id == "employee-referral-form") {
                var fd = new FormData();
                var file = jQuery(document).find('input[type="file"]');
                var individual_file = file[0].files[0];
                fd.append("candidate_resume", individual_file);
                fd.append("full_name", jQuery("input[name='full_name']").val());  
                fd.append("email", jQuery("input[name='email']").val());  
                fd.append("emp_id", jQuery("input[name='emp_id']").val());  
                fd.append("emp_official_email", jQuery("input[name='emp_official_email']").val());  
                fd.append("candidate_name", jQuery("input[name='candidate_name']").val());  
                fd.append("position_refer", jQuery("input[name='position_refer']").val());  
                fd.append("associated-uplers", jQuery("input[name='how_are_you_associated_with_uplers']:checked").val());  
                fd.append("candidate_phone", jQuery("input[name='phone']").val());  
                fd.append("page_title", jQuery("input[name='page_title']").val());  
                fd.append('action', 'employee_referral_form_ajax');              

                jQuery.ajax({
                    type: 'POST',
                    url: adminurl,
                    data: fd,
                    contentType: false,
                    dataType: 'json',
                    processData: false,
                    beforeSend: function() {
                        $thisForm.find('.form-loader').show();
                    },
                    success: function(data) {

                        console.log('success');

                        if (data.result == 'fail') {
                            console.log('success if');
                            $thisForm.find('.ajax-message').html(data.message);
                            $thisForm.find('.form-loader').hide();
                        } else {
                            console.log('success else'); 
                            $thisForm.find('.form-loader').hide();
                            $thisForm.find('.ajax-message').html(data.message);

                            if(typeof data.ebook !== 'undefined')
                            {
                                setTimeout(function(){
                                    window.open(data.ebook,'_blank');
                                }, 2000);
                            }
                            
                            $thisForm.trigger("reset");
                        }
                    },
                    error: function(err) {
                        alert("Error: There is some issue please try again.");
                        console.log(err);
                    }
                });

            }else if(form_id == "enquiry-form") {
				
				if(form_action=="remote_talent_get_in_touch" || form_action=="upl_remote_talent_ppc_ratecard" || form_action=="upl_hire_talent_lead" || form_action=="upl_digital_outsourcing_company_rate_card_form_ajax"){
					
					jQuery.ajax({
						type: 'POST',
						url: adminurl,
						data: form,
						dataType: 'json',
						beforeSend: function() {
							$thisForm.find('.form-loader').show();
						},
						success: function(data) {

							console.log('success');

							if (data.result == 'fail') {
								console.log('success if');
								$thisForm.find('.ajax-message').html(data.message);
								$thisForm.find('.form-loader').hide();
							} else {
								console.log('success else'); 
								$thisForm.find('.form-loader').hide();
								$thisForm.find('.ajax-message').html(data.message);

								if(typeof data.ebook !== 'undefined')
								{
									setTimeout(function(){
										// window.open(data.ebook,'_blank');
										jQuery("#hidden-form").submit();
									}, 2000);
								}
								
								if(form_action!="upl_hire_talent_lead"){
									if( jQuery("#rate-card-url").length ){
										jQuery("#rate-card-url").submit();
									}
								}


								$thisForm.trigger("reset");
							}
						},
						error: function(err) {
							alert("Error: There is some issue please try again.");
							console.log(err);
						}
					});
					
				}else if(form_action=="sales_talent_expert_ajax_handler"){
                    var fd = new FormData();
                    if($thisForm.find("input[name='calender_popup']").val()!="Yes"){
                        var file = $thisForm.find('input[type="file"]');
                        var individual_file = file[0].files[0];
                        fd.append("certifications_docs", individual_file);
                        fd.append("jd_message", $thisForm.find("input[name='jd_message']").val());
                    }else{
                        fd.append("jd_message", '');
                        fd.append("calender_popup", $thisForm.find("input[name='calender_popup']").val());
                    }
                    fd.append("full_name", $thisForm.find("input[name='full_name']").val());  
                    fd.append("email", $thisForm.find("input[name='email']").val());  
                    fd.append("type_of_talent_you_need", $thisForm.find("select[name='type_of_talent_you_need']").val());   
                    fd.append("page_title", $thisForm.find("input[name='page_title']").val());  
                    fd.append('action', 'sales_talent_expert_ajax_handler'); 
                    
                    jQuery.ajax({
                        type: 'POST',
                        url: adminurl,
                        data: fd,
                        contentType: false,
                        dataType: 'json',
                        processData: false,
                        beforeSend: function() {
                            $thisForm.find('.form-loader').show();
                        },
                        success: function(data) {

                            console.log('success');

                            if (data.result == 'fail') {
                                $thisForm.find('.ajax-message').html(data.message);
                                $thisForm.find('.form-loader').hide();
                            } else {
                                $thisForm.find('.form-loader').hide();
                                $thisForm.find('.ajax-message').html(data.message);

                                if(data.calender_popup == "Yes"){
                                   $("#calender_popup").addClass('open');
                                }
                                
                                
                                $thisForm.trigger("reset");
                            }
                        },
                        error: function(err) {
                            alert("Error: There is some issue please try again.");
                            console.log(err);
                        }
                    });

                }else if(form_action=="customer_feedback_form_ajax"){
                    
                    jQuery.ajax({
                        type: 'POST',
                        url: adminurl,
                        data: form,
                        dataType: 'json',
                        beforeSend: function() {
                            $thisForm.find('.form-loader').show();
                        },
                        success: function(data) {

                            console.log('success');

                            if (data.result == 'fail') {
                                console.log('success if');
                                $thisForm.find('.ajax-message').html(data.message);
                                $thisForm.find('.form-loader').hide();
                            } else {
                                console.log('success else'); 
                                $thisForm.find('.form-loader').hide();
                                //$thisForm.find('.ajax-message').html(data.message);
                                $thisForm.trigger("reset");
                                window.location.href = data.url;

                            }
                        },
                        error: function(err) {
                            alert("Error: There is some issue please try again.");
                            console.log(err);
                        }
                    });

                }else if(form_action=="schedule_an_interview_form_ajax"){
                    var fd = new FormData(this);
                    jQuery.ajax({
                        type: 'POST',
                        url: adminurl,
                        data: fd,
                        contentType: false,
                        dataType: 'json',
                        processData: false,
                        beforeSend: function() {
                            $thisForm.find('.form-loader').show();
                        },
                        success: function(data) {

                            console.log('success');

                            if (data.result == 'fail') {
                                console.log('success if');
                                $thisForm.find('.ajax-message').html(data.message);
                                $thisForm.find('.form-loader').hide();
                            } else {
                                console.log('success else'); 
                                $thisForm.find('.form-loader').hide();
                                $thisForm.find('.ajax-message').html(data.message);
                                $thisForm.trigger("reset");
                                
                            }
                        },
                        error: function(err) {
                            alert("Error: There is some issue please try again.");
                            console.log(err);
                        }
                    });
                }else{
					
					var fd = new FormData(this);
					//var file = jQuery(document).find('input[type="file"]');
					//var individual_file = file[0].files[0];
					//fd.append("certifications_docs", individual_file);

					jQuery.ajax({
						type: 'POST',
						url: adminurl,
						data: fd,
						contentType: false,
						dataType: 'json',
						processData: false,
						beforeSend: function() {
							$thisForm.find('.form-loader').show();
						},
						success: function(data) {

							console.log('success');

							if (data.result == 'fail') {
								console.log('success if');
								$thisForm.find('.ajax-message').html(data.message);
								$thisForm.find('.form-loader').hide();
							} else {
								console.log('success else'); 
								$thisForm.find('.form-loader').hide();

                                if(form_action=="hire_top_it_talent_get_in_touch_ajax_form"){
                                    $thisForm.find('.ajax-message').html('');
                                    window.location.href = data.url;

                                }else{
                                    $thisForm.find('.ajax-message').html(data.message);

                                }

								if(typeof data.ebook !== 'undefined')
								{
									setTimeout(function(){
										window.open(data.ebook,'_blank');
									}, 2000);
								}


								$thisForm.trigger("reset");
							}
						},
						error: function(err) {
							alert("Error: There is some issue please try again.");
							console.log(err);
							 $thisForm.find('.form-loader').hide();
						}
					});
					
				}
				
                

            } else {

                jQuery.ajax({
                    type: 'POST',
                    url: adminurl,
                    data: form,
                    dataType: 'json',
                    beforeSend: function() {
                        $thisForm.find('.form-loader').show();
                    },
                    success: function(data) {

                        console.log('success');

                        if (data.result == 'fail') {
                            console.log('success if');
                            $thisForm.find('.ajax-message').html(data.message);
                            $thisForm.find('.form-loader').hide();
                        } else {
                            console.log('success else'); 
                            $thisForm.find('.form-loader').hide();
                            $thisForm.find('.ajax-message').html(data.message);

                            if(typeof data.ebook !== 'undefined')
                            {
                                setTimeout(function(){
                                    // window.open(data.ebook,'_blank');
                                    jQuery("#hidden-form").submit();
                                }, 2000);
                            }

                            // console.log("book"+data.ebook);
                            // if(data.ebook !== null){
                            //  setTimeout(function(){
                            //      window.open(data.ebook,'_blank');
                            //  }, 2000);
                            // }

                            /*console.log('Test');
                            if ($("input[name='checkbox']").attr('checked'))
                            {
                                window.open("https://www.uplers.com/wp-content/uploads/2020/04/Uplers-HubSpot-US.pdf", 'Download');
                            }if ($("input[name='how_urgent_is_your_project_']").attr('checked'))
                            {
                                window.open("https://www.uplers.com/wp-content/uploads/2020/04/Uplers-HubSpot-US.pdf", 'Download');
                            }*/

                            if(form_id == "covid-survey-form"){ 
                                window.open("https://www.uplers.com/wp-content/themes/uplers/assets/pdf/The-Impact-of-COVID-19-on-Digital-Agencies-A-Survey-Report.pdf", 'Download');
                            }
                            else if(form_id == "guide-to-building-offshore-teams"){ 
                                window.open("https://www.uplers.com/offshore/A-guide-to-building-offshore-teams-in-2021.pdf", 'Download');
                            }
                            else if(form_id == "offshore-regions-comparison-guide"){ 
                                window.open("https://www.uplers.com/offshore/Offshore-regions-comparison-guide.pdf", 'Download');
                            }
                            
                            if(form_id == "rate_card_form"){ 
                                var download_url = jQuery('#download_url').val();

                            }
                            
                             $thisForm.trigger("reset");
                        }
                    },
                    error: function(err) {
                        alert("Error: There is some issue please try again.");
                        console.log(err);
                    }
                });
            }
        }
    });

    /** Enquiry Form SEM **/
  jQuery("#enquiry-form-sem").submit(function(event) {
        event.preventDefault();
        var $thisForm = $(this);
        var data = {};
        var fieldName = '';
        var popError = false;

        var form_id = $(this).attr("id");

        $thisForm.find('span.error-message').remove();
        jQuery(this).find('input, textarea').each(function(i, field) {
            data[field.name] = field.value;
            fieldName = field.name;
            fieldName = fieldName.replace(/_/gi, " ");
            fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });


            if (field.name == 'full_name') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'message') {
                if (field.value == '') {
                    $thisForm.find('textarea[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'email') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                    if (popError == false)
                        popError = true;
                }
            }     
        });

        if (popError == true) {
            $thisForm.addClass('invalid');
            jQuery(".error-message").show();
            return false;
        } else {
            $thisForm.removeClass('invalid');
            jQuery(".error-message").hide();
            var form = $thisForm.serialize();


                jQuery.ajax({
                    type: 'POST',
                    url: adminurl,
                    data: form,
                    dataType: 'json',
                    beforeSend: function() {
                        $thisForm.find('.form-loader').show();
                    },
                    success: function(data) {

                        console.log('success');

                        if (data.result == 'fail') {
                            console.log('success if');
                            $thisForm.find('.ajax-message').html(data.message);
                            $thisForm.find('.form-loader').hide();
                        } else {
                            console.log('success else'); 
                            $thisForm.find('.form-loader').hide();
                            $thisForm.find('.ajax-message').html(data.message);

                            if(typeof data.ebook !== 'undefined')
                            {
                                setTimeout(function(){
                                    // window.open(data.ebook,'_blank');
                                    jQuery("#hidden-form").submit();
                                }, 2000);
                            }

                             $thisForm.trigger("reset");
                        }
                    },
                    error: function(err) {
                        alert("Error: There is some issue please try again.");
                        console.log(err);
                    }
                });
        }
    });
	
	
	
	/**************************************************/
    /****  Remote developer Page form AJAX Submit  ****/
    /**************************************************/

    jQuery("#remote_developer_talent_form").submit(function(event) {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        event.preventDefault();
        var $thisForm = jQuery(this);
        var data = {};
        var fieldName = '';
        var popError = false;

        var form_id = jQuery(this).attr("id");

        $thisForm.find('span.error-message').remove();
        jQuery(this).find('input, textarea').each(function(i, field) {
            data[field.name] = field.value;
            fieldName = field.name;
            fieldName = fieldName.replace(/_/gi, " ");
            fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });

            if (field.name == 'your_name') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'your_email_id') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'your_phone_no') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'jd_message' && jQuery('#certifications_docs').val() == "") {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'howmany_developer') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'how_soon_looking_for') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } 
            
        });

        if (popError == true) {
            $thisForm.addClass('invalid');
            jQuery(".error-message").show();
            return false;
        } else {
            $thisForm.removeClass('invalid');
            jQuery(".error-message").hide();
			
			if($thisForm.find('input[name="action"]').val()=="upl_digital_outsourcing_agency_web_developer_form"){
				var form = $thisForm.serialize();
				
				jQuery.ajax({
					type: 'POST',
					url: adminurl,
					data: form,
                    dataType: 'json',
					beforeSend: function() {
						$thisForm.find('.form-loader').show();
					},
					success: function(data) {

						if (data.result == 'fail') {
							$thisForm.find('.ajax-message').html(data.message);
							$thisForm.find('.form-loader').hide();
						} else {
							$thisForm.find('.form-loader').hide();
							$thisForm.find('.ajax-message').html(data.message);

							$thisForm.trigger("reset");
							setTimeout(function(){
								jQuery('.popup-main2').removeClass('open');
								jQuery('body').removeClass('open-custom-popup');
							}, 3000);
						}
					},
					error: function(err) {
						alert("Error: There is some issue please try again.");
						console.log(err);
					}
				});
				
			}else{

				var fd = new FormData();
				var file = jQuery(document).find('input[type="file"]');
				var individual_file = file[0].files[0];
				fd.append("certifications_docs", individual_file);
				fd.append("your_name", jQuery("#your_name").val());  
				fd.append("your_email_id", jQuery("#your_email_id").val());  
				fd.append("your_phone_no", jQuery("#your_phone_no").val());  
				fd.append("howmany_developer", jQuery("#howmany_developer").val());  
				fd.append("onboard_developer", jQuery("#how_soon_looking_for").val());
				fd.append("page_title", jQuery("input[name='page_title']").val()); 
				fd.append('action', 'upl_remote_developer_talent_form');           
				fd.append("jd_message", jQuery("input[name='jd_message']").val());  

				jQuery.ajax({
					type: 'POST',
					url: adminurl,
					data: fd,
					contentType: false,
					processData: false,
					dataType: 'json',
					beforeSend: function() {
						$thisForm.find('.form-loader').show();
					},
					success: function(data) {

						if (data.result == 'fail') {
							$thisForm.find('.ajax-message').html(data.message);
							$thisForm.find('.form-loader').hide();
						} else {
							$thisForm.find('.form-loader').hide();
							$thisForm.find('.ajax-message').html(data.message);

							$thisForm.trigger("reset");
							setTimeout(function(){
								jQuery('.popup-main2').removeClass('open');
								jQuery('body').removeClass('open-custom-popup');
							}, 3000);
						}
					},
					error: function(err) {
						alert("Error: There is some issue please try again.");
						console.log(err);
					}
				});
			}
        }
    });  


    /**************************************************/
    /*********  Share requirement for ui ux Form AJAX Submit  ********/
    /**************************************************/

    jQuery("#share-requirement-foruiux-form").submit(function(event) {
        event.preventDefault();
        var $thisForm = $(this);
        var data = {};
        var fieldName = '';
        var popError = false;

        var form_id = $(this).attr("id");

        $thisForm.find('span.error-message').remove();
        $thisForm.find('.error').removeClass('error');
        jQuery(this).find('input, textarea').each(function(i, field) {
            data[field.name] = field.value;
            fieldName = field.name;
            fieldName = fieldName.replace(/_/gi, " ");
            fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });


            if (field.name == 'full_name') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'email') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'phone') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'company_name') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'website') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            }
            else if(field.name === 'level-commitment'){
                if($thisForm.find("input:radio[name="+field.name+"]:checked").length == 0){
                    if(!$(this).parent().parent().parent().hasClass('error')){
                        $(this).parent().parent().parent().addClass('error').append('<span class="error-message col-sm-12">Please select value.</span>');
                        if (popError == false)
                            popError = true;
                    }
                }
            }
            else if(field.name === 'need-designer'){
                if($thisForm.find("input:radio[name="+field.name+"]:checked").length == 0){
                    if(!$(this).parent().parent().parent().hasClass('error')){
                        $(this).parent().parent().parent().addClass('error');
                        $(this).parent().parent().parent().parent().append('<span class="error-message">Please select value.</span>');
                        if (popError == false)
                            popError = true;
                    }
                }
            }
            else if(field.name === 'exp-years'){
                if($thisForm.find("input:radio[name="+field.name+"]:checked").length == 0){
                    if(!$(this).parent().parent().parent().hasClass('error')){
                        $(this).parent().parent().parent().addClass('error');
                        $(this).parent().parent().parent().parent().append('<span class="error-message">Please select value.</span>');
                        if (popError == false)
                            popError = true;
                    }
                }
            }
            else if(field.name === 'onboard-designer'){
                if($thisForm.find("input:radio[name="+field.name+"]:checked").length == 0){
                    if(!$(this).parent().parent().parent().hasClass('error')){
                        $(this).parent().parent().parent().addClass('error').append('<span class="error-message col-sm-12">Please select value.</span>');
                        if (popError == false)
                            popError = true;
                    }
                }
            }
            // else if (field.name == 'share-jd' ) {
            //     var ext = $thisForm.find('input[name="' + field.name + '"]').val().split('.').pop().toLowerCase();
            //     if(jQuery.inArray(ext, ['pdf','doc','docx']) == -1) {
            //         $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Invalid file type. Only PDF, DOC & DOCX files are allowed.</span>');
            //         if (popError == false)
            //             popError = true;
            //     }
            // }       
        });
        // if($thisForm.find("input:checkbox[name='which_link_building_services_do_you_need_']:checked").length == 0){
        //     if(!$(".selectBox").hasClass('error')){
        // console.log("11");
        //         $(".selectBox").addClass('error').append('<span class="error-message col-sm-12">Please select value.</span>');
        //         if (popError == false)
        //             popError = true;
        //     }
        // }

        if (popError == true) {
            $thisForm.addClass('invalid');
            jQuery(".error-message").show();
            return false;
        } else {
            $thisForm.removeClass('invalid');
            jQuery(".error-message").hide();

            jQuery.ajax({
                type: 'POST',
                url: adminurl,
                data: new FormData(this),
                dataType: 'json',
                contentType: false,
                cache: false,
                processData:false,
                beforeSend: function() {
                    $thisForm.find('.form-loader').show();
                },
                success: function(data) {

                    if (data.result == 'fail') {
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.find('.form-loader').hide();
                    } else {
                        $thisForm.find('.form-loader').hide();
                        $thisForm.find('.ajax-message').html(data.message);

                        if(typeof data.ebook !== 'undefined')
                        {
                            setTimeout(function(){
                                window.open(data.ebook,'_blank');
                            }, 2000);
                        }

                        $thisForm.trigger("reset");
                    }
                },
                error: function(err) {
                    alert("Error: There is some issue please try again.");
                    console.log(err);
                }
            });
        }
    });
    
    /*****************************************************************/
    /*********  Rate Card On Pricing Page Form Ajax  Submit  *********/
    /****************************************************************/

    jQuery("#rate_card-form1, #rate_card-form11").submit(function(event) {
        event.preventDefault();
        var $thisForm = $(this);
        var data = {};
        var fieldName = '';
        var popError = false;
        var pckg = '_'+$thisForm.find('input[name="downloadReferrer"]').val();

        $thisForm.find('span.error-message').remove();
        $thisForm.find('input, select, textarea').each(function(i, field) {
            data[field.name] = field.value;
            fieldName = field.name;
            fieldName = fieldName.replace(/_/gi, " ");
            fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });


            if (field.name == 'full_name') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'phone') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please enter Phone.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!num_filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please enter number only.</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'email') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'message') {
                if (field.value == '') {
                    if($thisForm.find('input[name="action"]').val()=="talent_solutions_rate_card_form_ajax"){
                        
                    }else if($thisForm.find('input[name="action"]').val()=="wordpress_development_hire_dedicated_resources_form_ajax"){
                        if($thisForm.find('input[name="certifications_docs"]').val()==''){
                            $thisForm.find('textarea[name="' + field.name + '"]').parent().parent().parent().addClass('error').after('<span class="error-message">Please fill in atleast one required field.</span>');
                            if (popError == false)
                                popError = true;      
                        }
                    }else{
                        $thisForm.find('textarea[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                        if (popError == false)
                            popError = true;
                    }
                }
            }else if (field.name == 'seo_website') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'which_link_building_services_do_you_need?[]') {
                if (field.value == '') {
                    $thisForm.find('select[name="' + field.name + '"]').parent().addClass('error').after('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'seo_text') {
                if (field.value == '') {
                    $thisForm.find('textarea[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'you_need_rates_for_others' && $thisForm.find('select[name="you_need_rates_for"]').val()=='Others') {
                if (field.value == '') {
                    $thisForm.find('textarea[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'preferred_email_service_provider_others' && $thisForm.find('select[name="preferred_email_service_provider"]').val()=='Others') {
                if (field.value == '') {
                    $thisForm.find('textarea[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            }


        });

        if($thisForm.find('input[name="action"]').val()=="wordpress_development_hire_dedicated_resources_form_ajax"){
            if($thisForm.find('input[name="certifications_docs"]').val()!=''){
                var ext = $thisForm.find('#certifications_docs').val().split('.').pop().toLowerCase();
                if(jQuery.inArray(ext, ['pdf', 'doc', 'docx','jpg','jpeg']) == -1) {
                    $thisForm.find('#certifications_docs').addClass('error').after('<span class="error-message text-red">Invalid file type. Only PDF, DOC & DOCX files are allowed.</span>');
                    if (popError == false)
                        popError = true;
                }     
            }
        }

        if ($thisForm.find('select[name="pricing_for' + pckg + '"]').val() == '') {
            $thisForm.find('select[name="pricing_for' + pckg + '"]').parent().addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
            if (popError == false)
                popError = true;
        }
        if ($thisForm.find('select[name="monthly_ad_budget' + pckg + '"]').val() == '') {
            $thisForm.find('select[name="monthly_ad_budget' + pckg + '"]').parent().addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
            if (popError == false)
                popError = true;
        }
        if ($thisForm.find('select[name="start_y_project' + pckg + '"]').val() == '') {
            $thisForm.find('select[name="start_y_project' + pckg + '"]').parent().addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
            if (popError == false)
                popError = true;
        }
        if ($thisForm.find('textarea[name="website' + pckg + '"]').val() == '') {
            $thisForm.find('textarea[name="website' + pckg + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
            if (popError == false)
                popError = true;
        }

        if(($thisForm.find("input[name='action']").val() == "programmatic_advertising_rate_card_form_ajax" || $thisForm.find("input[name='action']").val() == "wordpress_development_hire_dedicated_resources_form_ajax")) {
            var devarr = $thisForm.find("input[type='radio'][name='developer_type']:checked").val()+'_experience[]';
            if(($thisForm.find("input[type='checkbox'][name='"+devarr+"']:checked").length == 0)) {
                $thisForm.find("input[type='checkbox'][name='"+devarr+"']").parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                if (popError == false)
                    popError = true;   
            }
        } 


        

        if (popError == true) {
            $thisForm.addClass('invalid');
            jQuery(".error-message").show();
            return false;
        } else {

            $thisForm.removeClass('invalid');
            jQuery(".error-message").hide();

            if($thisForm.find('input[name="action"]').val()=="pricing_page_rate_card_form_ajax" || $thisForm.find('input[name="action"]').val()=="digital_outsourcing_agency_web_dev_form_ajax" || $thisForm.find('input[name="action"]').val()=="web_design_services_page_rate_card_form_ajax"){

                jQuery.ajax({
                    type: 'POST',
                    url: adminurl,
                    data: new FormData(this),
                    dataType: 'json',
                    contentType: false,
                    cache: false,
                    processData:false,
                    beforeSend: function() {
                        $thisForm.find('.form-loader').show();
                    },
                    success: function(data) { 

                        if (data.result == 'fail') {
                            $thisForm.find('.ajax-message').html(data.message);
                            $thisForm.find('.form-loader').hide();
                        } else {                        
                            $thisForm.find('.form-loader').hide();
                            $thisForm.find('.ajax-message').html(data.message);
                            
                            $thisForm.trigger("reset");
                            jQuery(".thankyou-blk").show();
                            jQuery(".step_2").hide();
                            jQuery(".queBox").hide();
                            
                        }
                    },
                    error: function() {
                        alert("Error: There is some issue please try again.")
                    }
                });

            }else if($thisForm.find('input[name="action"]').val()=="programmatic_advertising_rate_card_form_ajax" || $thisForm.find('input[name="action"]').val()=="wordpress_development_rate_card_form_ajax" || $thisForm.find('input[name="action"]').val()=="wordpress_development_agency_rate_card_form_ajax"){

                jQuery.ajax({
                    type: 'POST',
                    url: adminurl,
                    data: new FormData(this),
                    dataType: 'json',
                    contentType: false,
                    cache: false,
                    processData:false,
                    beforeSend: function() {
                        $thisForm.find('.form-loader').show();
                    },
                    success: function(data) { 

                        if (data.result == 'fail') {
                            $thisForm.find('.ajax-message').html(data.message);
                            $thisForm.find('.form-loader').hide();
                        } else {                        
                            $thisForm.find('.form-loader').hide();
                            $thisForm.find('.ajax-message').html(data.message);
                            
                            $thisForm.trigger("reset");
                            jQuery(".thankyou-blk").show();
                            $thisForm.find(".step_2").hide();
                            $thisForm.find(".step_1").hide();
                            $thisForm.find(".queBox").hide();
                            
                        }
                    },
                    error: function() {
                        alert("Error: There is some issue please try again.")
                    }
                });

            
            }else if($thisForm.find('input[name="action"]').val()=="link_building_services_rate_card_form_ajax"){

                jQuery.ajax({
                    type: 'POST',
                    url: adminurl,
                    data: new FormData(this),
                    dataType: 'json',
                    contentType: false,
                    cache: false,
                    processData:false,
                    beforeSend: function() {
                        $thisForm.find('.form-loader').show();
                    },
                    success: function(data) { 

                        if (data.result == 'fail') {
                            $thisForm.find('.ajax-message').html(data.message);
                            $thisForm.find('.form-loader').hide();
                        } else {                        
                            $thisForm.find('.form-loader').hide();
                            $thisForm.find('.ajax-message').html(data.message);
                            
                            $thisForm.trigger("reset");
                            //jQuery(".thankyou-blk").show();
                            //$thisForm.find(".step_2").hide();
                            //$thisForm.find(".step_1").hide();
                            //$thisForm.find(".queBox").hide();
                            
                        }
                    },
                    error: function() {
                        alert("Error: There is some issue please try again.")
                    }
                });

            }else if($thisForm.find('input[name="action"]').val()=="programmatic_advertising_hiring_needs_form_ajax"){

                jQuery.ajax({
                    type: 'POST',
                    url: adminurl,
                    data: new FormData(this),
                    dataType: 'json',
                    contentType: false,
                    cache: false,
                    processData:false,
                    beforeSend: function() {
                        $thisForm.find('.form-loader').show();
                    },
                    success: function(data) { 

                        if (data.result == 'fail') {
                            $thisForm.find('.ajax-message').html(data.message);
                            $thisForm.find('.form-loader').hide();
                        } else {                        
                            $thisForm.find('.form-loader').hide();
                            $thisForm.find('.ajax-message').html(data.message);
                            
                            $thisForm.trigger("reset");  
                        }
                    },
                    error: function() {
                        alert("Error: There is some issue please try again.")
                    }
                });

            }else if($thisForm.find('input[name="action"]').val()=="wordpress_development_hire_dedicated_resources_form_ajax"){

                //var form = $thisForm.serialize(); 

                jQuery.ajax({
                    type: 'POST',
                    url: adminurl,
                    data: new FormData(this),
                    dataType: 'json',
                    contentType: false,
                    cache: false,
                    processData:false,
                    beforeSend: function() {
                        $thisForm.find('.form-loader').show();
                    },
                    success: function(data) { 

                        if (data.result == 'fail') {
                            $thisForm.find('.ajax-message').html(data.message);
                            $thisForm.find('.form-loader').hide();
                        } else {                        
                            $thisForm.find('.form-loader').hide();
                            $thisForm.find('.ajax-message').html(data.message);
                            
                            $thisForm.trigger("reset");  
                        }
                    },
                    error: function() {
                        alert("Error: There is some issue please try again.")
                    }
                });

            }else if($thisForm.find('input[name="action"]').val()=="talent_solutions_rate_card_form_ajax"){

                jQuery.ajax({
                    type: 'POST',
                    url: adminurl,
                    data: new FormData(this),
                    dataType: 'json',
                    contentType: false,
                    cache: false,
                    processData:false,
                    beforeSend: function() {
                        $thisForm.find('.form-loader').show();
                    },
                    success: function(data) { 

                        if (data.result == 'fail') {
                            $thisForm.find('.ajax-message').html(data.message);
                            $thisForm.find('.form-loader').hide();
                        } else {                        
                            $thisForm.find('.form-loader').hide();
                            $thisForm.find('.ajax-message').html(data.message);
                            
                            $thisForm.trigger("reset");

                            var downloadReferrer = jQuery("#rate_card-form1 #downloadReferrer").val();
                            var linkHref = data[downloadReferrer];
                            // console.log("LHREF:"+linkHref);
                            jQuery("#dwld_file").attr('value',linkHref);
                            jQuery("#btnDownloadForm1").trigger('click');
                              
                        }
                    },
                    error: function() {
                        alert("Error: There is some issue please try again.")
                    }
                });

            }else{

               var form = $thisForm.serialize(); 

               jQuery.ajax({
                    type: 'POST',
                    url: adminurl,
                    data: form,
                    dataType: 'json',
                    beforeSend: function() {
                        $thisForm.find('.form-loader').show();
                    },
                    success: function(data) { 

                        if (data.result == 'fail') {
                            $thisForm.find('.ajax-message').html(data.message);
                            $thisForm.find('.form-loader').hide();
                        } else {                        
                            $thisForm.find('.form-loader').hide();
                            $thisForm.find('.ajax-message').html(data.message);
                            
                            if($thisForm.find('input[name="action"]').val()=="ebooks_download_form_ajax"){
                                //alert('ok');
                                jQuery("#dwd_url2").attr('value',data.filepath);
                                jQuery("#filename").attr('value',data.filename);
                                if( jQuery("#rate-card-url").length ){
                                    jQuery("#rate-card-url").submit();
                                }
                                $thisForm.trigger("reset");
                            
                            }else{
                                
                                $thisForm.trigger("reset");

                                setCookie("popup_form_submitted", 'form_submitted', 180, 'admin');
                                setCookie("user_name", data.name, 180, 'admin');
                                setCookie("user_email", data.email, 180, 'admin');
                                setCookie("user_ratecard_phone", data.user_ratecard_phone, 180, 'admin');

                                jQuery('#rate_card-form2 #user_name').val(data.name);
                                jQuery('#rate_card-form2 #user_email').val(data.email);
                                jQuery('#rate_card-form2 #user_ratecard_phone').val(data.user_ratecard_phone);

                                jQuery('#all_service').attr('href', data.all_service);
                                jQuery('#seo_pkg').attr('href', data.seo_pkg);
                                jQuery('#dedicated_team_pkg').attr('href', data.dedicated_team_pkg);
                                jQuery('#website_pkg').attr('href', data.website_pkg);
                                jQuery('#sem_pkg').attr('href', data.sem_pkg);
                                jQuery('#email_pkg').attr('href', data.email_pkg);
                                jQuery('#design_pkg').attr('href', data.design_pkg);
                                jQuery('#landing_page_pkg').attr('href', data.landing_page_pkg);
                                jQuery('#dedicated_pkg').attr('href', data.dedicated_pkg);
                                jQuery('#display_pkg').attr('href', data.display_pkg);
                                jQuery('#ort_pkg').attr('href', data.ort_pkg);
                                jQuery('#uplers_talent_solutions_usd').attr('href', data.uplers_talent_solutions_usd);
                                jQuery('#uplers_talent_solutions_aud').attr('href', data.uplers_talent_solutions_aud);
                                jQuery('#uplers_talent_solutions_gbp').attr('href', data.uplers_talent_solutions_gbp);

                                jQuery('#all_service').attr('target', '_blank');
                                jQuery('#dedicated_team_pkg').attr('target', '_blank');
                                jQuery('#seo_pkg').attr('target', '_blank');
                                jQuery('#website_pkg').attr('target', '_blank');
                                jQuery('#sem_pkg').attr('target', '_blank');
                                jQuery('#email_pkg').attr('target', '_blank');
                                jQuery('#design_pkg').attr('target', '_blank');
                                jQuery('#landing_page_pkg').attr('target', '_blank');
                                jQuery('#dedicated_pkg').attr('target', '_blank');
                                jQuery('#display_pkg').attr('target', '_blank');
                                jQuery('#ort_pkg').attr('target', '_blank');
                                jQuery('#uplers_talent_solutions_usd').attr('target', '_blank');
                                jQuery('#uplers_talent_solutions_aud').attr('target', '_blank');
                                jQuery('#uplers_talent_solutions_gbp').attr('target', '_blank');
                            
                                var downloadReferrer = jQuery("#rate_card-form1 #downloadReferrer").val();
                                // var linkHref = jQuery("#"+downloadReferrer).attr('href');
                                var linkHref = data[downloadReferrer];
                                // console.log("LHREF:"+linkHref);
                                jQuery("#dwld_file").attr('value',linkHref);

                                setTimeout(function(){
                                    //jQuery('a.popup-click').off('click');
                                    jQuery("#btnDownloadForm1").trigger('click');
                                    jQuery('.close-popup').trigger('click');  
                                }, 5000);
                            }

                            // location.reload();

                        }
                    },
                    error: function() {
                        alert("Error: There is some issue please try again.")
                    }
                });
            }
            
  
        }
    });

    /******************************************************************************/
    /*********  Rate Card On Pricing Update Infor Page Form Ajax Submit  *********/
    /******************************************************************************/
    

    /**************************************************/
    /*********  Dedicated Page form AJAX Submit  ********/
    /**************************************************/

    jQuery("#dedicated-form, #dedicated-form-1").submit(function(event) {
        event.preventDefault();
        var $thisForm = $(this);
        var data = {};
        var fieldName = '';
        var popError = false;

        $thisForm.find('span.error-message').remove();
        jQuery('form#dedicated-form, #dedicated-form-1').find('input, textarea, select').each(function(i, field) {
            data[field.name] = field.value;
            fieldName = field.name;
            fieldName = fieldName.replace(/_/gi, " ");
            fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });


            
            if (field.name == 'full_name' || field.name == 'Company') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'email') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'phone') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please enter Phone.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!num_filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please enter number only.</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'you_need') {
                if (field.value == '') {
                    $thisForm.find('select[name="' + field.name + '"]').val('').parent().addClass('error').after('<span class="error-message text-red">Please select one option.</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'selectservice1') {
                if (field.value == '' && $thisForm.find('select[name="you_need"]').val() != '') {
                    $thisForm.find('select[name="' + field.name + '"]').val('').parent().addClass('error').after('<span class="error-message text-red">Please select one option.</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'selectservice3') {
                if (field.value == '' && $thisForm.find('select[name="you_need"]').val() != '') {
                    $thisForm.find('select[name="' + field.name + '"]').val('').parent().addClass('error').after('<span class="error-message text-red">Please select one option.</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'selectservice4') {
                if (field.value == '' && $thisForm.find('select[name="you_need"]').val() != '') {
                    $thisForm.find('select[name="' + field.name + '"]').val('').parent().addClass('error').after('<span class="error-message text-red">Please select one option.</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'crm') {
                if (field.value == '' && $thisForm.find('select[name="you_need"]').val() != '') {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please select one option.</span>');
                    if (popError == false)
                        popError = true;
                }
            }
            else if (field.name == 'message') {
                if (field.value == '') {
                    $thisForm.find('textarea[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } 
            else if (field.name == 'description') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } 
            
        });

        if (popError == true) {
            $thisForm.addClass('invalid');
            jQuery(".error-message").show();
            return false;
        } else {

            $thisForm.removeClass('invalid');
            jQuery(".error-message").hide();
            var form = $thisForm.serialize();
            
            jQuery.ajax({
                type: 'POST',
                url: adminurl,
                data: form,
                dataType: 'json',
                beforeSend: function() {
                    $thisForm.find('.form-loader').show();
                },
                success: function(data) {


                    if (data.result == 'fail') {
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.find('.form-loader').hide();
                    } else {
                        $thisForm.find('.form-loader').hide();
                        $thisForm.find('.ajax-message').html(data.message);
                        console.log('Test');
                        if ($("input[name='download_ratecard']").attr('checked'))
                        {
                            var url      = window.location.href;     // Returns full URL (https://example.com/path/example.html)
                            if(url == "https://www.uplers.com/design-services/")
                            {
                                window.open("https://www.uplers.com/wp-content/uploads/2020/04/Uplers-Design-US.pdf", 'Download');
                            }else{
                                window.open("https://www.uplers.com/wp-content/uploads/2020/04/Uplers-HubSpot-US.pdf", 'Download');
                            }
                            
                        }

                        $thisForm.trigger("reset");
                    }
                },
                error: function() {
                    alert("Error: There is some issue please try again.")
                }
            });
        }
    });
    
    /**************************************************/
    /*********  Proof of Concept form AJAX Submit  ********/
    /**************************************************/

    jQuery("#hide-from").submit(function(event) {
        event.preventDefault();
        var $thisForm = $(this);
        var data = {};
        var fieldName = '';
        var popError = false;

        $thisForm.find('span.error-message').remove();
        jQuery('form#hide-from').find('input, textarea').each(function(i, field) {
            data[field.name] = field.value;
            fieldName = field.name;
            fieldName = fieldName.replace(/_/gi, " ");
            fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });


            if (field.name == 'full_name' || field.name == 'website') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'email') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'phone') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please enter Phone6.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!num_filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please enter number only.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'brief') {
                if (field.value == '') {
                    $thisForm.find('textarea[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } 
            } 
            
        });

        if (popError == true) {
            $thisForm.addClass('invalid');
            jQuery(".error-message").show();
            return false;
        } else {

            $thisForm.removeClass('invalid');
            jQuery(".error-message").hide();
            var form = $thisForm.serialize();
            
            jQuery.ajax({
                type: 'POST',
                url: adminurl,
                data: form,
                dataType: 'json',
                beforeSend: function() {
                    $thisForm.find('.form-loader').show();
                },
                success: function(data) {

                    if (data.result == 'fail') {
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.find('.form-loader').hide();
                    } else {
                        $thisForm.find('.form-loader').hide();
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.trigger("reset");
                    }
                },
                error: function() {
                    alert("Error: There is some issue please try again.")
                }
            });
        }
    });


    /**************************************************/
    /*********  Got Question form AJAX Submit  ********/
    /**************************************************/

    jQuery("#got-question-form").submit(function(event) {
        event.preventDefault();
        var $thisForm = $(this);
        var data = {};
        var fieldName = '';
        var popError = false;

        $thisForm.find('span.error-message').remove();
        jQuery('form#got-question-form').find('input, textarea').each(function(i, field) {
            data[field.name] = field.value;
            fieldName = field.name;
            fieldName = fieldName.replace(/_/gi, " ");
            fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });


            if (field.name == 'full_name' || field.name == 'Company') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'email') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'phone') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please enter Phone.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!num_filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please enter number only.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'message') {
                if (field.value == '') {
                    $thisForm.find('textarea[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } 
            } 
            
        });

        if (popError == true) {
            $thisForm.addClass('invalid');
            jQuery(".error-message").show();
            return false;
        } else {

            $thisForm.removeClass('invalid');
            jQuery(".error-message").hide();
            var form = $thisForm.serialize();

            jQuery.ajax({
                type: 'POST',
                url: adminurl,
                data: form,
                dataType: 'json',
                beforeSend: function() {
                    $thisForm.find('.form-loader').show();
                },
                success: function(data) {

                    if (data.result == 'fail') {
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.find('.form-loader').hide();
                    } else {
                        $thisForm.find('.form-loader').hide();
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.trigger("reset");
                    }
                },
                error: function() {
                    alert("Error: There is some issue please try again.")
                }
            });
        }
    });


    /**************************************************/
    /*********  Got Question form AJAX Submit  ********/
    /**************************************************/

    jQuery("#dedicated-team-form").submit(function(event) {
        event.preventDefault();
        var $thisForm = $(this);
        var data = {};
        var fieldName = '';
        var popError = false;

        $thisForm.find('span.error-message').remove();
        jQuery('form#dedicated-team-form').find('input,textarea,select').each(function(i, field) {
            data[field.name] = field.value;
            fieldName = field.name;
            fieldName = fieldName.replace(/_/gi, " ");
            fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });


            if (field.name == 'full_name' || field.name == 'Company' || field.name == 'needmembers' ) {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'email') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'phone') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please enter Phone.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!num_filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please enter number only.</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'message') {
                if (field.value == '') {
                    $thisForm.find('textarea[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } 
            }
            else if (field.name == 'website') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please fill in the website url.</span>');
                    if (popError == false)
                        popError = true;
                } 
            } 
            else if (field.name == 'duration') {
                if (field.value == '') {
                    $thisForm.find('select[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please fill in the duration field.</span>');
                    if (popError == false)
                        popError = true;
                } 
            }else if (field.name == 'requirement') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please fill in the requirement field.</span>');
                    if (popError == false)
                        popError = true;
                } 
            }else if (field.name == 'hire') {
                if (field.value == '') {
                    $thisForm.find('select[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please fill in the hire field.</span>');
                    if (popError == false)
                        popError = true;
                } 
            }
            
        });

        if (popError == true) {
            $thisForm.addClass('invalid');
            jQuery(".error-message").show();
            return false;
        } else {

            $thisForm.removeClass('invalid');
            jQuery(".error-message").hide();
            var form = $thisForm.serialize();

            jQuery.ajax({
                type: 'POST',
                url: adminurl,
                data: form,
                dataType: 'json',
                beforeSend: function() {
                    $thisForm.find('.form-loader').show();
                },
                success: function(data) {

                    if (data.result == 'fail') {
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.find('.form-loader').hide();
                    } else {
                        $thisForm.find('.form-loader').hide();
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.trigger("reset");
                    }
                },
                error: function() {
                    alert("Error: There is some issue please try again.")
                }
            });
        }
    });


    /**************************************************/
    /*********  Book an Appointment form AJAX Submit  ********/
    /**************************************************/
    
    jQuery("#book-appointment-form").submit(function(event) {
        event.preventDefault();
        var $thisForm = $(this);
        var data = {};
        var fieldName = '';
        var popError = false;

        $thisForm.find('span.error-message').remove();
        jQuery('form#book-appointment-form').find('input, select').each(function(i, field) {
            data[field.name] = field.value;
            fieldName = field.name;
            fieldName = fieldName.replace(/_/gi, " ");
            fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });


            if (field.name == 'full_name' || field.name == 'appointment_date') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'email') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'phone') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please enter Phone.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!num_filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please enter number only.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'appointment_time') {
                if (field.value == '') {
                    $thisForm.find('select[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please select a time slot.</span>');
                    if (popError == false)
                        popError = true;
                } 
            } 
            
        });

        if (popError == true) {
            $thisForm.addClass('invalid');
            jQuery(".error-message").show();
            return false;
        } else {

            $thisForm.removeClass('invalid');
            jQuery(".error-message").hide();
            var form = $thisForm.serialize();

            jQuery.ajax({
                type: 'POST',
                url: adminurl,
                data: form,
                dataType: 'json',
                beforeSend: function() {
                    $thisForm.find('.form-loader').show();
                },
                success: function(data) {

                    if (data.result == 'fail') {
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.find('.form-loader').hide();
                    } else {
                        $thisForm.find('.form-loader').hide();
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.trigger("reset");
                    }
                },
                error: function() {
                    alert("Error: There is some issue please try again.")
                }
            });
        }
    });


    jQuery('a.popup-click').on('click', function(){
console.log('popup click form-validation');
        var $fileDownload = jQuery(this).attr('data-download');
        var $downloadReferrer = jQuery(this).attr('id');

        jQuery('#rate_card-form1 #fileDownload').val($fileDownload);
        jQuery('#rate_card-form1 #downloadReferrer').val($downloadReferrer);

    });


    jQuery('.downloadSubmitBtn').click(function(){
        console.log("download start");
        var hrefVal       = jQuery(this).attr('href');
        var $fileDownload = jQuery(this).attr('data-download');

        var $name         = jQuery('#rate_card-form2 #user_name').val();
        var $email        = jQuery('#rate_card-form2 #user_email').val();
        var $phone        = jQuery('#rate_card-form2 #user_ratecard_phone').val();
        var $action       = jQuery('#rate_card-form2 #formAction').val();

        if(hrefVal != 'javaScript:void(0);'){
            console.log("before ajax");
            jQuery.ajax({
                type: 'POST',
                url: adminurl,
                data: {'action':$action, 'name':$name, 'email':$email, 'phone':$phone, 'fileDownload':$fileDownload, 'filePath': hrefVal },
                dataType: 'json',                
                success: function(data) {
                    if(data.result == 'success'){
                        console.log('downloaded');    
                    }
                }
            });
        } else {
            console.log('download else part');

            jQuery('.popup-main').toggleClass('open');
            jQuery('body').toggleClass('open-custom-popup');

            var $fileDownload = jQuery(this).attr('data-download');
            var $downloadReferrer = jQuery(this).attr('id');

            jQuery('#rate_card-form1 #fileDownload').val($fileDownload);
            jQuery('#rate_card-form1 #downloadReferrer').val($downloadReferrer);        


        }
            

    });


    /**************************************************/
    /*********  hire-dedicated-team form AJAX Submit  ********/
    /**************************************************/
    
    jQuery("#msform").submit(function(event) {
        event.preventDefault();
        var $thisForm = $(this);
        var data = {};
        var fieldName = '';
        var popError = false;

        $thisForm.find('span.error-message').remove();
        jQuery('form#msform').find('input, textarea').each(function(i, field) {
            data[field.name] = field.value;
            fieldName = field.name;
            fieldName = fieldName.replace(/_/gi, " ");
            fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });


            
            if (field.name == 'full_name' || field.name == 'Company') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'email') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'phone') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please enter Phone.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!num_filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please enter number only.</span>');
                    if (popError == false)
                        popError = true;
                }
            } 
            
        });

        if (popError == true) {
            $thisForm.addClass('invalid');
            jQuery(".error-message").show();
            return false;
        } else {

            $thisForm.removeClass('invalid');
            jQuery(".error-message").hide();
            var form = $thisForm.serialize();
            
            jQuery.ajax({
                type: 'POST',
                url: adminurl,
                data: form,
                dataType: 'json',
                beforeSend: function() {
                    $thisForm.find('.form-loader').show();
                },
                success: function(data) {


                    if (data.result == 'fail') {
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.find('.form-loader').hide();
                    } else {
                        $thisForm.find('.form-loader').hide();
                        $thisForm.find('.ajax-message').html(data.message);
                        console.log('Test');                        
                        $thisForm.trigger("reset");
                    }
                },
                error: function() {
                    alert("Error: There is some issue please try again.")
                }
            });
        }
    });

    

})( jQuery );

function startDownload(url) {
    window.open(url, 'Download');
}


/**************************************************/
    /*********  Price calculation AJAX Submit  ********/
    /**************************************************/

    jQuery("#price-cal-form").submit(function(event) {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        event.preventDefault();
        var $thisForm = jQuery(this);
        var data = {};
        var fieldName = '';
        var popError = false;

        var form_id = jQuery(this).attr("id");

        $thisForm.find('span.error-message').remove();
        jQuery(this).find('input, textarea').each(function(i, field) {
            data[field.name] = field.value;
            fieldName = field.name;
            fieldName = fieldName.replace(/_/gi, " ");
            fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });


            if (field.name == 'name') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'email') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'phone') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'message') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            }
            
        });

        if (popError == true) {
            $thisForm.addClass('invalid');
            jQuery(".error-message").show();
            return false;
        } else {

            $thisForm.removeClass('invalid');
            jQuery(".error-message").hide();

            var form = $thisForm.serialize();

            if(jQuery("#send-summary").is(":checked") &&  jQuery("#on-off-switch").is(":checked")){

                if(parseInt(jQuery('#count').html()) >=3)
                {
                    form = $thisForm.serialize()+'&summary='+priceCalculation(true);
                }else{
                    jQuery('.ajax-message').show();
                    jQuery('.ajax-message').html('<span class="error-message">Please select team length greater than 3 0r 3.</span>');
                    return false;
                }

            }
            

            jQuery.ajax({
                type: 'POST',
                url: adminurl,
                data: form,
                dataType: 'json',
                beforeSend: function() {
                    $thisForm.find('.form-loader').show();
                },
                success: function(data) {

                    if (data.result == 'fail') {
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.find('.form-loader').hide();
                    } else {
                        $thisForm.find('.form-loader').hide();
                        $thisForm.find('.ajax-message').html(data.message);

                        if(typeof data.ebook !== 'undefined')
                        {
                            setTimeout(function(){
                                window.open(data.ebook,'_blank');
                            }, 2000);
                        }

                        $thisForm.trigger("reset");
                    }
                },
                error: function(err) {
                    alert("Error: There is some issue please try again.");
                    console.log(err);
                }
            });
        }
    });


    jQuery("#price-email-form").submit(function(event) {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        event.preventDefault();
        var $thisForm = jQuery(this);
        var data = {};
        var fieldName = '';
        var popError = false;

        var form_id = jQuery(this).attr("id");

        $thisForm.find('span.error-message').remove();
        jQuery(this).find('input, textarea').each(function(i, field) {
            data[field.name] = field.value;
            fieldName = field.name;
            fieldName = fieldName.replace(/_/gi, " ");
            fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });


            if (field.name == 'email') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                    if (popError == false)
                        popError = true;
                }
            }
            
        });

        if (popError == true) {
            $thisForm.addClass('invalid');
            jQuery(".error-message").show();
            return false;
        } else {

            $thisForm.removeClass('invalid');
            jQuery(".error-message").hide();

            var form = $thisForm.serialize();

            if(jQuery("#send-summary").is(":checked")){

                if(parseInt(jQuery('#count').html()) >=3)
                {   
                    form = $thisForm.serialize()+'&summary='+priceCalculation(true);

                }else{
                    jQuery('.ajax-message').show();
                    jQuery('.ajax-message').html('<span class="error-message">Please select team length greater than 3 0r 3.</span>');
                    return false;
                }
                
            }
            

            jQuery.ajax({
                type: 'POST',
                url: adminurl,
                data: form,
                dataType: 'json',
                beforeSend: function() {
                    $thisForm.find('.form-loader').show();
                },
                success: function(data) {

                    if (data.result == 'fail') {
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.find('.form-loader').hide();
                    } else {
                        $thisForm.find('.form-loader').hide();
                        $thisForm.find('.ajax-message').html(data.message);

                        if(typeof data.ebook !== 'undefined')
                        {
                            setTimeout(function(){
                                window.open(data.ebook,'_blank');
                            }, 2000);
                        }

                        $thisForm.trigger("reset");
                    }
                },
                error: function(err) {
                    alert("Error: There is some issue please try again.");
                    console.log(err);
                }
            });
        }
    });


	/**************************************************/
    /*********  Report Page form AJAX Submit  ********/
    /**************************************************/

    jQuery("#report-form").submit(function(event) {
        event.preventDefault();
        var $thisForm = jQuery(this);
        var data = {};
        var fieldName = '';
        var popError = false; 
		var formaction  = $thisForm.find('input[name="action"').val();

		var form = $thisForm.serialize();

		jQuery.ajax({
			type: 'POST',
			url: adminurl,
			data: new FormData(this),
			dataType: 'json',
			contentType: false,
			cache: false,
			processData:false,
			beforeSend: function() {
				$thisForm.find('.form-loader').show();
			},
			success: function(data) {

				if (data.result == 'fail') {
					$thisForm.find('.ajax-message').html(data.message).show();
					$thisForm.find('.form-loader').hide();
				} else {
					$thisForm.find('#payment-btns-wrap').hide();
					$thisForm.find('.ty-popup').addClass('open');
                    jQuery('body').addClass('open-custom-popup');
                    $thisForm.find('.form-loader').hide();
					$thisForm.trigger("reset");
					
				}
			},
			error: function() {
				alert("Error: There is some issue please try again.")
			}
		});
        
    });



    /**************************************************/
    /*********  Order Online Page form AJAX Submit  ********/
    /**************************************************/

    jQuery("#order-online-form").submit(function(event) {
        //event.preventDefault();
        var $thisForm = jQuery('form#order-online-form');
        var data = {};
        var fieldName = '';
        var popError = false; 
        var formaction  = $thisForm.find('input[name="action"').val();
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var num_filter = /^\d+$/;

         $thisForm.find('span.error-message').remove();
         jQuery('form#order-online-form').find('input').each(function(i, field) {
             data[field.name] = field.value;
             fieldName = field.name;
             fieldName = fieldName.replace(/_/gi, " ");
             fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                 return letter.toUpperCase();
             });


             if (field.name == 'full_name') {
                 if (field.value == '') {
                     $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                     if (popError == false)
                         popError = true;
                 }
             } else if (field.name == 'email') {
                 if (field.value == '') {
                     $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                     if (popError == false)
                         popError = true;
                 } else if (!filter.test(field.value)) {
                     $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                     if (popError == false)
                         popError = true;
                 }  
             } else if (field.name == 'phone') {
                 if (field.value == '') {
                     $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please enter Phone.</span>');
                     if (popError == false)
                         popError = true;
                 } else if (!num_filter.test(field.value)) {
                     $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Please enter number only.</span>');
                     if (popError == false)
                         popError = true;
                 }
             /*} else if ( field.name == 'certifications_docs' ) {
                 var ext = jQuery('#fileupload').val().split('.').pop().toLowerCase();
                 if(jQuery.inArray(ext, ['pdf','doc','docx']) == -1) {
                     $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message text-red">Invalid file type. Only PDF, DOC & DOCX files are allowed.</span>');
                     if (popError == false)
                         popError = true;
                 }*/
             } 
             
         });
        
        if( $thisForm.find('input[name="link_type"]').val()=="DA-wise"){
            if(jQuery('input[name*="da_range"]:checked').length < 1) {
                $thisForm.find('.groupdaRange').addClass('error').append('<span class="error-message text-red">Select atleast one DA range.</span>');
                if (popError == false)
                    popError = true;
            }
        }else{
            if(jQuery('input[name*="traffic_range"]:checked').length < 1) {
                $thisForm.find('.grouptrafficRange').addClass('error').append('<span class="error-message text-red">Select atleast one DA range.</span>');
                if (popError == false)
                    popError = true;
            }
        }

        jQuery( ".current .selectOption" ).each(function() {
            var checkBox = jQuery( this ).find('input[type="checkbox"]');
            if(checkBox.prop("checked") == true){
                var wordcountField = jQuery( this ).find('.wordcount').val();
                if(wordcountField == ''){
                    jQuery( this ).addClass('error').append('<span class="error-message text-red text-right">Choose one Word Count.</span>');
                    if (popError == false)
                        popError = true;
                    }
            }
        });


        if (popError == true) {
          $thisForm.addClass('invalid');
          jQuery(".error-message").show();
          return false;
        }else{
            $thisForm.removeClass('invalid');
            jQuery(".error-message").hide();
            return false;
            
            var form = $thisForm.serialize();

         jQuery.ajax({
             type: 'POST',
             url: adminurl,
             data: new FormData(this),
             dataType: 'json',
             contentType: false,
             cache: false,
             processData:false,
             beforeSend: function() {
                 $thisForm.find('.form-loader').show();
             },
             success: function(data) {

                 if (data.result == 'fail') {
                     $thisForm.find('.ajax-message').html(data.message).show();
                     $thisForm.find('.form-loader').hide();
                 } else {
                     //$thisForm.find('.ty-popup').addClass('open');
                     //jQuery('body').addClass('open-custom-popup');
                     $thisForm.find('.form-loader').hide();
                     $thisForm.trigger("reset");
                     
                     
                 }
             },
             error: function() {
                 alert("Error: There is some issue please try again.")
             }
         });

            
      }
    });

    



    jQuery("#hire-wordpress-talent-form, #hire_wp_talent_form").submit(function(event) {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        event.preventDefault();
        var $thisForm = jQuery(this);
        var data = {};
        var fieldName = '';
        var popError = false;

        var form_id = jQuery(this).attr("id");

        $thisForm.find('span.error-message').remove();
        jQuery(this).find('input, textarea').each(function(i, field) {
            data[field.name] = field.value;
            fieldName = field.name;
            fieldName = fieldName.replace(/_/gi, " ");
            fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });

            if (field.name == 'your_name') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'your_email_id') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'your_phone_no') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'company_name') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'jd_message' && jQuery('#certifications_docs').val() == "") {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } 
            
        });

        if (typeof jQuery("input[name='developer_time']").val() != "undefined" && typeof jQuery("input[name='developer_time']:checked").val() === "undefined") {
            jQuery('#developer_time_error').html('<span class="error-message">Please select duration for a developer.</span>');
            if (popError == false)
                popError = true;
        }
        if (typeof jQuery("input[name='howmany_developer']:checked").val() === "undefined") {
            jQuery('#howmany_developer_error').html('<span class="error-message">Please select number of developers.</span>');
            if (popError == false)
                popError = true;
        }

        if (typeof jQuery("input[name='year_of_experience']:checked").val() == "undefined" && jQuery("input[name='year_of_experience_other']").val() == "") {
            jQuery('#year_of_experience_error').html('<span class="error-message">Please select year of experience of developer.</span>');
            if (popError == false)
                popError = true;
        }
        if (typeof jQuery("input[name='onboard_developer']").val() != "undefined" && typeof jQuery("input[name='onboard_developer']:checked").val() === "undefined") {
            jQuery('#onboard_developer_error').html('<span class="error-message">Please select your urgency to hire a developer.</span>');
            if (popError == false)
                popError = true;
        }
        if ($thisForm.find("input[type='radio'][name='developer_type']:checked").val() === "undefined" && $thisForm.find("input[name='developer_type_other']").val() == "") {
            $thisForm.find('#developer_type_error').html('<span class="error-message">Please select type of a developer.</span>');
            if (popError == false)
                popError = true;
        }


        if($thisForm.find("input[name='action']").val() == "contact_us_get_started_form"){

            if( ($thisForm.find("input[type='checkbox'][name='developer_type[]']").length > 0) ) {
                if(($thisForm.find("input[type='checkbox'][name='developer_type[]']:checked").length == 0) && $thisForm.find("input[name='developer_type_other']").val() == "") {
                    $thisForm.find("input[type='checkbox'][name='developer_type[]']").parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;   
                } 

                if(($thisForm.find("input[type='checkbox'][value='Web Developer']").is(':checked')) && ($thisForm.find("input[type='checkbox'][name='developer_type[Web Developer][]']:checked").length == 0)) {
                    $thisForm.find("input[type='checkbox'][name='developer_type[Web Developer][]']").parent().parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;   
                }

                if(($thisForm.find("input[type='checkbox'][value='Software Developer']").is(':checked')) && ($thisForm.find("input[type='checkbox'][name='developer_type[Software Developer][]']:checked").length == 0)) {
                    $thisForm.find("input[type='checkbox'][name='developer_type[Software Developer][]']").parent().parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;   
                }

                if(($thisForm.find("input[type='checkbox'][value='App Developer']").is(':checked')) && ($thisForm.find("input[type='checkbox'][name='developer_type[App Developer][]']:checked").length == 0)) {
                    $thisForm.find("input[type='checkbox'][name='developer_type[App Developer][]']").parent().parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;   
                }

                if(($thisForm.find("input[type='checkbox'][value='Digital Marketer']").is(':checked')) && ($thisForm.find("input[type='checkbox'][name='developer_type[Digital Marketer][]']:checked").length == 0)) {
                    $thisForm.find("input[type='checkbox'][name='developer_type[Digital Marketer][]']").parent().parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;   
                }

                if(($thisForm.find("input[type='checkbox'][value='Email Marketer']").is(':checked')) && ($thisForm.find("input[type='checkbox'][name='developer_type[Email Marketer][]']:checked").length == 0)) {
                    $thisForm.find("input[type='checkbox'][name='developer_type[Email Marketer][]']").parent().parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;   
                }

                if(($thisForm.find("input[type='checkbox'][value='Designer']").is(':checked')) && ($thisForm.find("input[type='checkbox'][name='developer_type[Designer][]']:checked").length == 0)) {
                    $thisForm.find("input[type='checkbox'][name='developer_type[Designer][]']").parent().parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;   
                }
                
            }
        }else if($thisForm.find("input[name='action']").val() == "hire_wp_talent_form"){

            if( ($thisForm.find("input[type='checkbox'][name='developer_type[]']").length > 0) ) {
                if(($thisForm.find("input[type='checkbox'][name='developer_type[]']:checked").length == 0) && $thisForm.find("input[name='developer_type_other']").val() == "") {
                    $thisForm.find("input[type='checkbox'][name='developer_type[]']").parent().parent().parent().parent().parent().parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;   
                } 

                if(($thisForm.find("input[type='checkbox'][value='Web Developer']").is(':checked')) && ($thisForm.find("input[type='checkbox'][name='developer_type[Web Developer][]']:checked").length == 0)) {
                    $thisForm.find("input[type='checkbox'][name='developer_type[Web Developer][]']").parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;   
                }

                if(($thisForm.find("input[type='checkbox'][value='Software Developer']").is(':checked')) && ($thisForm.find("input[type='checkbox'][name='developer_type[Software Developer][]']:checked").length == 0)) {
                    $thisForm.find("input[type='checkbox'][name='developer_type[Software Developer][]']").parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;   
                }

                if(($thisForm.find("input[type='checkbox'][value='App Developer']").is(':checked')) && ($thisForm.find("input[type='checkbox'][name='developer_type[App Developer][]']:checked").length == 0)) {
                    $thisForm.find("input[type='checkbox'][name='developer_type[App Developer][]']").parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;   
                }

                if(($thisForm.find("input[type='checkbox'][value='Digital Marketer']").is(':checked')) && ($thisForm.find("input[type='checkbox'][name='developer_type[Digital Marketer][]']:checked").length == 0)) {
                    $thisForm.find("input[type='checkbox'][name='developer_type[Digital Marketer][]']").parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;   
                }

                if(($thisForm.find("input[type='checkbox'][value='Email Marketer']").is(':checked')) && ($thisForm.find("input[type='checkbox'][name='developer_type[Email Marketer][]']:checked").length == 0)) {
                    $thisForm.find("input[type='checkbox'][name='developer_type[Email Marketer][]']").parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;   
                }

                if(($thisForm.find("input[type='checkbox'][value='Designer']").is(':checked')) && ($thisForm.find("input[type='checkbox'][name='developer_type[Designer][]']:checked").length == 0)) {
                    $thisForm.find("input[type='checkbox'][name='developer_type[Designer][]']").parent().parent().addClass('error').append('<span class="error-message">Please select atleast one option.</span>');
                    if (popError == false)
                        popError = true;   
                }
                
            }
        }


        if (popError == true) {
            $thisForm.addClass('invalid');
            jQuery(".error-message").show();
            return false;
        } else {

            if($thisForm.find("input[name='action']").val() == "contact_us_get_started_form"){

                jQuery.ajax({
                    type: 'POST',
                    url: adminurl,
                    data: new FormData(this),
                    dataType: 'json',
                    contentType: false,
                    cache: false,
                    processData:false,
                    beforeSend: function() {
                        $thisForm.find('.form-loader').show();
                    },
                    success: function(data) {

                        if (data.result == 'fail') {
                            $thisForm.find('.ajax-message').html(data.message);
                            $thisForm.find('.form-loader').hide();
                        } else {
                            $thisForm.find('.form-loader').hide();
                            $thisForm.find('.ajax-message').html(data.message);

                        }
                    },
                    error: function(err) {
                        alert("Error: There is some issue please try again.");
                        console.log(err);
                    }
                });

            }else if($thisForm.find("input[name='action']").val() == "hire_wp_talent_form"){

                jQuery.ajax({
                    type: 'POST',
                    url: adminurl,
                    data: new FormData(this),
                    dataType: 'json',
                    contentType: false,
                    cache: false,
                    processData:false,
                    beforeSend: function() {
                        $thisForm.find('.form-loader').show();
                    },
                    success: function(data) {

                        if (data.result == 'fail') {
                            $thisForm.find('.ajax-message').html(data.message);
                            $thisForm.find('.form-loader').hide();
                        } else {
                            $thisForm.find('.form-loader').hide();
                            $thisForm.find('.ajax-message').html(data.message);

                            $thisForm.trigger("reset");
                            setTimeout(function(){
                                jQuery('.popup-main2').toggleClass('open');
                                jQuery('body').toggleClass('open-custom-popup');
                            }, 3000);

                        }
                    },
                    error: function(err) {
                        alert("Error: There is some issue please try again.");
                        console.log(err);
                    }
                });

            }else{
            
                $thisForm.removeClass('invalid');
                jQuery(".error-message").hide();

                var form = $thisForm.serialize();

                if(jQuery("#send-summary").is(":checked")){

                    if(parseInt(jQuery('#count').html()) >=3)
                    {   
                        form = $thisForm.serialize()+'&summary='+priceCalculation(true);

                    }else{
                        jQuery('.ajax-message').show();
                        jQuery('.ajax-message').html('<span class="error-message">Please select team length greater than 3 0r 3.</span>');
                        return false;
                    }
                    
                }

                var fd = new FormData();
                var file = jQuery(document).find('input[type="file"]');
                var individual_file = file[0].files[0];
                console.log(individual_file);
                fd.append("certifications_docs", individual_file);
                fd.append("your_name", jQuery("#your_name").val());  
                fd.append("your_email_id", jQuery("#your_email_id").val());  
                fd.append("your_phone_no", jQuery("#your_phone_no").val());  
                fd.append("company_name", jQuery("#company_name").val());  
                fd.append("developer_type", jQuery("input[name='developer_type']:checked").val());  
                fd.append("developer_type_other", jQuery("input[name='developer_type_other']").val());  
                fd.append("howmany_developer", jQuery("input[name='howmany_developer']:checked").val());  
                fd.append("year_of_experience", jQuery("input[name='year_of_experience']:checked").val());  
                fd.append("year_of_experience_other", jQuery("input[name='year_of_experience_other']").val());  
                fd.append("onboard_developer", jQuery("input[name='onboard_developer']:checked").val());  
                fd.append("page_title", jQuery("input[name='page_title']").val());  
                fd.append('action', 'hire_wp_talent_form');              
                fd.append("jd_message", jQuery("input[name='jd_message']").val());  
                fd.append("token", jQuery("#frm_token").val());

                jQuery.ajax({
                    type: 'POST',
                    url: adminurl,
                    data: fd,
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    beforeSend: function() {
                        $thisForm.find('.form-loader').show();
                    },
                    success: function(data) {

                        if (data.result == 'fail') {
                            $thisForm.find('.ajax-message').html(data.message);
                            $thisForm.find('.form-loader').hide();
                        } else {
                            $thisForm.find('.form-loader').hide();
                            $thisForm.find('.ajax-message').html(data.message);

                            if(typeof data.ebook !== 'undefined')
                            {
                                setTimeout(function(){
                                    window.open(data.ebook,'_blank');
                                }, 2000);
                            }

                            $thisForm.trigger("reset");
                            setTimeout(function(){
                                jQuery('.popup-main2').toggleClass('open');
                                jQuery('body').toggleClass('open-custom-popup');
                            }, 3000);
                        }
                    },
                    error: function(err) {
                        alert("Error: There is some issue please try again.");
                        console.log(err);
                    }
                });
            }
        }
    });




    jQuery("#call-back-form").submit(function(event) {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        event.preventDefault();
        var $thisForm = jQuery(this);
        var data = {};
        var fieldName = '';
        var popError = false;

        var form_id = jQuery(this).attr("id");

        $thisForm.find('span.error-message').remove();
        jQuery(this).find('input, textarea').each(function(i, field) {
            data[field.name] = field.value;
            fieldName = field.name;
            fieldName = fieldName.replace(/_/gi, " ");
            fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });

            if (field.name == 'your_name') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'email') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'phone') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'company_name') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'jd_message' && jQuery('#certifications_docs').val() == "") {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } 
            
        });

        
        if (popError == true) {
            $thisForm.addClass('invalid');
            jQuery(".error-message").show();
            return false;
        } else {

            

            jQuery.ajax({
                type: 'POST',
                url: adminurl,
                data: new FormData(this),
                dataType: 'json',
                contentType: false,
                cache: false,
                processData:false,
                beforeSend: function() {
                    $thisForm.find('.form-loader').show();
                },
                success: function(data) {

                    if (data.result == 'fail') {
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.find('.form-loader').hide();
                    } else {
                        $thisForm.find('.form-loader').hide();
                        $thisForm.find('.ajax-message').html('');
                        window.location.href = data.url;

                    }
                },
                error: function(err) {
                    alert("Error: There is some issue please try again.");
                    console.log(err);
                }
            });

            
        }
    });



    jQuery("#exit-intent-form").submit(function(event) {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        event.preventDefault();
        var $thisForm = jQuery(this);
        var data = {};
        var fieldName = '';
        var popError = false;

        var form_id = jQuery(this).attr("id");

        $thisForm.find('span.error-message').remove();
        jQuery(this).find('input, textarea').each(function(i, field) {
            data[field.name] = field.value;
            fieldName = field.name;
            fieldName = fieldName.replace(/_/gi, " ");
            fieldName = fieldName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });

            if (field.name == 'full_name') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'email') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                } else if (!filter.test(field.value)) {
                    $thisForm.find('input[name="' + field.name + '"]').val('').addClass('error').after('<span class="error-message">Invalid email address</span>');
                    if (popError == false)
                        popError = true;
                }
            } else if (field.name == 'phone') {
                if (field.value == '') {
                    $thisForm.find('input[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            }else if (field.name == 'message') {
                if (field.value == '') {
                    $thisForm.find('textarea[name="' + field.name + '"]').addClass('error').after('<span class="error-message">Please fill in the required field.</span>');
                    if (popError == false)
                        popError = true;
                }
            } 
            
        });

        
        if (popError == true) {
            $thisForm.addClass('invalid');
            jQuery(".error-message").show();
            return false;
        } else {

            

            jQuery.ajax({
                type: 'POST',
                url: adminurl,
                data: new FormData(this),
                dataType: 'json',
                contentType: false,
                cache: false,
                processData:false,
                beforeSend: function() {
                    $thisForm.find('.form-loader').show();
                },
                success: function(data) {

                    if (data.result == 'fail') {
                        $thisForm.find('.ajax-message').html(data.message);
                        $thisForm.find('.form-loader').hide();
                    } else {
                        $thisForm.find('.form-loader').hide();
                        $thisForm.find('.ajax-message').html(data.message);

                        jQuery('.exit-form').hide();
                        jQuery('.thank-you-box').show();

                    }
                },
                error: function(err) {
                    alert("Error: There is some issue please try again.");
                    console.log(err);
                }
            });

            
        }
    });