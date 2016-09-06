(function() {
    $(document).ready(function(){
        init();
    });

    var current_variation = 'control';

    var init = function () {

        $('.tagsinput').tagsinput({
            tagClass: function(item) {
                return 'label label-light';
            }
        });

        applyViewPortClass();
        /**
         * Page Events
         */
        campaignsPageEvents();
        editCampaignPageEvents();

        /**
         * Actions
         */
        campaignSaveEvents();

        $('[data-role="tagsinput"]')
    }

    var editCampaignPageEvents = function() {

        /**
         * Tab Events
         */
        overviewTabEvents();
        variationTabEvents();
        targetingTabEvents();
        //goalTabEvents();
    }
    var targetingTabEvents = function() {
        $('.closeall').click(function(){
            $('.panel-collapse.in').collapse('hide');
        });
        $('.openall').click(function(){
            $('.panel-collapse:not(".in")').collapse('show');
        });
    }

    var goalTabEvents = function() {

        $('[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var target = $(e.target).attr("href");
            if(target == '#goals-tab')
            {
                var campaign_id = $('#campaign-id').val();
                $.get('/goal/event-categories/' + campaign_id, function(data){
                    console.log(data);
                })
            }
        });

        $('.goal-type').change(function(){
            var option = $(this).val();
            var goalItem = $(this).parents('.form-group');
            switch(option) {
                case "0":
                    goalItem.find('.temp-hide').hide();
                    break;
                case "page-visits":
                    goalItem.find('.result-actions').show();
                    break;

            }
        });

        $('.goal-item').change(function() {
            var option = $(this).val();
            $('.result-action-item').hide();

            switch(option) {
                case "url":
                    $('.result-action-url').show();
                    break;
                case "event":
                    $('.result-action-event').show();
                    break;
                case "segment-sequence":
                    $('.result-action-segment-sequence').show();
                    break;
                case "segment-condition":
                    $('.result-action-segment-condition').show();
                    break;

            }
        });

        var typeahead = {

            cInput : $('.typeahead.result-action-goal-category'),
            aInput: $('.typeahead.result-action-goal-action'),
            lInput : $('.typeahead.result-action-goal-label'),

            substringMatcher: function(strs) {
                return function findMatches(q, cb) {
                    var matches, substrRegex;

                    // an array that will be populated with substring matches
                    matches = [];

                    // regex used to determine if a string contains the substring `q`
                    substrRegex = new RegExp(q, 'i');

                    // iterate through the pool of strings and for any string that
                    // contains the substring `q`, add it to the `matches` array
                    $.each(strs, function(i, str) {
                        if (substrRegex.test(str)) {
                            matches.push(str);
                        }
                    });

                    cb(matches);
                };
            },
            typeaheadEvents: function() {

                var self = this;
                //
                //self.cInput = $('#goal-modal .result-action-goal-category');
                //self.aInput = $('#goal-modal .result-action-goal-action');
                //self.lInput = $('#goal-modal .result-action-goal-label');


                var data = $("#h-events-data").val();
                var jsonData = JSON.parse(data);


                self.cInput.typeahead({
                    hint: true,
                    highlight: true,
                    minLength: 1
                },{
                    source: self.substringMatcher(jsonData.categories)
                }).blur(function(){
                    if(jsonData.categories[self.cInput.val()] === undefined) {
                        self.cInput.val('');
                        self.aInput.typeahead('destroy').val('').attr('disabled','disabled');
                        self.lInput.typeahead('destroy').val('').attr('disabled','disabled');
                    }else{
                        self.activateAction(self.cInput.val());
                    }
                })


            },
            activateAction: function(catname) {

                var self = this;
                self.aInput.val('');
                self.lInput.val('');

                var cid = $("#hidden-capmaign-id").val();
                $.getJSON("/admin/getEventActions/"+cid+"/"+catname, function(jsonData) {
                    self.aInput.typeahead('destroy');
                    self.aInput.removeAttr('disabled');
                    self.aInput.typeahead({
                        hint: true,
                        highlight: true,
                        minLength: 1
                    },{
                        source: self.substringMatcher(jsonData.actions)
                    }).blur(function(){
                        if(jsonData.actions[self.aInput.val()] === undefined) {
                            self.aInput.val('');
                            self.lInput.typeahead('destroy').val('').attr('disabled','disabled');
                        }else{
                            self.activateLabel(catname,self.aInput.val());
                        }
                    })
                })

            },
            activateLabel: function(catname,actionname) {


                var self = this;
                var cid = $("#hidden-capmaign-id").val();

                self.lInput.val('');
                $.getJSON("/admin/getEventLabels/"+cid+"/"+catname+"/"+actionname, function(jsonData) {
                    self.lInput.typeahead('destroy');
                    self.lInput.removeAttr('disabled');

                    self.lInput.typeahead({
                        hint: true,
                        highlight: true,
                        minLength: 1
                    },{
                        source: self.substringMatcher(jsonData.labels)
                    }).blur(function(){
                        if(jsonData.labels[self.lInput.val()] === undefined) {
                            self.lInput.val('');
                        }
                    })
                })
            }

        }

    }

    var overviewTabEvents = function() {

        function requestContent()
        {
            var campaign_id = $('#campaign-id').val();
            $.get('/analytics/display/' + campaign_id, function(data){
                $('#overview-tab .panel-body').html(data);
                $('#account-select').trigger('change');
            })
        }

        requestContent();

        $('[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var target = $(e.target).attr("href");
            if(target == '#overview-tab')
            {
                requestContent();
            }
        });

        $(document).on('change','#account-select', function(){
            var account = $(this).val();
            if(account == "0") return;
            var properties = analyticsAccounts.properties[account];
            var options = '<option value="0">Select</option>';
            properties.forEach(function(item){
                options += '<option value="'+ item.id+'">'+item.name+'</option>';
            })
            $("#property-select").html(options);
            $("#profile-select").html('');
            if(authData.property) {
                $('#property-select').val(0);
                if($("#property-select option[value='"+authData.property+"']").length > 0) {
                    $('#property-select').val(authData.property);
                }
                $('#property-select').trigger('change');
            }
        });

        $(document).on('change','#property-select', function(){
            var property = $(this).val();
            if(property == "0" || property === null) return;
            var profiles = analyticsAccounts.profiles[property];
            var options = '<option value="0">Select</option>';
            profiles.forEach(function(item){
                options += '<option value="'+ item.id+'">'+item.name+'</option>';
            });
            $("#profile-select").html(options);
            $('#profile-select').val(0);
            if(authData.profile && $("#profile-select option[value='"+authData.profile+"']").length > 0) {
                $('#profile-select').val( authData.profile);
            }

        });

        $(document).on('click','#disconnect-analytics', function(e){
            e.preventDefault();
            $.ajax({
                url: '/analytics/disconnect/' + $("#campaign-id").val(),
                method: 'DELETE',
                success: function(data) {
                    $("#analytics-tab .panel-body").html(unescape(data.data));
                }
            })
        });



    }

    var campaignsPageEvents = function() {
        var selectedCampaigns = {};

        $('input.custom-cb').iCheck({
            checkboxClass: 'icheckbox_square-grey',
            radioClass: 'iradio_square-grey'
        });

        $('.campaign-row td').not('.cb').not('.running-switch-td').click(function(){
            document.location.href = $(this).parent().data('href');
        });

        $('.campaign-select-cb').on('ifChecked', function(event){

            var id = $(this).data('id');
            selectedCampaigns[id] = true;
            checkButtonState();

        });

        $('.campaign-select-cb').on('ifUnchecked', function(event){

            var id = $(this).data('id');
            delete selectedCampaigns[id];
            checkButtonState();

        });

        function checkButtonState()
        {
            var length = Object.keys(selectedCampaigns).length;
            (length > 0) ? $('.campaign-btns-state').removeAttr('disabled'):$('.campaign-btns-state').attr('disabled','disabled');
        }

        $('.power-switch-cb').click(function(){
            var status = $(this).prop("checked");
            var campaign_id = $(this).parents('.material-switch').data('id');
            console.log(status);
            $.ajax({
                url: '/campaign/power',
                method: 'PUT',
                data: {
                    data: {
                        campaign_id: campaign_id,
                        status: (status == true) ? 1 : 0
                    }
                },
                dataType: 'json',
                success: function() {

                }
            })
        })
    }

    var variationTabEvents = function() {

        var showLastTab = function() {
            $('.nav-variations > li > a:last').tab('show');
        }
        $(document).on('shown.bs.tab', 'a.variationTab' ,function (e) {
            var target = $(e.target).attr("href") // activated tab
            current_variation = target.replace('#', '');
            console.log(current_variation);
        });

        $(document).on('click', '.dd', function(e) {
            e.stopPropagation();
            $('.nav-variations li').removeClass('open');
            $(this).parents('li').addClass('open');
        });

        $(document).on('click',function(event) {
            $('.nav-variations li').removeClass('open');
        });

        $('.editor').each(function (index) {
            var editor;
            editor = ace.edit(this);
            editor.setTheme("ace/theme/monokai");
            editor.getSession().setMode("ace/mode/javascript");
        });

        $('#new-variation-btn').click(function(e){
            e.preventDefault();
            $('#modal-new-variation').modal('show');
        });

        $(document).on('click','.delete-variation', function(e){
            e.preventDefault();
            $('a[href="#'+current_variation+'"]').parents('li').remove();
            $('#'+current_variation).remove();
            showLastTab();
        });

        $(document).on('click','.duplicate-variation', function(e){
            e.preventDefault();
            var varId = $(this).parents('.dropdown').find('.variationTab').attr('href');

            var jsEditor = ace.edit($(varId).find('.js-content .editor')[0]);
            var cssEditor = ace.edit($(varId).find('.css-content .editor')[0]);
            addVariation('New Variation',jsEditor.getValue(),cssEditor.getValue());
        });

        $('#add-variation-btn').click(function(e){
            e.preventDefault();
            $('#modal-new-variation').modal('hide');
            var name = $('#new-variation-name').val();
            addVariation(name);
        });

        var addVariation = function(name, js, css) {
            var js = (typeof js == "undefined") ? "":js;
            var css = (typeof css == "undefined") ? "":css;
            var num = $('.nav-variations > li').length;
            var newVarId = 'variation-' + num;
            current_variation = newVarId;

            //add the tab
            $('<li><a href="#'+newVarId+'" class="variationTab" data-variation="'+newVarId+'" data-toggle="tab">'+name+'</a>' +
                '<div class="dd"><span class="caret"></span></div>' +
                '<ul class="dropdown-menu">' +
                '<li><a href="#" class="duplicate-variation">Duplicate Variation</a></li>' +
                '<li><a href="#" class="rename-variation">Rename Variation</a></li>' +
                '<li><a href="#"  class="delete-variation">Delete Variation</a></li>' +
                '<li><a href="#">Pause Variation</a></li>' +
                '<li><a href="#" class="preview-variation">Preview Variation</a></li>' +
                '</ul>' +
                '</li>')
                .appendTo('.nav-variations');

            //add the content
            var content =  '<div class="tab-pane active" id="'+newVarId+'"> \
                                <ul id="varTab'+num+'" class="nav nav-tabs responsive"> \
                                    <li class="active"><a href="#js-tab'+num+'" data-toggle="tab">JS</a></li> \
                                    <li class=""><a href="#css-tab'+num+'" data-toggle="tab">CSS</a></li> \
                                </ul> \
                                <div id="varTabContent'+num+'" class="tab-content responsive"> \
                                    <div id="js-tab'+num+'" class="tab-pane fade active in"> \
                                        <div class="editor">'+js+'</div> \
                                    </div> \
                                    <div id="css-tab'+num+'" class="tab-pane fade in"> \
                                        <div class="editor">'+css+'</div> \
                                    </div> \
                                </div> \
                            </div>';
            $(content).appendTo('.tab-content-side');

            $('.editor').each(function (index) {
                var editor;
                editor = ace.edit(this);
                editor.setTheme("ace/theme/monokai");
                editor.getSession().setMode("ace/mode/javascript");
            });

            showLastTab();
        }
    }

    var applyViewPortClass = function () {
        var $window = $(window),
            $html = $('html');
        $(window).bind('resize', function (e) {
            e.stopPropagation();

            function resize() {
                $html.removeClass('xs sm md lg');

                if ($window.width() < 768) {
                    return $html.addClass('xs');
                }
                else if ($window.width() > 768 && $window.width() < 992) {
                    return $html.addClass('sm');
                }
                else if ($window.width() > 992 && $window.width() < 1200) {
                    return $html.addClass('md');
                }
                else if ($window.width() > 1200) {
                    return $html.addClass('lg');
                }
            }

            resize();
            //$window.resize(resize).trigger('resize');
        });
        $window.trigger('resize');
    }

    var campaignSaveEvents = function () {

        var generalData = function () {

            var data = {};
            var obj = {}
            $("#general-block .general-block-input").each(function () {
                obj[$(this).attr('id')] = $(this).val();
            })
            data['general-settings'] = obj;

            return data;
        }

        var targetingData = function () {

            var data = {};
            var obj = {};

            /*---------- User Block----------- */
            $("#user-block .user-block-input").each(function () {
                obj[$(this).attr('id')] = $(this).is(':checked')
            })
            data['user'] = obj;

            /*---------- URL Block----------- */
            obj = {}
            $("#url-block .url-block-input").each(function () {
                var tagsInput = $(this).tagsinput('items');
                obj[$(this).attr('id')] = tagsInput;
            })
            data['url'] = obj;

            /*---------- Device Block----------- */
            obj = {}
            $("#device-block .device-block-input").each(function () {
                obj[$(this).attr('id')] = $(this).val();
            })
            data['device'] = obj;

            /*---------- Browser Block----------- */
            obj = {}
            $("#browser-block .browser-block-input").each(function () {
                obj[$(this).attr('id')] = $(this).is(':checked')
            })
            data['browser'] = obj;

            /*---------- Geographic Block----------- */
            obj = {}
            $("#geo-block .geo-block-input").each(function () {
                if($(this).data('role') == "tagsinput") {
                    var tagsInput = $(this).tagsinput('items');
                    obj[$(this).attr('id')] = tagsInput;
                }else{
                    obj[$(this).attr('id')] = $(this).is(':checked');
                }
            })
            data['geographic'] = obj;

            /*---------- Cookie Block----------- */
            var obj = {}
            $("#cookie-block .cookie-block-input").each(function () {
                obj[$(this).attr('id')] = $(this).tagsinput('items');
            })
            data['cookie'] = obj;

            /*---------- IP Block----------- */
            var obj = {}
            $("#ip-block .ip-block-input").each(function () {
                obj[$(this).attr('id')] = $(this).tagsinput('items');
            })
            data['ip'] = obj;

            /*---------- Language Block----------- */
            var obj = {}
            $("#language-block .language-block-input").each(function () {
                obj[$(this).attr('id')] = $(this).tagsinput('items');
            })
            data['language'] = obj;

            /*---------- Script Block----------- */
            data['script'] = {
                js: $("#script_fn").val()
            }

            return data;
        }

        var variationsData = function () {
            var data = {};

            $('.nav-variations > li').each(function(){
                var $variationObj = $(this).find('.variationTab');
                var variationName = $variationObj.data('variation');
                var varId = $variationObj.attr('href');

                var jsEditor = ace.edit($(varId).find('.js-content .editor')[0]);
                var cssEditor = ace.edit($(varId).find('.css-content .editor')[0]);

                data[variationName] = {
                    js: jsEditor.getValue(),
                    css: cssEditor.getValue(),
                    name: $variationObj.text()
                }
            });

            return data;
        }

        var analyticsData = function () {
            var data = {};
            if($("#analytics-connection").length > 0)
            {
                data.account = $("#account-select").val();
                data.property = $("#property-select").val();
                data.profile = $("#profile-select").val();
            }
            return data;
        }

        var goalsData = function () {




        }

        var campaignSaveClicked = function () {
            var data = {};
            data.general = generalData();
            data.targets = targetingData();
            data.variations = variationsData();
            data.analytics = analyticsData();
            //data.goals = goalsData();
            data.id = $("#campaign-id").val();
            return data;
        }

        $("#campaign-save-btn").click(function (e) {

            e.preventDefault();
            var allData = campaignSaveClicked();

            console.log(allData);

            $.ajax({
                url: '/campaign/save',
                type: 'PUT',
                dataType: 'json',
                // contentType: 'application/json; charset=utf-8',
                data: {data: allData},
                success: function (res) {
                    console.log(res);
                }
            })
        });

    };
})();


//var saveGoal = function(id) {
//    $container = $("#goal-results tbody");
//    $goalModalItem = $("#goal-modal .goal-item");
//    $goalModal = $("#goal-modal");
//
//    var goalObj = {
//        name: $goalModalItem.find('.goal-name').val(),
//        type: $goalModalItem.find('.goal-type').val(),
//        action: $goalModalItem.find('.result-actions select').val(),
//        url:  $goalModalItem.find('.result-action-url input').val(),
//        eLabel:  $goalModalItem.find('.result-action-goal-label.tt-input').val(),
//        eAction:  $goalModalItem.find('.result-action-goal-action.tt-input').val(),
//        eCategory:  $goalModalItem.find('.result-action-goal-category.tt-input').val(),
//        segmentSequence:  $goalModalItem.find('input.result-action-segment-sequence').val(),
//        segmentSequenceFilter:  $goalModalItem.find('.result-action-segment-sequence-filter').val(),
//        segmentCondition:  $goalModalItem.find('input.result-action-segment-condition').val(),
//        segmentConditionFilter:  $goalModalItem.find('.result-action-segment-condition-filter').val()
//    }
//    var goalString = JSON.stringify(goalObj);
//    if($goalModal.attr('action') == "edit") {
//        var index = $goalModal.attr('row-no');
//        $row = $container.children().eq(index);
//        $row.attr('data-goal',goalString);
//    }else{
//        $container.append("<tr class='goal-row' data-goal='"+goalString+"'>\
//		<td>"+goalObj.name+" <br/>\
//			<a href='' onClick='goal.removeGoal(this,"+id+"); return false;'>Remove</a> | \
//       		<a href='' onClick='goal.editGoal(\'#goal-modal\',goalObj.name,this);return false;'>Edit</a> \
//		</td>\
//		<td></td>\
//		<td></td>\
//	</tr>");
//    }
//    $goalModal.modal('hide');
//    this.saveGoals(id);
//}
//var saveGoals = function(id) {
//
//    var data = [];
//    $("#goal-results .goal-row").each(function(){
//
//        var goalObj = JSON.parse($(this).attr('data-goal'));
//        data.push(goalObj);
//    });
//
//    $.ajax({
//        url: '/post/saveGoals',
//        dataType: 'json',
//        data: "id="+id+"&goals="+JSON.stringify(data),
//        type:"POST",
//        success: function(data) {
//            admin.showMessage("Goal saved");
//        }
//    });
//}
//var removeGoal =  function(obj,cid) {
//
//    $(obj).parents('tr').remove();
//    this.saveGoals(cid);
//}