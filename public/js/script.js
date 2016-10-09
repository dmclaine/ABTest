(function() {
    var main;
    $(document).ready(function(){
        main = init();
    });
    var typeahead;
    var current_variation = 'control';

    var init = function () {


        $('.tagsinput').tagsinput({
            tagClass: function(item) {
                return 'label label-light';
            }
        });

        applySidebarEvents();

        applyViewPortClass();
        /**
         * Page Events
         */
        if($('body.new-campaign').length > 0 || $('body.edit-campaign').length > 0) {
            var ecpe = editCampaignPageEvents();

            /**
             * Actions
             */
            campaignSaveEvents();
            return {
                editCampaignPageEvents: ecpe
            }
        }

        if($('body.campaigns').length > 0 || $('body.archived-campaigns').length >  0) {
            campaignsPageEvents();
        }

        if($('body.snippet').length > 0) {
            snippetPageEvents();
        }


    }

    var snippetPageEvents = function() {
        if($('#snippet-editor').length > 0) {
            editor = ace.edit('snippet-editor');
            editor.setTheme("ace/theme/monokai");
            editor.getSession().setMode('ace/mode/javascript');
        }
    }

    var applySidebarEvents = function() {
        var sidebar_status = localStorage.getItem('sidebar-slim');
        if(sidebar_status !== null && sidebar_status =="false") {
            $('body').removeClass('sidebar-slim');
        }
        $('.sidebar-toggle').click(function(){
            $('body').toggleClass('sidebar-slim');
            if($('body').hasClass('sidebar-slim')) {
                localStorage.setItem('sidebar-slim',true);
            }else{
                localStorage.setItem('sidebar-slim',false);
            }
        })


        $('#title-breadcrumb-option-demo').scrollToFixed();
        $('.bottomfixed').scrollToFixed( {
            bottom: 0,
            width: 250
        });
        $('#sidebar').scrollToFixed({top: '50px'});

        function autoHide()
        {
            if(sidebar_status !== null) {
                if ($(window).width() <= 768) {
                    $('body').addClass('sidebar-slim')
                } else {
                    $('body').removeClass('sidebar-slim')
                }
            }
        }

        autoHide();

        $(window).resize(autoHide);

    }

    var editCampaignPageEvents = function() {

        /**
         * Tab Events
         */
        var ote = overviewTabEvents();
        var vte = variationTabEvents();
        var tte = targetingTabEvents();
        return {
            overview: ote,
            variation: vte,
            targeting: tte
        }
    }
    var timeout;
    var messageBox = function(msg) {
        clearTimeout(timeout);
        $("#message-box").html(msg).show();

        timeout = setTimeout(function() {
            $("#message-box").hide();
        },2000);
    }

    var goalEvents = function() {

        $.get('/goal/event-categories', function(response){
            typeahead.typeaheadEvents(response.data);
        })

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

        $('.goal-arrive').change(function(){
            var option = $(this).val();

            switch(option) {
                case "0":
                    $('.arrive-action-pathpath').hide();
                    break;
                case "page-path":
                    $('.arrive-action-pathpath').show();
                    break;

            }
        });

        $('.goal-action').change(function() {
            var option = $(this).val();
            $('.result-action-item').hide();

            switch(option) {
                case "action-pp":
                    $('.result-action-pp').show();
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

        typeahead = {

            cInput : $('.typeahead.result-action-goal-category'),
            aInput: $('.typeahead.result-action-goal-action'),
            lInput : $('.typeahead.result-action-goal-label'),

            checkActivation: function() {
                this.activateAction();
                this.activateLabel();
            },
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
            typeaheadEvents: function(jsonData) {

                var self = this;

                self.cInput.typeahead({
                    hint: true,
                    highlight: true,
                    minLength: 1
                },{
                    source: self.substringMatcher(jsonData)
                }).blur(function(){
                    if(jsonData[self.cInput.val()] === undefined) {
                        self.cInput.val('');
                        self.aInput.typeahead('destroy').val('').attr('disabled','disabled');
                        self.lInput.typeahead('destroy').val('').attr('disabled','disabled');
                    }else{
                        self.activateAction();
                    }
                })


            },
            activateAction: function() {

                var self = this;
                var $category = $('.typeahead.result-action-goal-category.tt-input');
                if($category.length == 0 || $category.val() == undefined || $category.val() == "") {
                    return;
                }
                self.aInput.val('');
                self.lInput.val('');

                $.getJSON("/goal/event-actions/"+self.cInput.val(), function(jsonData) {
                    self.aInput.typeahead('destroy');
                    self.aInput.removeAttr('disabled');
                    self.aInput.typeahead({
                        hint: true,
                        highlight: true,
                        minLength: 1
                    },{
                        source: self.substringMatcher(jsonData.data)
                    }).blur(function(){
                        if(jsonData.data[self.aInput.val()] === undefined) {
                            self.aInput.val('');
                            self.lInput.typeahead('destroy').val('').attr('disabled','disabled');
                        }else{
                            self.activateLabel();
                        }
                    })
                })

            },
            activateLabel: function() {

                var self = this;
                var $action = $('.typeahead.result-action-goal-action.tt-input');
                if($action.length == 0 || $action.val() == undefined || $action.val() == "") {
                    return;
                }

                self.lInput.val('');
                $.getJSON("/goal/event-labels/"+self.cInput.val()+"/"+self.aInput.val(), function(jsonData) {
                    self.lInput.typeahead('destroy');
                    self.lInput.removeAttr('disabled');

                    self.lInput.typeahead({
                        hint: true,
                        highlight: true,
                        minLength: 1
                    },{
                        source: self.substringMatcher(jsonData.data)
                    }).blur(function(){
                        if(jsonData.data[self.lInput.val()] === undefined) {
                            self.lInput.val('');
                        }
                    })
                })
            }

        }

    }

    var overviewTabEvents = function() {

        $(document).on('click','.daterangeicon',function(){
            $('#reportrange').trigger('click');
        });
        $rr  = $('#reportrange');


        $rr.daterangepicker({
            "autoApply": true,
            "startDate": moment($rr.data('start')).format('MM/DD/YYYY'),
            "endDate":moment($rr.data('end')).format('MM/DD/YYYY'),
            "opens": "left"
        }, function(start, end, label) {

            console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
            $.ajax({
                url: '/reporting/set-start-date',
                data: {
                    campaign_start_date: start.format('YYYY-MM-DD'),
                    campaign_end_date: end.format('YYYY-MM-DD')
                },
                method: 'POST',
                success: function() {
                    getTrafficChart();
                    getGoalsChart();
                }
            })

        });

        $(document).on('click','#toggle-account-details-btn',function(){

            $('#account-details').toggleClass('hide');
            if($(this).find('i').hasClass('fa-expand')) {
                $(this).find('i').removeClass('fa-expand').addClass('fa-compress');
            }else{
                $(this).find('i').removeClass('fa-compress').addClass('fa-expand');
            }

        });

        $(document).on('click','#new-goal-btn',function(e){
            e.preventDefault();
            messageBox('Loading..');
            var id = 0;
            $.get('/goal/display-goal-popup/'+id, function(data){
                $('#goal-setup-popup-box').html(data);
                goalEvents();
                typeahead.checkActivation();
                $('#modal-goal-setup').modal('show');
            })
        });

        $(document).on('click','.edit-goal', function(e){
            e.preventDefault();
            var id = $(this).data('id');
            $('#goal-setup-popup-box').html('');
            $.get('/goal/display-goal-popup/'+id, function(data){
                $('#goal-setup-popup-box').html(data);
                goalEvents();
                typeahead.checkActivation();
                $('#modal-goal-setup').modal('show');
            })
        });

        $(document).on('click','.delete-goal', function(e){
            e.preventDefault();
            var id = $(this).data('id');
            var $this = $(this);
            $.post('/goal/delete-goal/'+id, function(data){
                $this.parents('#panel-'+id).remove();
                messageBox('Goal Deleted');
            })
        });



        $(document).on('click','#new-goal-save-btn',function(){
            saveGoal();
        })

        function getTrafficChart()
        {
            messageBox('Loading Traffic Report..');
            $.get('/reporting/traffic-report', function(data) {
                messageBox('Loading Goals Report..');
                $('#report-overview').html(data);
            })
        }

        function getGoalsChart()
        {
            messageBox('Loading');
            $.get('/reporting/goals-report', function(data) {
                $('#report-goals').html(data);
            })
        }

        function requestContent()
        {
            var campaign_id = $('#campaign-id').val() || 0;
            messageBox('Loading..');
            $.get('/analytics/display/' + campaign_id, function(data){
                $('#overview-tab #analytics-connection.panel-body').html(data);
                $('#account-select').trigger('change');

                if($('#disconnect-analytics').length > 0) {
                    //get variation data
                    getTrafficChart();
                    getGoalsChart();
                }
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

        return {
            goalChart: getGoalsChart
        }

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

        $('.campaign-archive').click(function(e){
            e.preventDefault();
            var $campaigns = $('.campaign-select-cb:checked');
            var campaign_ids = [];
            $campaigns.each(function(){
                campaign_ids.push($(this).data('id'));
            })

            $.ajax({
                url: '/dashboard/campaigns/do-archive',
                data: {data: campaign_ids},
                method: 'POST',
                success: function(data) {
                    if(data && data.flag) {
                        $campaigns.each(function(){
                            $(this).parents('tr').remove();
                        })
                    }
                }
            })

        })

        $('.campaign-duplicate').click(function(e){
            e.preventDefault();
            var $campaigns = $('.campaign-select-cb:checked');
            var campaign_ids = [];
            $campaigns.each(function(){
                campaign_ids.push($(this).data('id'));
            })

            $.ajax({
                url: '/dashboard/campaigns/do-duplicate',
                data: {data: campaign_ids},
                method: 'POST',
                success: function(data) {
                    if(data && data.flag) {
                        location.reload();
                    }
                }
            })

        })


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

        var createEditor = function() {
            $('.editor').each(function (index) {
                var editor;
                var type = $(this).data('type');
                editor = ace.edit(this);
                editor.setTheme("ace/theme/monokai");
                editor.getSession().setMode(type);
            });
        }

        createEditor();

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



        $('#new-variation-btn').click(function(e){
            e.preventDefault();
            $('#modal-new-variation').modal('show');
        });

        var preview_cid, preview_vid;
        $(document).on('click','.preview-variation',function(e){
            e.preventDefault();
            preview_cid = $(this).data('cid');
            preview_vid = $(this).data('vid');
            $('#modal-preview-variation').modal('show');
        });

        $('#variation-preview-btn').click(function(e){
            e.preventDefault();
            var url = $('#url-preview-input').val();
            window.open(url + '?preview=1&cid='+preview_cid+'&vid='+preview_vid);
            $('#modal-preview-variation').modal('hide');
        })

        $(document).on('click','.pause-variation', function(e){
            e.preventDefault();
            var $selected = $(this).parents('li').find('.variationTab');

            var status = ($selected.attr('data-paused') == "true") ? "false":"true";

            if(status == 'true') {
                $selected.find('i').attr('class','fa fa-pause');
                $(this).text('Unpause Variation')
            }else{
                $selected.find('i').attr('class','');
                $(this).text('Pause Variation')
            }
            $selected.attr('data-paused', status);

            //save the campaign
            $("#campaign-save-btn").trigger('click');
        });

        $(document).on('click','.delete-variation', function(e){
            e.preventDefault();
            var $selected = $(this).parents('li').find('.variationTab');
            var id = $selected.data('variation');
            $selected.parents('li').remove();
            $('#'+id).remove();
            $('.'+id).remove();
            targetingTabEvents().resetTrafficDistribution();
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
                                        <div class="editor" data-type="ace/mode/javascript">'+js+'</div> \
                                    </div> \
                                    <div id="css-tab'+num+'" class="tab-pane fade in"> \
                                        <div class="editor" data-type="ace/mode/css">'+css+'</div> \
                                    </div> \
                                </div> \
                            </div>';
            $(content).appendTo('.tab-content-side');

            createEditor();

            showLastTab();

            $('.traffic-block .panel-body').append('<div class="form-group '+newVarId.replace('#','')+'"> \
                                <label class="col-sm-3 control-label">'+name+'</label> \
                                <div class="col-md-9 controls"> \
                                    <div class="row"> \
                                        <div class="col-xs-2 slide-holder"> \
                                            <input class="form-control col-xs-2 var-traffic" type="text" value="" id="'+newVarId+'-traffic"> \
                                        </div> \
                                    </div> \
                                </div> \
                            </div>');

            targetingTabEvents().resetTrafficDistribution();
        }
    }

    var targetingTabEvents = function() {

        $('#accordion .collapse').on('shown.bs.collapse', function(){
            $(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
        }).on('hidden.bs.collapse', function(){
            $(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
        });

        $('[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var target = $(e.target).attr("href");
            if(target == '#targeting-tab')
            {

            }
        });

        $('.slider').slider().on('slide', function(ev){
            $(this).parents('.slide-holder').find('.traffic-display').html(ev.value);
        });

        var resetTrafficDistribution = function() {
            var num = $('.nav-variations > li').length;
            var traffic = (100/parseInt(num)).toFixed(2);
            $('.var-traffic').val(traffic);
        }
        return {
            resetTrafficDistribution: resetTrafficDistribution
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

        //var generalData = function () {
        //
        //    var data = {};
        //    var obj = {}
        //    $("#general-block .general-block-input").each(function () {
        //        obj[$(this).attr('id')] = $(this).val();
        //    })
        //    data['general-settings'] = obj;
        //
        //    return data;
        //}

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
                obj[$(this).attr('id')] = $(this).is(':checked');
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
            var obj = {};
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
                    js: jsEditor.getValue().trim(),
                    css: cssEditor.getValue().trim(),
                    name: $variationObj.text().trim(),
                    id: varId.replace('#',''),
                    traffic: $(varId + '-traffic').val().trim(),
                    paused: $variationObj.attr('data-paused')
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
            //data.general = generalData();
            data.targets = targetingData();
            data.variations = variationsData();
            data.analytics = analyticsData();
            //data.goals = goalsData();
            data.id = $("#campaign-id").val();
            data.name = $("#campaign_name").val();
            data.traffic = $("#allowed-traffic").val();
            return data;
        }

        $("#campaign-save-btn").click(function (e) {

            e.preventDefault();
            var allData = campaignSaveClicked();
            messageBox('Saving..');
            console.log(allData);

            $.ajax({
                url: '/campaign/save',
                type: 'POST',
                dataType: 'json',
                // contentType: 'application/json; charset=utf-8',
                data: {data: allData},
                success: function (res) {
                    if(allData.id == "") {
                        document.location = '/dashboard/campaign/edit/' + res.data.campaign_id;
                    }
                    messageBox('Saved!');
                }
            })
        });

    };

    var saveGoal = function() {
        var $container = $("#goal-results tbody");
        var $goalModalItem = $("#modal-goal-setup");
        var $goalModal = $("#modal-goal-setup");

        var goalObj = {
            id: $goalModalItem.find('#goal_id').val(),
            name: $goalModalItem.find('.goal-name').val(),
            arrive_action: $goalModalItem.find('.goal-arrive').val(),
            page_path: $goalModalItem.find('.arrive-action-pathpath input').val(),
            action: $goalModalItem.find('.result-actions select').val(),
            action_pp_pattern: $goalModalItem.find('.result-action-url-pattern').val(),
            action_pp:  $goalModalItem.find('.result-action-pp input').val(),
            e_label:  $goalModalItem.find('.result-action-goal-label.tt-input').val(),
            e_action:  $goalModalItem.find('.result-action-goal-action.tt-input').val(),
            e_category:  $goalModalItem.find('.result-action-goal-category.tt-input').val(),
            segment_sequence:  $goalModalItem.find('input.result-action-segment-sequence').val(),
            segment_sequence_filter:  $goalModalItem.find('.result-action-segment-sequence-filter').val(),
            segment_condition:  $goalModalItem.find('input.result-action-segment-condition').val(),
            segment_condition_filter:  $goalModalItem.find('.result-action-segment-condition-filter').val()
        }
        messageBox('Saving..');
        saveGoals(goalObj, function() {
            messageBox('Saved!');
            main.editCampaignPageEvents.overview.goalChart();
        });
    }
    var saveGoals = function(goalObj,callback) {

        var data = [];
        $("#goal-results .goal-row").each(function(){

            var goalObj = JSON.parse($(this).attr('data-goal'));
            data.push(goalObj);
        });

        $.ajax({
            url: '/goal/save-goal',
            dataType: 'json',
            data: {goal: goalObj},
            type:"POST",
            success: function(data) {
                callback();
            }
        });
    }
})();
//
//

//var removeGoal =  function(obj,cid) {
//
//    $(obj).parents('tr').remove();
//    this.saveGoals(cid);
//}