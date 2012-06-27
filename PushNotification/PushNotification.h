//
// PushNotification.h
//
// Based on the Push Notifications Cordova Plugin by Olivier Louvignes on 06/05/12.
// Modified by Max Konev on 18/05/12.
//
// Pushwoosh Push Notifications Plugin for Cordova iOS
// www.pushwoosh.com
//
// MIT Licensed

#import <Foundation/Foundation.h>
#ifdef CORDOVA_FRAMEWORK
	#import <Cordova/CDVPlugin.h>
#else
	#import "CDVPlugin.h"
#endif

//Pushwoosh SDK START
@class PushNotificationManager;

@protocol PushNotificationDelegate

@optional
//handle push notification, display alert, if this method is implemented onPushAccepted will not be called, internal message boxes will not be displayed
- (void) onPushReceived:(PushNotificationManager *)pushManager onStart:(BOOL)onStart;

//user pressed OK on the push notification
- (void) onPushAccepted:(PushNotificationManager *)pushManager;
@end


@interface PushNotificationManager : NSObject {
	NSString *appCode;
	NSString *appName;
	UIViewController *navController;
	
	NSDictionary *lastPushDict;
	NSObject<PushNotificationDelegate> *delegate;
}

@property (nonatomic, copy) NSString *appCode;
@property (nonatomic, copy) NSString *appName;
@property (nonatomic, assign) UIViewController *navController;
@property (nonatomic, retain) NSDictionary *lastPushDict;
@property (nonatomic, assign) NSObject<PushNotificationDelegate> *delegate;

- (id) initWithApplicationCode:(NSString *)appCode appName:(NSString *)appName;
- (id) initWithApplicationCode:(NSString *)appCode navController:(UIViewController *) navController appName:(NSString *)appName;

//sends the token to server
- (void) handlePushRegistration:(NSData *)devToken;
- (NSString *) getPushToken;

//if the push is received when the app is running
- (BOOL) handlePushReceived:(NSDictionary *) userInfo;

//gets apn payload
- (NSDictionary *) getApnPayload;

//get custom data from the push payload
- (NSString *) getCustomPushData;

@end
//Pushwoosh SDK END

@interface PushNotification : CDVPlugin <PushNotificationDelegate> {

	NSMutableDictionary* callbackIds;
	PushNotificationManager *pushManager;
}

@property (nonatomic, retain) NSMutableDictionary* callbackIds;
@property (nonatomic, retain) PushNotificationManager *pushManager;

- (void)registerDevice:(NSMutableArray *)arguments withDict:(NSMutableDictionary*)options;
- (void)didRegisterForRemoteNotificationsWithDeviceToken:(NSString*)deviceToken;
- (void)didFailToRegisterForRemoteNotificationsWithError:(NSError*)error;
+ (NSMutableDictionary*)getRemoteNotificationStatus;
- (void)getRemoteNotificationStatus:(NSMutableArray *)arguments withDict:(NSMutableDictionary*)options;
- (void)setApplicationIconBadgeNumber:(NSMutableArray *)arguments withDict:(NSMutableDictionary*)options;
- (void)cancelAllLocalNotifications:(NSMutableArray *)arguments withDict:(NSMutableDictionary*)options;

@end

//Pushwoosh SDK START
@interface HtmlWebViewController : UIViewController<UIWebViewDelegate> {
	UIWebView *webview;
	UIActivityIndicatorView *activityIndicator;
	
	NSString *urlToLoad;
}

- (id)initWithURLString:(NSString *)url;	//this method is to use it as a standalone webview

@property (nonatomic, retain) IBOutlet UIWebView *webview;
@property (nonatomic, retain) IBOutlet UIActivityIndicatorView *activityIndicator;

@end
//Pushwoosh SDK END

#ifdef DEBUG
#   define DLog(fmt, ...) NSLog((@"%s [Line %d] " fmt), __PRETTY_FUNCTION__, __LINE__, ##__VA_ARGS__);
#else
#   define DLog(...)
#endif
#define ALog(fmt, ...) NSLog((@"%s [Line %d] " fmt), __PRETTY_FUNCTION__, __LINE__, ##__VA_ARGS__);
