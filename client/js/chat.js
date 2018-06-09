let socket = io();

function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child')
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}
////
// Socket
////
socket.on('connect', () => {
  let params = jQuery.deparam(window.location.search)
  console.log(params)
  socket.emit('join', params, function (err) {
    if (err) {
      alert(err)
      window.location.href = '/'
    } else {
      
    }
  })
})
socket.on('disconnect', () => {
  console.log('No More Money Popping')
})

socket.on('updateUserList', function (users) {
  var ol = jQuery('<ol></ol>')
  //console.log(users);
  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  })

  jQuery('#users').html(ol)
});

socket.on('newMessage', (message) => {
  let template = jQuery('#message-template').html()
  let html = Mustache.render(template, {
    sender: message.from,
    text: message.text,
    time: moment(message.createdAt).format('h:mm a')
  })

  jQuery('#messages').append(html)
  scrollToBottom();
})

socket.on('newLocationMessage', (message) => {

  let template = jQuery('#location-message-template').html()
  let html = Mustache.render(template, {
    sender: message.from,
    url: message.url,
    time: moment(message.createdAt).format('h:mm a')
  })

  jQuery('#messages').append(html)
  scrollToBottom();
})


////
//Jquery
////

let locationButton = jQuery('#send-location')
locationButton.on('click', () => {
  if (!navigator.geolocation) {
    return alert('Sorry this isnt avaliable for you')
  }
  locationButton.attr('disabled', 'disabled').text('Sending Location...')
  navigator.geolocation.getCurrentPosition((position) => {// success
    console.log(position)
    locationButton.removeAttr('disabled').text('Send Location')
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
     })
  }, () => { // Error handler
    locationButton.removeAttr('disabled').text('Send Location')
    alert('Unable to fetch location')
  })
})

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();
  let messageField = jQuery('[name=message]');
  if (messageField.val() !== '') {
    socket.emit('createMessage', {
      from: 'Godfery',
      text: messageField.val()
    }, function () {
      messageField.val('')
     })
  } else {
    alert('Message field must not be empty')
  }
  
})