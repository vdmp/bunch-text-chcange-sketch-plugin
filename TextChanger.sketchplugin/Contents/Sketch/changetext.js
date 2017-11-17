//changetext.js

var changeText = function(context) {
  var doc = context.document;
  var selection = context.selection;

  function alert(msg, title) {
    title = title || "alert";
    var app = [NSApplication sharedApplication];
    [app displayDialog:msg withTitle:title];

};

// Check if something selected

if ([selection count] === 0) {
  alert('Please select at least one layer', 'Selection is empty')
  return;
};

// Checking if all selected text layers have the same value, so we can show it in placeholder
// Ignoring layers with name starting with '-'

var placeholder = '';
var thereIsTextLayers = false;
var loopLookup = function(context) {

    for (var j = 0; j < [context count]; j++) {
        var layer = context[j];
        var layerName = [layer name];


            if ([layer class] == MSLayerGroup){
                var group = [layer layers]
                loopLookup(group);
              };

            if ([layer class] == MSTextLayer && layerName.substr(0,1) != '-') {
              var current = String([layer stringValue])

              if (placeholder !== '' && placeholder != current){
              placeholder = '';
              break;
              };

              placeholder = current;
              thereIsTextLayers = true;
            };
      };
};

loopLookup(selection);

if (thereIsTextLayers === false ){
  alert('Select some text layers. Symbols or layers with name starting from "-" does not count.', 'There is no text layers to change!')

}
else {


// Asking client for new value, while showing placeholder if posible

var newText = [doc askForUserInput:"Change text to" initialValue: placeholder];


// Changing all selected text layers, exept ones that have name starting with '-'

var loopChange = function(context) {

    for (var j = 0; j < [context count]; j++) {
      var layer = context[j];
      var layerName = [layer name];


    if ([layer class] == MSLayerGroup ){
      var group = [layer layers]
      loopChange(group);
    };

    if ([layer class] == MSTextLayer && layerName.substr(0,1) != '-') {

        			  [layer setStringValue: newText];

                };
      };
};

loopChange(selection);

};

};
