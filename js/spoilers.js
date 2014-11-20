// from http://stackoverflow.com/questions/9213907/jquery-selector-that-simulates-starts-with-or-ends-with-for-searching-text
$.extend($.expr[":"], {
    "starts-with": function(elem, i, data, set) {
        var text = $.trim($(elem).text()),
            term = data[3];

        // first index is 0
        return text.indexOf(term) === 0;
    },

    "ends-with": function(elem, i, data, set) {
        var text = $.trim($(elem).text()),
            term = data[3];

        // last index is last possible
        return text.lastIndexOf(term) === text.length - term.length;
    }
});


var unspoil = function() {
    var contents = ['.userContent:not([data-spoilers]):contains([Spoiler:])', 'span.UFICommentBody:not([data-spoilers]):contains([Spoiler:])', '.userContent:not([data-spoilers]):contains([spoiler:])', 'span.UFICommentBody:not([data-spoilers]):contains([spoiler:])'];

    for(var i = 0; i < contents.length; ++i) {
        $.each($(contents[i]), function() {
            var text =  $(this).text();
            var start = text.toLowerCase().indexOf("[spoiler:]");
            var end   = text.toLowerCase().indexOf("[:spoiler]");

            if(end == -1) {                         // no end tag
                if(start == 0) {                    // start tag at start
                    text = "<div class='x-spoiler'>"+text.substr(10, text.length)+"</div>";
                }
                else if (start > 0) {               // start tag in middle
                    text = "<div class='x-spoiler'>"+text.substr(0, start) + text.substr(start+10, text.html)+"</div>";
                }
            }
            else {                                  // there is an end tag
                if (end == text.length - 10) {      // end tag at end
                    if (start == 0) {               // start tag at start
                        text = "<div class='x-spoiler'>"+text.substr(10,text.length-20)+"</div>";
                    }
                    else {                          // start tag in middle
                        text = "<div class='x-spoiler'>"+text.substr(0,start) + text.substr(start+10, text.length);
                        text = text.substr(0, text.length-10)+"</div>";
                    }
                }
                else {                              // end tag in middle
                    if (start == 0) {               // start tag at start
                        text = text.substr(10,end-10)+text.substr(end+10,text.length);
                        text = "<div class='x-spoiler'>"+text+"</div>";
                    }
                    else {                          // start tag in middle
                        text = text.substr(0,start)+text.substr(start+10,text.length);
                        text = "<div class='x-spoiler'>"+text.substr(0,end-10)+text.substr(end, text.length)+"</div>";
                    }
                }
            }
            $(this).html(text);
            $(this).data('spoilers','true');
        });
    }
}

$(document).ready(function(){
    
    unspoil();

    document.addEventListener("DOMNodeInserted", function(evt) {
        unspoil();
    }, false);
});