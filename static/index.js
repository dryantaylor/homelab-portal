
var raw = $(document.currentScript).attr('data_json') || '';
var yamlDataObj = JSON.parse(raw.replace(/'/g, '"'));
console.log(yamlDataObj);

// Ensure parent containers use W3.CSS row/row-padding for flex layout
$('#servers').addClass('w3-row w3-row-padding');
$('#services').addClass('w3-row w3-row-padding');

//build server cards
var serverssHtml = {};
$.each(yamlDataObj.servers || [], function(i, server) {
    var $col = $('<div>').addClass('w3-col s12 m6 l3');
    var $card = $('<div>').addClass('w3-card w3-white w3-padding w3-margin-bottom');
    $card.append($('<h3>').text(server));
    $card.append($('<p>').text('Name: ' + server));
    serverssHtml[server] = $card;
    $col.append($card);
    $('#servers').append($col);
});

//build service cards, store references for filtering later
var servicesHtml = {};
$.each(yamlDataObj.services || {}, function(name, service) {
    // Create a card for each service
    var $col = $('<div>').addClass('w3-col s12 m6 l4');
    var $card = $('<div>').addClass('w3-card w3-white w3-padding w3-margin-bottom');

    //if protocol is defined, make the header a link to the service
    var $header;
    if (service.protocol != undefined){
        $header = $('<h3>')
                    .append($('<a>')
                        .text(name + ' (' + service.protocol +"://"+service.host+ '/' + service.port + ')')
                        .attr('href', service.protocol + '://' + service.host + ':' + service.port)
                    ); 
    }else {
        $header = $('<h3>').text(name + ' (' + service.host+ '/' + service.port + ')');
    }
    $card.append($header);

    // Build a two-column layout inside the card: details on left, optional icon on right
    var $row = $('<div>').addClass('w3-row');
    var $left = $('<div>').addClass('w3-col s9');
    var $right = $('<div>').addClass('w3-col s3 w3-center');

    // Add service details, excluding port, protocol, and icon (icon shown visually)
    var $list = $('<ul>').addClass('w3-ul');
    $.each(service || {}, function(key, val) {
        if (!(['port', 'protocol', 'icon'].includes(key))) {
            $list.append($('<li>').addClass('w3-bar').text(key + ': ' + val));
        }
    });
    $left.append($list);

    // If an icon is provided render it on the right
    if (service.icon != undefined) {
        var iconSrc = "/static/" + service.icon;
        
        var $iconWrap = $('<div>').css({
            display: 'inline-block',
            border: '2px solid #000',
        });
        var $img = $('<img>').attr('src', iconSrc).attr('alt', name + ' icon').addClass('w3-image').css({
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
            alignSelf: 'center',
        });
        $iconWrap.append($img);
        $right.append($iconWrap);
    }

    $row.append($left).append($right);
    $card.append($row);
    servicesHtml[name] = $card; // store for later if needed
    $col.append($card);
    $('#services').append($col);

});

//populate server filter dropdown
var $serverFilter = $('#serverFilter');
yamlDataObj.servers.forEach(function(server) {
    $serverFilter.append($('<option>').attr('value', server).text(server));
});

//populate service filter dropdown
const categories = new Set(Object.values(yamlDataObj.services || {}).map(s=>s.category).flat());
console.log(categories);
var $categoryFilter = $('#categoryFilter');
for (const category of categories) {
    $categoryFilter.append($('<option>').attr('value', category).text(category));
}

function updateFilter(){
    var selectedServer = $('#serverFilter').val();
    var showServers = [];
    if (selectedServer === 'all') {
        showServers = yamlDataObj.servers;
    } else {
        showServers = [selectedServer];
    }
    var selectedCategory = $('#categoryFilter').val();
    var showCategories = [];
    if (selectedCategory === 'all') {
        console.log("show all services");
        showCategories = Array.from(categories);
    } else{
        showCategories = [selectedCategory];
    }
    console.log("show services : ["+ showCategories+"]");
    $.each(yamlDataObj.services || {}, function(name, service) {
        if (showServers.includes(service.host) && service.category.map(c=>showCategories.includes(c)).includes(true)) {
            console.log("showing " + name);
            servicesHtml[name].show();
        } else {
            console.log("hiding " + name);
            servicesHtml[name].hide();
        }
    });
}

$('#serverFilter').change(updateFilter);
$('#categoryFilter').change(updateFilter);
