# Category 5 First Robotics Competition (FRC) Scouting Mobile App and Web-based Server

## What is the app's intended use?
The Cat5 Scout app is a flexible, simple-to-use, and powerful mobile app and 
web-based application (hereafter called "the app") that helps you gather, 
compile, measure, and act upon data collected by the students in your First 
Robotics Competition team. 

The app was started in preparation for the 2016 FRC Competition, but is built 
with flexibility in mind so that the same application can be used year after 
year by simply updating the configuration settings for the application (such as 
the questions you seek to answer during competition).

## How does the app take into consideration limited bandwidth environments?

The app developers know that that there is frequently limited access to WiFi and 
cellular networks at FRC competition events. The app and server component use an
[ad hoc network](https://en.wikipedia.org/wiki/Wireless_ad_hoc_network) to 
communicate, which does not require an Internet connection. Because FRC robots 
use wifi to connect the drive station to the robots, FRC restricts the use of 
wifi within and near the competition area. Therefore you must have the server 
component running on a laptop that is not within range of the field of play to
avoid interference or wifi channel saturation.

## How much will the app cost to implement for our team?

The app takes into consideration that not all FRC teams have large budgets. The 
app is built specifically to work with one laptop and one or more mobile devices
to collect and collate data. The FRC team may choose to leverage students' 
mobile devices, but especially if you have a random collection of devices it is 
*strongly* recommended that you test the devices thoroughly before an event.

## What hardware do we need in order to use the app?

The app works best as an installed mobile app on devices such as small tablets, 
but can be run from cell phones in a pinch. 

Our recommendation is that you have at least six students gathering data and one 
student or mentor working with the full data set. A laptop is recommended for 
analyzing compiled data, due to its larger screen size and attached keyboard.

Your scouting team does not all need to be using the same hardware. You can have 
some students on cell phones and some on tablet; the app should work just as well 
as if everyone was on the same type of device.

## How can I/we help?

This open source project is open to input from the entire FRC ecosystem. If 
you're a programmer, feel free to submit pull requests with new features or bug 
fixes. If you're a user, please submit bug reports and also let us know how the 
app works on your various devices. If you have ideas for new features, send them 
in so we can assess them for feasability and scheduling. 

If you find the app helpful, spread the word to other teams via social media, 
Chief Delphi, and word-of-mouth at competitions and other events.

## What technologies does the app use?

This application is built using the AngularJS and Ionic frameworks, Cordova 
libraries, the Bootstrap 3.0 front-end framework. For information on the server
component technology stack, see 
[its readme file](https://github.com/FitzChivalry/Cat5Scout-Server/blob/master/README.md).

## Who is sponsoring this app?

This app was started by members of 
[Team 3489, Category 5](http://www.team3489.org).

## How can I contact the development team?

You can use the social features of GitHub to submit suggestions and bug reports, 
or you can contact the development team at [TBD].

