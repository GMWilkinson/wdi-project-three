# Events

![Events](https://i.imgur.com/VusU94H.png)

Events is an app where the user can add an event that other users can then join. When the event is created the location input uses the Nominatem api to find the location on OpenStreetMap. It then puts a pin at the location on the map on the show page so that the users can find the place if necessary.

If registered, the user has a profile page that shows which events they have created and are attending. Users can also leave comments on each individual event.

This app was made in a team by Grant Wilkinson, Shamsher Shamsiddin-Zoda and Femi Coker. We made this app for mobile use primarily.

# Future Updates

* The app would have a friend feature so that the user that creates an event can choose whether only friends can see it.
* Styling tidied up
* Navbar burger should close on scroll
* The map would be able to give directions from the user's current location

![Events](https://i.imgur.com/iAy79Fn.png)

# Bugs

* Search bar doesn't work

# Code Snippets

This is the back-end function for creating comments.

```javascript
function createRoute(req, res, next) {
  Event.findById(req.params.eventId)
    .then(event => {
      req.body.user = req.tokenUserId;
      event.comments.push(req.body);
      return event.save();
    })
    .then(event => Event.populate(event, 'createdBy comments.user attendees.attendee'))
    .then(event => res.json(event))
    .catch(next);
}
```

This is the front-end function for creating comments

```javascript
$scope.createComment = function() {
  $http({
    method: 'POST',
    url: `/api/events/${$state.params.eventId}/comments`,
    data: $scope.comment
  }).then(result => {
    $scope.event = result.data;
    $scope.comment.text = null;
  });
};
```

This is the front-end registration controller

```javascript
function registerCtrl($scope, $state, $auth) {
  $scope.handleRegister = function() {
    console.log('Registered user!');
    $auth.signup($scope.user)
      .then(() => $state.go('login'))
      .catch(err => console.log('Error!', err));
  };
}
```
