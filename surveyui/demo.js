$(document).ready(function() {

    $('#surveyForm').submit(function(e) {
        if($('#surveyForm').validate()) {
            e.preventDefault();
            //alert(JSON.stringify($('#surveyForm').serializeObject()));
            $.ajax({
              type: "POST",
              url: "http://www.smart-platform.com:9081/TPddR9T6Wf_14/Survey/RecordAnswer",
              data: JSON.stringify($('#surveyForm').serializeObject()),
              dataType: 'json'
            }).done(function( msg ) {
              //alert(msg);
            });
            $('#surveysection').toggle();
            $('#responseSection').toggle();
        }
    });


    //Connect to the server & get the questions
    var request = {'FlowAdmin':
                    {'___smart_action___':'lookup','___smart_value___':'Survey'},
                    'group':'Questionaire',
                        'key':'1'};
    $.ajax({
      type: "POST",
      url: "http://www.smart-platform.com:9081/TPddR9T6Wf_14/Survey/LookupEvent",
      data: JSON.stringify(request),
      dataType: 'json'
    }).done(function( msg ) {
      buildSurvey(msg);
    });
});

function buildSurvey(message) {
    var response = message;
    //alert(message);
    //Parse the questionaire into JSON object
    var parsedQuestionaire = response;
    //If questionaire comes
    if(parsedQuestionaire !== undefined) {

        //Retrieve the questions array
        var questions = parsedQuestionaire.responses[0].result[0].questions;

        //Check if there are questions
        if(questions!==undefined && questions.length>0) {
            addHeader();
            var size = questions.length;
            $('#numberOfQuestions').val(size);
            for (var numberOfQuestions = 0; numberOfQuestions < size; numberOfQuestions++) {
                var question = questions[numberOfQuestions].question;
                addQuestion(question, numberOfQuestions, size);
            }
            //addEmail();
            addSubmit();
        } else {
            // Handle no quetionaire
            alert("No questions");
        }

    } else {
        // Handle no quetionaire
        alert("No questions");
    }
}


function addHeader() {
    $("#progress").append('<p>Testing</p>');
    $("#para").text("Connected");
    var form = $('<form></form>').attr("id",'surveyForm' ).attr("name", 'surveyForm');
    //$("#surveysection").append(form);
    $('#surveyForm').append('<div id="title" class="row"><div id="tenantdiv" class="span6 offset1"><label for="tenant">Survey Questions </label></div><div id="filldiv" class="span6"></div></div><hr/>');
}

function addEmail() {
    var emailDiv = '<div id="emaildiv" class="row"><div id="tenantdiv" class="span4 offset4"><label for="emailid" id="">Email ID : &nbsp;</label><input type="text" id="emailid" email/></div></div>';
;               $('#surveyForm').append(emailDiv);
}

function addSubmit() {
    var submitDiv = '<div id="submit" class="row"><div id="tenantdiv" class="span1 offset5"><input type="submit" id="submitsurvey"/></div></div>';
;               $('#surveyForm').append(submitDiv);
}

function addQuestion(question, numberOfQuestions, size) {

    // Add a row
    var rowid = 'questions' + numberOfQuestions;
    var divToAppend = '<div id="'+ rowid + '" class="row">';

    $('#surveyForm').append(divToAppend);

    var divQuestionToAppend = '<div id="tenantdiv" class="span5 offset1"><span class="question">' + (numberOfQuestions + 1) + ' . ' + question + '</span></div><div id="yesdiv" class="span1"><span class="choice"><input type="radio" name="choice' + (numberOfQuestions + 1) + '" value="aye" required="required">Yes</span></div><div id="nodiv" class="span1"><span class="choice"><input type="radio" name="choice' + (numberOfQuestions + 1) + '" value="nay" required="required">No</span></div><div id="commentsdiv" class="span4"><span class="reason">Comments <textarea rows="4" cols="50" id="why' + (numberOfQuestions + 1) + '" name="why' + (numberOfQuestions + 1) + '" class="required whytext"/></span></div>';

    //Add the full row content to the questions div
    $('#' + rowid).append(divQuestionToAppend);
}


$.fn.serializeObject = function()
{

    var answers = [];
    var questions = $('#numberOfQuestions').val();
    for (var numberOfQuestions = 0; numberOfQuestions < questions; numberOfQuestions++) {
        var temp = {};
        temp.answer =   $('input:radio[name=choice' + (numberOfQuestions + 1) +']:checked').val();
        temp.comment = ($('#why' + (numberOfQuestions + 1))).val();
        answers.push(temp);
    }

    //alert(JSON.stringify(answers));

    var o = {
                'Survey':{
                    '___smart_action___':'lookup',
                    '___smart_value___':'1'
    },'answers':answers};

    return o;
};
